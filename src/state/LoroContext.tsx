/* eslint-disable no-console */
// TODO: Remove this comment when the code is ready for production
import { createContext, JSX, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { LoroDoc } from 'loro-crdt';
import { ClientMessage } from '@/interfaces/backend-bindings/ClientMessage';
import { JoinRoomMessage } from '@/interfaces/backend-bindings/JoinRoomMessage';
import { useLocalContext } from '@graasp/apps-query-client';
import { UpdateDocMessage } from '@/interfaces/backend-bindings/UpdateDocMessage';
import { BACKEND_HOST, BACKEND_WS_ROUTE } from '@/config/env';
import { ConnectionStatus } from '@/interfaces/status';
import { ServerMessage } from '@/interfaces/backend-bindings/ServerMessage';
import { toWebSocketUrl } from './utils';

// declare const self: DedicatedWorkerGlobalScope;

// const DATA_SNAPSHOT_LOCAL_STORAGE_KEY = 'loro-data-snapshot';

export type LoroContextType = {
  doc: LoroDoc;
  connectionStatus: ConnectionStatus;
};

const defaultContextValue = {
  doc: new LoroDoc(),
  connectionStatus: ConnectionStatus.DISCONNECTED,
};

const LoroContext = createContext<LoroContextType>(defaultContextValue);

type LoroContextProps = {
  children: JSX.Element;
};

export const LoroProvider = ({ children }: LoroContextProps): JSX.Element => {
  const {itemId, accountId} = useLocalContext();
  const [doc] = useState(new LoroDoc());
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const wsRef = useRef<WebSocket | null>(null);
  // const [roomSet, setRoomSet] = useState(false);

  const handleConfirmMessage = (data: Extract<ServerMessage, {"type": "confirm"}>): void => {
    console.debug('Handling confirm message', data);
    if (data.data?.message_type === 'join_room') {
      setConnectionStatus(ConnectionStatus.CONNECTED);
      // setRoomSet(true);
      console.debug('Joined room successfully');
    } else {
      console.warn('Unexpected confirm message type:', data.data?.message_type);
    }
  };

  const handleUpdateDocMessage = (data: Extract<ServerMessage, {"type": "update_doc"}>): void => {
    console.debug('Handling update_doc message', data);
    const updatePayload = data.data.payload;
    const updateBuffer = Uint8Array.from(updatePayload.split('').map(char => char.charCodeAt(0)));
    doc.import(updateBuffer);
    console.debug('Document updated from WebSocket message', doc.toJSON());
  };

  useEffect(() => {
    setConnectionStatus(ConnectionStatus.CONNECTING);
    const newWs = new WebSocket(toWebSocketUrl(`${BACKEND_HOST}${BACKEND_WS_ROUTE}`));

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
      console.debug('WebSocket connection opened');
    });

    newWs?.addEventListener('close', () => {
      console.debug('WebSocket connection closed');
      wsRef.current = null;
      setConnectionStatus(ConnectionStatus.DISCONNECTED);
    });

    newWs?.addEventListener('message', (event) => {
      console.debug('WebSocket message received', event);
      const data: ServerMessage = JSON.parse(event.data);
      switch (data.type) {
        case 'confirm':
          console.debug('WebSocket confirm message received', data.data);
          handleConfirmMessage(data);
          break;
        case 'update_doc':
          console.debug('WebSocket update_doc message received', data.data);
          handleUpdateDocMessage(data);
          break;
        case 'error':
          console.error('WebSocket error message received', data.data);
          break;
        default:
          console.warn('Unknown WebSocket message type received:', data);
      }
  });

    wsRef.current = newWs;
  }, [accountId, itemId]);

  useEffect(() => {
    const unsubscribe = doc.subscribe(() => {
      console.debug(wsRef.current);
      if (wsRef.current !== null && wsRef.current.readyState === WebSocket.OPEN) {
        console.debug('Sending update to WebSocket');
        const updatePayload = String.fromCharCode(...doc.export({ mode: "update"}));
        const updateDocMessage: UpdateDocMessage = {
          payload: updatePayload,
        };
        const msg: ClientMessage = {
          type: 'update_doc',
          data: updateDocMessage,
        };
        wsRef.current.send(JSON.stringify(msg));
      } else {
        console.warn('WebSocket is not connected, cannot send update');
      }
      console.debug('Document updated', doc.toJSON());
    });
    return () => unsubscribe();
  }, [doc]);

  // responses.subscribe((event: LoroEventBatch) => {
  //   console.debug('Responses updated ', event);
  //   self.postMessage({
  //     type: AppStateEventType.ALL_RESPONSES,
  //     data: responses.toArray(),
  //   });
  // });

  // doc.subscribe(() => {
  //   self.console.log('Document updated');
  //   const { updateMessage, updateVersion, transferables } = getUpdate(
  //     doc,
  //     lastUpdateVersion,
  //   );
  //   lastUpdateVersion = updateVersion;
  //   self.postMessage(updateMessage, transferables);
  // });

  const contextValue = useMemo(
    () => ({
      doc,
      connectionStatus,
    }),
    [connectionStatus, doc],
  );
  return (
    <LoroContext.Provider value={contextValue}>{children}</LoroContext.Provider>
  );
};

export const useLoroContext = (): LoroContextType => useContext(LoroContext);

// self.addEventListener('online', () => {
//   console.log('Online');
// });

// self.addEventListener('message', (event: MessageEvent) => {
//   const { type, data } = event.data;

//   console.debug('Received message', type, data);

//   if (type === AppStateEventType.UPDATE_CONFIG) {
//     self.console.log('Updating config', data);
//     config = data;
//   } else if (typeof config !== 'undefined') {
//     switch (type) {
//       case AppStateEventType.POST_RESPONSE:
//         self.postMessage(postResponse(data, config.author, responses));
//         doc.commit();
//         break;
//       case AppStateEventType.POST_UPDATE: {
//         self.console.log('Received update with data:', data);
//         const buffer = new Uint8Array(data);
//         doc.import(buffer);
//         break;
//       }
//       case 'delete':
//         break;
//       default:
//         // eslint-disable-next-line no-console
//         console.warn('Unknown message type:', type);
//     }
//   } else {
//     // eslint-disable-next-line no-console
//     console.warn('No config set');
//   }

//   // Send back the updated document
//   // self.postMessage({ type: 'update', data: doc.toJSON() });
// });

// self.postMessage({ type: AppStateEventType.GET_CONFIG });
