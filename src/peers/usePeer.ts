import { useCallback, useEffect, useRef, useState } from 'react';

import { DataConnection, Peer } from 'peerjs';

import { PeerMessage, PeerMessageType } from './peerMessages';
import useGraaspSignaling from './useGraaspSignaling';

export enum PeerStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  NONE = 'NONE',
}

interface UsePeerValues {
  connectToPeer: (peerId: string) => void;
  broadcast: (message: PeerMessage) => void;
  status: PeerStatus;
}

const defaultOnMessage = (message: PeerMessage, from?: string): void => {
  console.info('Received ', message, ' from ', from);
};

const usePeer = (
  onMessage: (message: PeerMessage, from?: string) => void = defaultOnMessage,
): UsePeerValues => {
  const peer = useRef<Peer | null>(null);

  const [myPeerId, setMyPeerId] = useState<string>();

  const { peersInfos } = useGraaspSignaling(myPeerId);
  const [dataChannels, setDataChannels] = useState<Array<DataConnection>>([]);

  const [status, setStatus] = useState(PeerStatus.NONE);

  const setupDataChannel = useCallback(
    (dataChannel: DataConnection): void => {
      dataChannel.on('open', () => {
        console.info('Data channel opened');
        setDataChannels((prevDataChannels) => [
          ...prevDataChannels,
          dataChannel,
        ]);
      });
      dataChannel.on('data', (data) => {
        onMessage(data as PeerMessage, dataChannel.peer);
      });
      dataChannel.on('close', () => {
        console.info('Data channel closed');
        setDataChannels((prevDataChannels) =>
          prevDataChannels.filter((dc) => dc !== dataChannel),
        );
      });
    },
    [onMessage],
  );

  useEffect(() => {
    const newPeer = new Peer({
      host: 'localhost',
      port: 9000,
      path: '/myapp',
      debug: 3,
      config: {
        iceServers: [
          { urls: 'turn:127.0.0.1:3478', username: 'user', credential: 'pass' },
        ],
      },
    });
    newPeer.on('open', (id) => {
      console.info(`Peer connected with id: ${id}`);
      setStatus(PeerStatus.CONNECTED);
      setMyPeerId(id);
    });

    newPeer.on('connection', setupDataChannel);
    newPeer.on('disconnected', () => {
      console.warn('Peer disconnected');
      setStatus(PeerStatus.DISCONNECTED);
    });
    peer.current = newPeer;
    return () => {
      console.info(`Disconnecting peer ${newPeer.id}`);
      newPeer.disconnect();
      newPeer.destroy();
      peer.current = null;
      setMyPeerId(undefined);
      setStatus(PeerStatus.NONE);
    };
  }, []);

  const broadcast = useCallback(
    (message: PeerMessage): void => {
      dataChannels.forEach((dataChannel) => {
        console.debug(
          'Broadcasting message ',
          message.type,
          ' to data channel of peer:',
          dataChannel.peer,
        );
        dataChannel.send(message);
      });
    },
    [dataChannels],
  );

  const ENABLE_HEARTBEAT = false;
  useEffect(() => {
    if (ENABLE_HEARTBEAT) {
      const interval = setInterval(() => {
        broadcast({ type: PeerMessageType.heartbeat, data: 'ping' });
      }, 1000);

      return () => clearInterval(interval);
    }
    return undefined;
  }, [ENABLE_HEARTBEAT, broadcast]);

  const connectToPeer = useCallback(
    (peerId: string): void => {
      console.info(
        `Connecting to peer: ${peerId} from peer ${peer.current?.id}`,
      );
      const dataChannel = peer.current?.connect(peerId);
      if (dataChannel) {
        console.info('Connected to peer:', peerId);
        setupDataChannel(dataChannel);
        dataChannel.send(`Hello from peer ${peer.current?.id}`);
      }
    },
    [peer, setupDataChannel],
  );
  useEffect(() => {
    if (peersInfos.length > 0) {
      peersInfos.forEach(({ id }) => {
        connectToPeer(id);
      });
    }
  }, [connectToPeer, peersInfos]);

  return {
    broadcast,
    connectToPeer,
    status,
  };
};

export default usePeer;
