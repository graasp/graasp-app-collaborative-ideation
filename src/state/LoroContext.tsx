import {
  JSX,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useLocalContext } from '@graasp/apps-query-client';

import { EphemeralStore, LoroDoc } from 'loro-crdt';

import { BACKEND_HOST, BACKEND_WS_ROUTE } from '@/config/env';
import { ClientMessage } from '@/interfaces/backend-bindings/ClientMessage';
import { JoinRoomMessage } from '@/interfaces/backend-bindings/JoinRoomMessage';
import { ServerMessage } from '@/interfaces/backend-bindings/ServerMessage';
import { UpdateDocMessage } from '@/interfaces/backend-bindings/UpdateDocMessage';
import { UpdateTmpStateMessage } from '@/interfaces/backend-bindings/UpdateTmpStateMessage';
import { ConnectionStatus } from '@/interfaces/status';
import { binToString, stringToBin } from '@/utils/ws_codec';

import { ONLINE_USERS_KEY, TMP_STATE_TIMEOUT } from './TmpState';
import { toWebSocketUrl } from './utils';

export type LoroContextType = {
  doc: LoroDoc;
  tmpState: EphemeralStore;
  connectionStatus: ConnectionStatus;
  sendMessage: (message: ClientMessage) => void;
  reconnect: () => void;
};

const defaultContextValue = {
  doc: new LoroDoc(),
  tmpState: new EphemeralStore(),
  connectionStatus: ConnectionStatus.DISCONNECTED,
  sendMessage: (): void => {
    // Default implementation does nothing
  },
  reconnect: (): void => {
    // Default implementation does nothing
  },
};

const LoroContext = createContext<LoroContextType>(defaultContextValue);

type LoroContextProps = {
  children: JSX.Element;
};

