import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { InputResponseData, ResponseData } from '@/interfaces/response';

import {
  AppStateEventType,
  AppStateWorkerConfig,
} from './appStateWorkerConfig';
import { PeerMessage, PeerMessageType } from './peerMessages';
import usePeer from './usePeer';
import AppStateWorker from './worker/appStateWorker?worker';

export type AppStateWorkerContextType = {
  responses: {
    allResponses: ResponseData<undefined>[];
    postResponse: (
      response: InputResponseData,
      callback?: (response: ResponseData) => void,
    ) => void;
  };
};

const defaultContextValue = {
  responses: {
    allResponses: [],
    postResponse: () => undefined,
  },
};

const AppStateWorkerContext =
  createContext<AppStateWorkerContextType>(defaultContextValue);

type Props = {
  children: JSX.Element;
};

export const AppStateWorkerProvider = ({ children }: Props): JSX.Element => {
  //   const AppStateWorker: Worker = useMemo(() =>
  //     new Worker(new URL('../workers/AppStateWorker.js', import.meta.url)), []);
  const appStateWorker: Worker = useMemo(() => new AppStateWorker(), []);

  const { broadcast, setOnReceive } = usePeer();

  // TODO: Take config from the backend
  const workerConfig: AppStateWorkerConfig = {
    author: {
      id: '123',
      name: 'John Doe',
    },
  };

  const handleReceive = useCallback(
    (message: PeerMessage, from: string) => {
      console.debug('Received message', message, ' from ', from);
      switch (message.type) {
        case PeerMessageType.UPDATE:
        appStateWorker.postMessage({
          type: AppStateEventType.POST_UPDATE,
          data: message.data,
        });
        break;
        default:
          console.warn('Unknown message type', message.type, ' from ', from);
      }
    },
    [appStateWorker],
  );

  useEffect(() => {
    setOnReceive(() => handleReceive);
    return () => setOnReceive(() => undefined);
  }, [setOnReceive, handleReceive]);

  useEffect(() => {
    console.debug(
      'Posting config ',
      workerConfig,
      ' to worker ',
      appStateWorker,
    );
    appStateWorker.postMessage({
      type: AppStateEventType.UPDATE_CONFIG,
      data: workerConfig,
    });
    // return () => appStateWorker.terminate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [allResponses, setAllResponses] = useState<ResponseData<undefined>[]>(
    [] as ResponseData<undefined>[],
  );

  const processEvent = useCallback(
    (event: MessageEvent): void => {
      console.debug('Processing event', event);
      switch (event.data.type) {
        case AppStateEventType.ALL_RESPONSES:
          setAllResponses(event.data.data);
          break;
        case AppStateEventType.GET_CONFIG:
          appStateWorker.postMessage({
            type: AppStateEventType.UPDATE_CONFIG,
            data: workerConfig,
          });
          break;
        case AppStateEventType.SEND_UPDATE:
          console.debug('Sending update', event.data.data);
          broadcast({
            type: PeerMessageType.UPDATE,
            data: event.data.data,
          });
          break;
        default:
          // eslint-disable-next-line no-console
          console.warn('Unknown event type', event.data.type);
      }
    },
    [appStateWorker, workerConfig],
  );

  useEffect(() => {
    if (window.Worker && AppStateWorker) {
      appStateWorker.addEventListener('message', processEvent);
    }
  }, [appStateWorker, processEvent]);

  const postResponse = useCallback(
    (data: InputResponseData, callback?: (response: ResponseData) => void) => {
      console.debug('Posting response', data);
      appStateWorker.postMessage({
        type: AppStateEventType.POST_RESPONSE,
        data,
      });
      appStateWorker.addEventListener(
        'message',
        (event) => {
          if (
            event.data.type === AppStateEventType.POST_RESPONSE &&
            event.data.isResponse
          ) {
            callback?.(event.data.data);
          }
        },
        { once: true },
      );
    },
    [appStateWorker],
  );

  const contextValue = useMemo(
    () => ({
      responses: {
        allResponses,
        postResponse,
      },
    }),
    [allResponses, postResponse],
  );

  return (
    <AppStateWorkerContext.Provider value={contextValue}>
      {children}
    </AppStateWorkerContext.Provider>
  );
};

export const useAppStateWorkerContext = (): AppStateWorkerContextType =>
  React.useContext<AppStateWorkerContextType>(AppStateWorkerContext);
