import {
  FC,
  JSX,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useLocalContext } from '@graasp/apps-query-client';

import { LoroList, LoroMap } from 'loro-crdt';
import { v4 } from 'uuid';

import useActions from '@/hooks/useActions';
import { ResponseVisibilityMode } from '@/interfaces/activity_state';
import { ResponseData } from '@/interfaces/response';
import { Threads } from '@/interfaces/threads';
import { useSettings } from '@/modules/context/SettingsContext';

import { useLoroContext } from './LoroContext';
import useActivityState from './useActivityState';
import useParticipants from './useParticipants';
import { getThreadById, getThreadsList } from './utils';

type ThreadsContextType = {
  allThreads: Threads;
  myThreads: Threads;
  availableResponses: Threads;
  postResponse: (
    response: ResponseData,
    threadId?: string,
  ) => Promise<ResponseData> | undefined;
  deleteResponse: (position: number, threadId: string) => Promise<void>;
  deleteResponseById: (id: string, threadId: string) => Promise<void>;
  updateResponse: (
    newResponse: ResponseData,
    threadId: string,
  ) => Promise<void>;
};
const defaultContextValue: ThreadsContextType = {
  allThreads: [],
  myThreads: [],
  postResponse: () => undefined,
  availableResponses: [],
  deleteResponse: () => Promise.resolve(),
  deleteResponseById: () => Promise.resolve(),
  updateResponse: () => Promise.resolve(),
};

const ThreadsContext = createContext<ThreadsContextType>(defaultContextValue);

type ThreadsContextProps = {
  children: JSX.Element;
};

export const ThreadsProvider: FC<ThreadsContextProps> = ({ children }) => {
  const participants = useParticipants();
  const activityState = useActivityState();
  const { round } = activityState;

  const { accountId } = useLocalContext();
  const { activity } = useSettings();
  const { postDeleteResponseAction, postSubmitNewResponseAction } =
    useActions();
  const { mode: visibilityMode } = activity;

  const { doc } = useLoroContext();

  const [allThreads, setAllThreads] = useState<Threads>([]);

  useEffect(() => {
    const threadsLocal = getThreadsList(doc);
    const unsubscribe = threadsLocal.subscribe(() => {
      const threads: Threads = threadsLocal.toArray().map((thread) => ({
        id: thread.get('id'),
        createdAt: thread.get('createdAt'),
        updatedAt: thread.get('updatedAt'),
        creator: thread.get('creator'),
        responses: thread.get('responses').toArray(),
        evaluations: thread.get('evaluations') || [],
      }));
      setAllThreads(threads);
    });

    return () => {
      unsubscribe();
    };
  }, [doc]);

  const myThreads = useMemo((): Threads => {
    const threads = allThreads.filter(
      ({ creator }) => creator.id === accountId, // TODO: Check if this is correct
    );
    return threads;
  }, [allThreads, accountId]);

  const availableResponses = useMemo((): Threads => {
    if (visibilityMode === ResponseVisibilityMode.Sync) {
      return allThreads;
    }
    if (visibilityMode === ResponseVisibilityMode.Async) {
      const threads = allThreads.map((t) => ({
        ...t,
        responses: t.responses.filter((r) => {
          const { round: responseRound, author } = r;
          if (responseRound) {
            return responseRound < round || author.id === accountId;
          }
          return author.id === accountId;
        }),
      }));
      return threads;
    }
    return myThreads;
  }, [visibilityMode, myThreads, allThreads, accountId, round]);

  const postResponse = useCallback(
    async (
      response: ResponseData,
      threadId?: string,
    ): Promise<ResponseData> => {
      if (threadId) {
        const thread = getThreadById(getThreadsList(doc), threadId);
        thread.get('responses').push(response);
        doc.commit();
        postSubmitNewResponseAction(response, threadId);
        return response;
      }

      // Create a new thread
      const threads = getThreadsList(doc);
      const newThread = new LoroMap();
      const newThreadId = v4();
      newThread.set('id', newThreadId);
      newThread.set('createdAt', new Date());
      newThread.set('updatedAt', new Date());
      newThread.set('creator', participants.me!);

      const newResponsesList = new LoroList<ResponseData>();
      newResponsesList.push(response);
      newThread.setContainer('responses', newResponsesList);

      const evaluationsList = new LoroList();
      newThread.setContainer('evaluations', evaluationsList);

      threads.pushContainer(newThread);
      doc.commit();
      postSubmitNewResponseAction(response, newThreadId);
      return response;
    },
    [doc, participants, postSubmitNewResponseAction],
  );

  const deleteResponse = useCallback(
    async (position: number, threadId: string): Promise<void> => {
      const thread = getThreadById(getThreadsList(doc), threadId);
      const responseToBeDeleted = thread.get('responses').get(position);
      thread.get('responses').delete(position, 1);
      postDeleteResponseAction(responseToBeDeleted.id);
      doc.commit();
    },
    [doc, postDeleteResponseAction],
  );

  const deleteResponseById = useCallback(
    async (id: string, threadId: string) => {
      const thread = getThreadById(getThreadsList(doc), threadId);
      const index = thread
        .get('responses')
        .toArray()
        .findIndex((r) => r.id === id);
      deleteResponse(index, threadId);
    },
    [deleteResponse, doc],
  );

  const updateResponse = useCallback(
    async (newResponse: ResponseData, threadId: string): Promise<void> => {
      const thread = getThreadById(getThreadsList(doc), threadId);
      const index = thread
        .get('responses')
        .toArray()
        .findIndex((r) => r.id === newResponse.id);
      if (index > -1) {
        thread.get('responses').delete(index, 1);
        thread.get('responses').insert(index, newResponse);
        doc.commit();
      } else {
        thread.get('responses').push(newResponse);
        doc.commit();
      }
    },
    [doc],
  );

  const contextValue = useMemo(
    () => ({
      allThreads,
      myThreads,
      availableResponses,
      deleteResponse,
      deleteResponseById,
      postResponse,
      updateResponse,
    }),
    [
      allThreads,
      availableResponses,
      deleteResponse,
      deleteResponseById,
      myThreads,
      postResponse,
      updateResponse,
    ],
  );
  return (
    <ThreadsContext.Provider value={contextValue}>
      {children}
    </ThreadsContext.Provider>
  );
};

export const useThreadsContext = (): ThreadsContextType =>
  useContext(ThreadsContext);
