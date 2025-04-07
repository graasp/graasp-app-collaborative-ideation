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
import { ResponseVisibilityMode } from '@/interfaces/interactionProcess';
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
};
const defaultContextValue: ResponsesContextType = {
  allResponses: [],
  myResponses: [],
  postResponse: () => undefined,
  availableResponses: [],
  deleteResponse: () => Promise.resolve(),
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

  //   const allResponsesSets = useMemo((): ResponsesSetAppData[] => {
  //     const responses = appData.filter(
  //       ({ creator, type }) =>
  //         creator?.id === orchestrator.id && type === AppDataTypes.ResponsesSet,
  //     ) as ResponsesSetAppData[];
  //     return responses;
  //   }, [appData, orchestrator]);

  //   const myResponsesSets = useMemo((): ResponsesSetAppData[] => {
  //     const responses = appData.filter(
  //       ({ creator, type, account, data }) =>
  //         creator?.id === orchestrator.id &&
  //         type === AppDataTypes.ResponsesSet &&
  //         account.id === accountId &&
  //         typeof data?.assistant === 'undefined',
  //     ) as ResponsesSetAppData[];
  //     return responses;
  //   }, [appData, accountId, orchestrator]);

  //   const assistantsResponsesSets = useMemo((): ResponsesSetAppData[] => {
  //     const responses = appData.filter(
  //       ({ creator, type, data }) =>
  //         creator?.id === orchestrator.id &&
  //         type === AppDataTypes.ResponsesSet &&
  //         typeof data?.assistant !== 'undefined',
  //     ) as ResponsesSetAppData[];
  //     return responses;
  //   }, [appData, orchestrator]);

  //   const availableResponses = useMemo((): ResponseAppData[] => {
  //     if (visibilityMode === ResponseVisibilityMode.OpenLive) {
  //       return allResponses;
  //     }
  //     const responses = allResponses.filter((r) => {
  //       const { id } = r;
  //       let okay = false;
  //       // Checks that the response has been assigned to the user.
  //       myResponsesSets.forEach((s) => {
  //         if (s.data.responses.includes(id)) {
  //           okay = true;
  //         }
  //       });
  //       return okay || isOwnResponse(r as ResponseAppData, accountId ?? '');
  //     }) as ResponseAppData[];
  //     return responses;
  //   }, [allResponses, accountId, myResponsesSets, visibilityMode]);

  // const postResponse = (
  //   data: ResponseData,
  //   invalidateAll: boolean = false,
  // ): Promise<ResponseAppData> | undefined =>
  //   postAppDataAsync({
  //     type: AppDataTypes.Response,
  //     visibility: AppDataVisibility.Item,
  //     data,
  //   })?.then((postedResponse) => {
  //     const response = postedResponse as ResponseAppData;
  //     postSubmitNewResponseAction(response);
  //     if (invalidateAll) {
  //       invalidateAppData();
  //     }
  //     return response;
  //   });

  //   const postResponsesSet = async (
  //     id: Member['id'] | AssistantId,
  //     responsesSet: Array<ResponseAppData['id']>,
  //     forAssistant: boolean = false,
  //   ): Promise<ResponsesSetAppData> => {
  //     const payload = {
  //       data: {
  //         round,
  //         responses: responsesSet,
  //         assistant: forAssistant ? id : undefined,
  //       },
  //       accountId: forAssistant ? accountId : id,
  //       type: AppDataTypes.ResponsesSet,
  //       visibility: AppDataVisibility.Item,
  //     };
  //     const promise = postAppDataAsync(payload) as Promise<ResponsesSetAppData>;
  //     if (promise) {
  //       return promise;
  //     }
  //     throw Error('Something went wrong with the request.'); // TODO: change
  //   };

  //   const createAllResponsesSetWorker = (
  //     responsePool: ResponseAppData[],
  //   ): void => {
  //     let sets: Map<string, ResponseAppData[]>;
  //     let assistantSets: Map<string, ResponseAppData[]>;
  //     const participantIterator = participants.members.entries();
  //     const assistantsIterator = participants.assistants.entries();
  //     if (visibilityMode === ResponseVisibilityMode.PartiallyBlind) {
  //       const participantsRepsonses = appDataArrayToMap(
  //         shuffle(filterBotResponses(responsePool, false)),
  //       );
  //       const botResponses = appDataArrayToMap(
  //         shuffle(filterBotResponses(responsePool, true)),
  //       );

  //       const participantRCopy = cloneDeep(participantsRepsonses);
  //       const botRCopy = cloneDeep(botResponses);
  //       sets = recursivelyCreateAllPartiallyBlindSets(
  //         participantIterator,
  //         participantsRepsonses,
  //         botResponses,
  //         numberOfResponsesPerSet,
  //         numberOfBotResponsesPerSet,
  //         exclusiveResponseDistribution,
  //       );
  //       assistantSets = recursivelyCreateAllPartiallyBlindSets(
  //         assistantsIterator,
  //         participantRCopy,
  //         botRCopy,
  //         numberOfResponsesPerSet,
  //         numberOfBotResponsesPerSet,
  //         exclusiveResponseDistribution,
  //       );
  //     } else {
  //       const responses = appDataArrayToMap(shuffle(responsePool));
  //       const responsesCopy = cloneDeep(responses);
  //       sets = recursivelyCreateAllOpenSets(participantIterator, responses);
  //       assistantSets = recursivelyCreateAllOpenSets(
  //         assistantsIterator,
  //         responsesCopy,
  //       );
  //     }
  //     sets.forEach((responsesSet, participantId) => {
  //       const responsesSetDataWithId = responsesSet.map(({ id }) => id);
  //       postResponsesSet(participantId, responsesSetDataWithId);
  //     });
  //     assistantSets.forEach((responsesSet, assistantId) => {
  //       const responsesSetDataWithId = responsesSet.map(({ id }) => id);
  //       postResponsesSet(assistantId, responsesSetDataWithId, true);
  //     });
  //   };

  //   const createAllResponsesSet = async (): Promise<void> => {
  //     refetchAppData().then((result) => {
  //       if (result) {
  //         const { data, isSuccess } = result;
  //         if (isSuccess) {
  //           const responsePool = getRoundResponses(getResponses(data), round);
  //           createAllResponsesSetWorker(responsePool);
  //         }
  //       } else {
  //         // TODO: Change error message
  //         throw new Error('Failed to refetch app data.');
  //       }
  //     });
  //   };

  //   const deleteResponsesSetsForRound = useCallback(
  //     async (roundToDelete: number): Promise<void> => {
  //       allResponsesSets
  //         .filter(({ data }) => data.round === roundToDelete)
  //         .forEach(({ id }) => {
  //           deleteAppData({ id });
  //         });
  //     },
  //     [allResponsesSets, deleteAppData],
  //   );

  //   const deleteAllResponsesSet = async (): Promise<void> => {
  //     allResponsesSets.forEach(({ id }) => {
  //       deleteAppData({ id });
  //     });
  //   };

  const deleteResponse = useCallback(
    async (position: number): Promise<void> => {
      const responsesLocal = getResponsesList(doc);
      const responseToBeDeleted = responsesLocal.get(position) as ResponseData;

      responsesLocal.delete(position, 1);
      postDeleteResponseAction(responseToBeDeleted.id);
    },
    [doc, postDeleteResponseAction],
  );

  //   const importResponses = async (
  //     responsesData: Array<ResponseDataExchangeFormat>,
  //   ): Promise<void> => {
  //     responsesData.forEach((r) =>
  //       postResponse(
  //         responseDataFactory(
  //           {
  //             response: r.response,
  //             round: r?.round,
  //             bot: r?.bot,
  //             assistantId: r?.assistantId,
  //             encoding: r?.encoding,
  //             originalResponse: r?.originalResponse,
  //             givenPrompt: r?.givenPrompt,
  //           },
  //           {
  //             // TODO: Change this
  //             id: accountId ?? '',
  //             name: accountId ?? '',
  //           },
  //         ),
  //       ),
  //     );
  //   };
  const contextValue = useMemo(
    () => ({
      allResponses,
      myResponses,
      availableResponses,
      participants,
      deleteResponse,
      postResponse,
    }),
    [
      allResponses,
      availableResponses,
      deleteResponse,
      myResponses,
      participants,
      postResponse,
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
