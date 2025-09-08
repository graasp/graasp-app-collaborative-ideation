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

import useActions from '@/hooks/useActions';
import { ResponseVisibilityMode } from '@/interfaces/activity_state';
import { ResponseData } from '@/interfaces/response';
import { useSettings } from '@/modules/context/SettingsContext';

import { useLoroContext } from './LoroContext';
import useActivityState from './useActivityState';
import useParticipants from './useParticipants';
import { getResponsesList } from './utils';

type ResponsesContextType = {
  allResponses: ResponseData[];
  myResponses: ResponseData[];
  availableResponses: ResponseData[];
  postResponse: (response: ResponseData) => Promise<ResponseData> | undefined;
  deleteResponse: (position: number) => Promise<void>;
  deleteResponseById: (id: string) => Promise<void>;
  updateResponse: (newResponse: ResponseData) => Promise<void>;
};
const defaultContextValue: ResponsesContextType = {
  allResponses: [],
  myResponses: [],
  postResponse: () => undefined,
  availableResponses: [],
  deleteResponse: () => Promise.resolve(),
  deleteResponseById: () => Promise.resolve(),
  updateResponse: () => Promise.resolve(),
};

const ResponsesContext =
  createContext<ResponsesContextType>(defaultContextValue);

type ResponsesContextProps = {
  children: JSX.Element;
};

export const ResponsesProvider: FC<ResponsesContextProps> = ({ children }) => {
  const participants = useParticipants();
  const activityState = useActivityState();
  const { round } = activityState;

  const { accountId } = useLocalContext();
  const { activity } = useSettings();
  const { postDeleteResponseAction, postSubmitNewResponseAction } =
    useActions();
  const { mode: visibilityMode } = activity;

  const { doc } = useLoroContext();

  const [allResponses, setAllResponses] = useState<ResponseData[]>([]);

  useEffect(() => {
    const responsesLocal = getResponsesList(doc);
    const unsubscribe = responsesLocal.subscribe(() => {
      const r = getResponsesList(doc);
      setAllResponses(r.toArray() as ResponseData[]);
    });

    return () => {
      unsubscribe();
    };
  }, [doc]);

  const myResponses = useMemo((): ResponseData[] => {
    const responses = allResponses.filter(
      ({ author }) => author.id === accountId, // TODO: Check if this is correct
    );
    // return responses.sort((a, b) => compareDesc(a.updatedAt, b.updatedAt));
    return responses;
  }, [allResponses, accountId]);

  const availableResponses = useMemo((): ResponseData[] => {
    if (visibilityMode === ResponseVisibilityMode.Sync) {
      return allResponses;
    }
    if (visibilityMode === ResponseVisibilityMode.Async) {
      const responses = allResponses.filter((r) => {
        const { round: responseRound, author } = r;
        if (responseRound) {
          return responseRound < round || author.id === accountId;
        }
        return author.id === accountId;
      });
      return responses;
    }
    return myResponses;
  }, [visibilityMode, myResponses, allResponses, accountId, round]);

  const postResponse = useCallback(
    async (response: ResponseData): Promise<ResponseData> => {
      const responses = getResponsesList(doc);
      responses.push(response);
      doc.commit();
      postSubmitNewResponseAction(response);
      return response;
    },
    [doc, postSubmitNewResponseAction],
  );

  const deleteResponse = useCallback(
    async (position: number): Promise<void> => {
      const responsesLocal = getResponsesList(doc);
      const responseToBeDeleted = responsesLocal.get(position) as ResponseData;

      responsesLocal.delete(position, 1);
      postDeleteResponseAction(responseToBeDeleted.id);
      doc.commit();
    },
    [doc, postDeleteResponseAction],
  );

  const deleteResponseById = useCallback(
    async (id: string) => {
      const index = allResponses.findIndex((r) => r.id === id);
      if (index > -1) {
        deleteResponse(index);
      }
    },
    [allResponses, deleteResponse],
  );

  const updateResponse = useCallback(
    async (newResponse: ResponseData): Promise<void> => {
      const responsesLocal = getResponsesList(doc);
      const index = responsesLocal
        .toArray()
        .findIndex((r) => r.id === newResponse.id);
      if (index > -1) {
        responsesLocal.delete(index, 1);
        responsesLocal.insert(index, newResponse);
        doc.commit();
      } else {
        responsesLocal.push(newResponse);
        doc.commit();
      }
    },
    [doc],
  );

  const contextValue = useMemo(
    () => ({
      allResponses,
      myResponses,
      availableResponses,
      participants,
      deleteResponse,
      deleteResponseById,
      postResponse,
      updateResponse,
    }),
    [
      allResponses,
      availableResponses,
      deleteResponse,
      deleteResponseById,
      myResponses,
      participants,
      postResponse,
      updateResponse,
    ],
  );
  return (
    <ResponsesContext.Provider value={contextValue}>
      {children}
    </ResponsesContext.Provider>
  );
};

export const useResponsesContext = (): ResponsesContextType =>
  useContext(ResponsesContext);