export const LoroProvider = ({ children }: LoroContextProps): JSX.Element => {
  const { itemId, accountId } = useLocalContext();
  const [doc] = useState(new LoroDoc());
  const [tmpState] = useState(new EphemeralStore(TMP_STATE_TIMEOUT));
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    ConnectionStatus.DISCONNECTED,
  );
  const wsRef = useRef<WebSocket | null>(null);
  // const [roomSet, setRoomSet] = useState(false);

  const lastOnlineUserId = useRef<string>(undefined);

  const handleConfirmMessage = useCallback(
    (data: Extract<ServerMessage, { type: 'confirm' }>): void => {
      if (data.data?.message_type === 'join_room') {
        setConnectionStatus(ConnectionStatus.CONNECTED);
        const getDocMessage: Extract<ClientMessage, { type: 'get_doc' }> = {
          type: 'get_doc',
          data: {
            version_vector: null, // Assuming we want the latest version
          },
        };
        wsRef.current?.send(JSON.stringify(getDocMessage));
      } else {
        // eslint-disable-next-line no-console
        console.warn(
          'Unexpected confirm message type:',
          data.data?.message_type,
        );
      }
    },
    [],
  );

  const handleUpdateTmpStateMessage = useCallback(
    (data: Extract<ServerMessage, { type: 'update_tmp_state' }>) => {
      const updatePayload = data.data.payload;
      const updateBuffer = stringToBin(updatePayload);
      tmpState.apply(updateBuffer);
    },
    [tmpState],
  );

  const handleUpdateDocMessage = useCallback(
    (data: Extract<ServerMessage, { type: 'update_doc' }>): void => {
      const updatePayload = data.data.payload;
      const updateBuffer = Uint8Array.from(
        updatePayload.split('').map((char) => char.charCodeAt(0)),
      );
      doc.import(updateBuffer);
    },
    [doc],
  );

  const sendMessage = useCallback((message: ClientMessage): void => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      // eslint-disable-next-line no-console
      console.warn('WebSocket is not connected, cannot send message');
    }
  }, []);

  // Ping
  useEffect(() => {
    const pingInterval = setInterval(() => {
      if (connectionStatus === ConnectionStatus.CONNECTED && accountId) {
        const onlineUsers =
          (tmpState.get(ONLINE_USERS_KEY) as Array<string>) || [];

        let otherOnlineUsers: string[] = onlineUsers.filter(
          (i) => i !== accountId,
        );

        const lastOnlineUserIdNow = onlineUsers[-1];
        if (lastOnlineUserId.current === lastOnlineUserIdNow) {
          otherOnlineUsers = otherOnlineUsers.filter(
            (i) => i !== lastOnlineUserIdNow,
          );
          lastOnlineUserId.current = undefined;
        } else {
          lastOnlineUserId.current = lastOnlineUserIdNow;
        }
        tmpState.set(ONLINE_USERS_KEY, [accountId, ...otherOnlineUsers]);
      }
    }, TMP_STATE_TIMEOUT);
    return () => clearInterval(pingInterval);
  }, [accountId, connectionStatus, tmpState]);

  const connect = useCallback((): void => {
    setConnectionStatus(ConnectionStatus.CONNECTING);
    const newWs = new WebSocket(
      toWebSocketUrl(`${BACKEND_HOST}${BACKEND_WS_ROUTE}`),
    );

    newWs?.addEventListener('open', () => {
      const joinRoomMessage: JoinRoomMessage = {
        id: itemId,
        user_id: accountId || 'anonymous',
      };
      const msg: ClientMessage = {
        type: 'join_room',
        data: joinRoomMessage,
      };
      newWs.send(JSON.stringify(msg));
    });

    newWs?.addEventListener('close', () => {
      // eslint-disable-next-line no-console
      console.debug('WebSocket connection closed');
      wsRef.current = null;
      setConnectionStatus(ConnectionStatus.DISCONNECTED);
    });

    newWs?.addEventListener('message', (event) => {
      const data: ServerMessage = JSON.parse(event.data);
      switch (data.type) {
        case 'confirm':
          handleConfirmMessage(data);
          break;
        case 'update_doc':
          handleUpdateDocMessage(data);
          break;
        case 'update_tmp_state':
          handleUpdateTmpStateMessage(data);
          break;
        case 'error':
          // eslint-disable-next-line no-console
          console.error('WebSocket error message received', data.data);

          break;
        default:
          // eslint-disable-next-line no-console
          console.warn('Unknown WebSocket message type received:', data);
      }
    });

    wsRef.current = newWs;
  }, [
    accountId,
    handleConfirmMessage,
    handleUpdateDocMessage,
    handleUpdateTmpStateMessage,
    itemId,
  ]);

  const reconnect = useCallback((): void => {
    wsRef.current?.close();
    setTimeout(() => {
      if (
        wsRef.current === null ||
        wsRef.current.readyState === WebSocket.CLOSED
      ) {
        connect();
      }
    }, 1000);
  }, [connect]);

  useEffect(() => {
    connect();
  }, [
    accountId,
    connect,
    handleConfirmMessage,
    handleUpdateDocMessage,
    handleUpdateTmpStateMessage,
    itemId,
  ]);

  useEffect(() => {
    const unsubscribeEphemeral = tmpState.subscribeLocalUpdates(() => {
      if (
        wsRef.current !== null &&
        wsRef.current.readyState === WebSocket.OPEN
      ) {
        const updatePayload = binToString(tmpState.encodeAll());
        const updateTmpStateMessage: UpdateTmpStateMessage = {
          payload: updatePayload,
        };
        const msg: ClientMessage = {
          type: 'update_tmp_state',
          data: updateTmpStateMessage,
        };
        wsRef.current.send(JSON.stringify(msg));
      } else {
        // eslint-disable-next-line no-console
        console.warn(
          'WebSocket is not connected, cannot send ephemeral update',
        );
      }
    });
    const unsubscribe = doc.subscribe(() => {
      if (
        wsRef.current !== null &&
        wsRef.current.readyState === WebSocket.OPEN
      ) {
        const updatePayload = String.fromCharCode(
          ...doc.export({ mode: 'update' }),
        );
        const updateDocMessage: UpdateDocMessage = {
          payload: updatePayload,
        };
        const msg: ClientMessage = {
          type: 'update_doc',
          data: updateDocMessage,
        };
        wsRef.current.send(JSON.stringify(msg));
      } else {
        // eslint-disable-next-line no-console
        console.warn('WebSocket is not connected, cannot send update');
      }
    });
    return () => {
      unsubscribe();
      unsubscribeEphemeral();
    };
  }, [doc, tmpState]);

  const contextValue = useMemo(
    () => ({
      doc,
      tmpState,
      connectionStatus,
      sendMessage,
      reconnect,
    }),
    [connectionStatus, doc, reconnect, sendMessage, tmpState],
  );
  return (
    <LoroContext.Provider value={contextValue}>{children}</LoroContext.Provider>
  );
};

export const useLoroContext = (): LoroContextType => useContext(LoroContext);
