import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useLocalContext } from '@graasp/apps-query-client';
import { AppDataVisibility, Member } from '@graasp/sdk';

import cloneDeep from 'lodash.clonedeep';
import isEqual from 'lodash.isequal';
import shuffle from 'lodash.shuffle';

import {
  AppDataTypes,
  ResponseAppData,
  ResponsesSetAppData,
} from '@/config/appDataTypes';
import { hooks, mutations } from '@/config/queryClient';
import useActions from '@/hooks/useActions';
import useInvalidateAppData from '@/hooks/useInvalidateAppData';
import useParticipants from '@/hooks/useParticipants';
import {
  filterBotResponses,
  getResponses,
  getRoundResponses,
  isOwnResponse,
  recursivelyCreateAllOpenSets,
  recursivelyCreateAllPartiallyBlindSets,
} from '@/hooks/utils/responses';
import { AssistantId } from '@/interfaces/assistant';
import { ResponseVisibilityMode } from '@/interfaces/interactionProcess';
import {
  ResponseData,
  ResponseDataExchangeFormat,
} from '@/interfaces/response';
import { useActivityStateContext } from '@/modules/context/ActivityStateContext';
import { useSettings } from '@/modules/context/SettingsContext';
import { appDataArrayToMap } from '@/utils/utils';

export interface ResponsesContextType {
  allResponses: ResponseAppData[];
  myResponses: ResponseAppData[];
  allResponsesSets: ResponsesSetAppData[];
  myResponsesSets: ResponsesSetAppData[];
  assistantsResponsesSets: ResponsesSetAppData[];
  availableResponses: ResponseAppData[];
  postResponse: (
    data: ResponseData,
    invalidateAll?: boolean,
  ) => Promise<ResponseAppData> | undefined;
  createAllResponsesSet: () => Promise<void>;
  deleteResponsesSetsForRound: (roundToDelete: number) => Promise<void>;
  deleteAllResponsesSet: () => Promise<void>;
  deleteResponse: (id: ResponseAppData['id']) => Promise<void>;
  importResponses: (
    responsesDataJson: Array<ResponseDataExchangeFormat>,
  ) => Promise<void>;
}

const defaultContextValue: ResponsesContextType = {
  allResponses: [],
  myResponses: [],
  postResponse: () => undefined,
  allResponsesSets: [],
  myResponsesSets: [],
  assistantsResponsesSets: [],
  createAllResponsesSet: async () => undefined,
  deleteResponsesSetsForRound: async () => undefined,
  deleteAllResponsesSet: async () => undefined,
  deleteResponse: async () => undefined,
  availableResponses: [],
  importResponses: () => Promise.resolve(),
};

type Props = {
  children: JSX.Element;
};

const ResponsesContext =
  createContext<ResponsesContextType>(defaultContextValue);

export const ResponsesProvider = ({
  children,
}: Props): JSX.Element | JSX.Element[] => {
  console.log('ResponsesContext is rendering.');
  const { data: appData, refetch: refetchAppData } = hooks.useAppData({
    type: AppDataTypes.Response,
  });
  const { mutateAsync: postAppDataAsync } = mutations.usePostAppData();
  const { mutate: deleteAppData, mutateAsync: deleteAppDataAsync } =
    mutations.useDeleteAppData();
  const invalidateAppData = useInvalidateAppData();

  const participants = useParticipants();
  const { round } = useActivityStateContext();

  const { accountId } = useLocalContext();
  const { orchestrator, activity } = useSettings();
  const { postSubmitNewResponseAction, postDeleteResponseAction } =
    useActions();
  const {
    mode: visibilityMode,
    numberOfResponsesPerSet,
    numberOfBotResponsesPerSet,
    exclusiveResponseDistribution,
  } = activity;

  const [allResponses, setAllResponses] = useState<ResponseAppData[]>([]);

  useEffect(() => {
    const r = getResponses(appData ?? []);
    if (!isEqual(allResponses, r)) {
      setAllResponses(r);
    }
  }, [allResponses, appData]);

  // const allResponses = useMemo(
  //   (): ResponseAppData[] => getResponses(appData ?? []),
  //   [appData],
  // );

  const myResponses = useMemo((): ResponseAppData[] => {
    const responses = (allResponses.filter(
      ({ creator }) => creator?.id === accountId,
    ) ?? []) as ResponseAppData[];
    return responses;
  }, [allResponses, accountId]);

  const allResponsesSets = useMemo((): ResponsesSetAppData[] => {
    const responses = (appData?.filter(
      ({ creator, type }) =>
        creator?.id === orchestrator.id && type === AppDataTypes.ResponsesSet,
    ) ?? []) as ResponsesSetAppData[];
    return responses;
  }, [appData, orchestrator]);

  const myResponsesSets = useMemo((): ResponsesSetAppData[] => {
    const responses = (allResponsesSets.filter(
      ({ account, data }) =>
        account.id === accountId && typeof data?.assistant === 'undefined',
    ) ?? []) as ResponsesSetAppData[];
    return responses;
  }, [allResponsesSets, accountId]);

  const assistantsResponsesSets = useMemo((): ResponsesSetAppData[] => {
    const responses = (allResponsesSets.filter(
      ({ data }) => typeof data?.assistant !== 'undefined',
    ) ?? []) as ResponsesSetAppData[];
    return responses;
  }, [allResponsesSets]);

  const availableResponses = useMemo((): ResponseAppData[] => {
    if (visibilityMode === ResponseVisibilityMode.OpenLive) {
      return allResponses;
    }
    const responses = allResponses.filter((r) => {
      const { id } = r;
      let okay = false;
      // Checks that the response has been assigned to the user.
      myResponsesSets.forEach((s) => {
        if (s.data.responses.includes(id)) {
          okay = true;
        }
      });
      return okay || isOwnResponse(r as ResponseAppData, accountId ?? '');
    }) as ResponseAppData[];
    return responses;
  }, [allResponses, accountId, myResponsesSets, visibilityMode]);

  const postResponse = useCallback(
    (
      data: ResponseData,
      invalidateAll: boolean = false,
    ): Promise<ResponseAppData> | undefined =>
      postAppDataAsync({
        type: AppDataTypes.Response,
        visibility: AppDataVisibility.Item,
        data,
      })?.then((postedResponse) => {
        const response = postedResponse as ResponseAppData;
        postSubmitNewResponseAction(response);
        if (invalidateAll) {
          invalidateAppData();
        }
        return response;
      }),
    [invalidateAppData, postAppDataAsync, postSubmitNewResponseAction],
  );

  const postResponsesSet = useCallback(
    async (
      id: Member['id'] | AssistantId,
      responsesSet: Array<ResponseAppData['id']>,
      forAssistant: boolean = false,
    ): Promise<ResponsesSetAppData> => {
      const payload = {
        data: {
          round,
          responses: responsesSet,
          assistant: forAssistant ? id : undefined,
        },
        accountId: forAssistant ? accountId : id,
        type: AppDataTypes.ResponsesSet,
        visibility: AppDataVisibility.Item,
      };
      const promise = postAppDataAsync(payload) as Promise<ResponsesSetAppData>;
      if (promise) {
        return promise;
      }
      throw Error('Something went wrong with the request.'); // TODO: change
    },
    [accountId, postAppDataAsync, round],
  );

  const createAllResponsesSetWorker = useCallback(
    (responsePool: ResponseAppData[]): void => {
      let sets: Map<string, ResponseAppData[]>;
      let assistantSets: Map<string, ResponseAppData[]>;
      const participantIterator = participants.members.entries();
      const assistantsIterator = participants.assistants.entries();
      if (visibilityMode === ResponseVisibilityMode.PartiallyBlind) {
        const participantsRepsonses = appDataArrayToMap(
          shuffle(filterBotResponses(responsePool, false)),
        );
        const botResponses = appDataArrayToMap(
          shuffle(filterBotResponses(responsePool, true)),
        );

        const participantRCopy = cloneDeep(participantsRepsonses);
        const botRCopy = cloneDeep(botResponses);
        sets = recursivelyCreateAllPartiallyBlindSets(
          participantIterator,
          participantsRepsonses,
          botResponses,
          numberOfResponsesPerSet,
          numberOfBotResponsesPerSet,
          exclusiveResponseDistribution,
        );
        assistantSets = recursivelyCreateAllPartiallyBlindSets(
          assistantsIterator,
          participantRCopy,
          botRCopy,
          numberOfResponsesPerSet,
          numberOfBotResponsesPerSet,
          exclusiveResponseDistribution,
        );
      } else {
        const responses = appDataArrayToMap(shuffle(responsePool));
        const responsesCopy = cloneDeep(responses);
        sets = recursivelyCreateAllOpenSets(participantIterator, responses);
        assistantSets = recursivelyCreateAllOpenSets(
          assistantsIterator,
          responsesCopy,
        );
      }
      sets.forEach((responsesSet, participantId) => {
        const responsesSetDataWithId = responsesSet.map(({ id }) => id);
        postResponsesSet(participantId, responsesSetDataWithId);
      });
      assistantSets.forEach((responsesSet, assistantId) => {
        const responsesSetDataWithId = responsesSet.map(({ id }) => id);
        postResponsesSet(assistantId, responsesSetDataWithId, true);
      });
    },
    [
      exclusiveResponseDistribution,
      numberOfBotResponsesPerSet,
      numberOfResponsesPerSet,
      participants.assistants,
      participants.members,
      postResponsesSet,
      visibilityMode,
    ],
  );

  const createAllResponsesSet = useCallback(async (): Promise<void> => {
    refetchAppData().then((result) => {
      if (result) {
        const { data, isSuccess } = result;
        if (isSuccess) {
          const responsePool = getRoundResponses(getResponses(data), round);
          createAllResponsesSetWorker(responsePool);
        }
      } else {
        // TODO: Change error message
        throw new Error('Failed to refetch app data.');
      }
    });
  }, [createAllResponsesSetWorker, refetchAppData, round]);

  const deleteResponsesSetsForRound = useCallback(
    async (roundToDelete: number): Promise<void> => {
      allResponsesSets
        .filter(({ data }) => data.round === roundToDelete)
        .forEach(({ id }) => {
          deleteAppData({ id });
        });
    },
    [allResponsesSets, deleteAppData],
  );

  const deleteAllResponsesSet = useCallback(async (): Promise<void> => {
    allResponsesSets.forEach(({ id }) => {
      deleteAppData({ id });
    });
  }, [allResponsesSets, deleteAppData]);

  const deleteResponse = useCallback(
    async (id: ResponseAppData['id']): Promise<void> =>
      deleteAppDataAsync({ id })?.then(() => {
        postDeleteResponseAction(id);
      }),
    [deleteAppDataAsync, postDeleteResponseAction],
  );

  const importResponses = useCallback(
    async (responsesData: Array<ResponseDataExchangeFormat>): Promise<void> => {
      responsesData.forEach((r) =>
        postResponse({
          response: r.response,
          round: r?.round,
          bot: r?.bot,
          assistantId: r?.assistantId,
          encoding: r?.encoding,
          originalResponse: r?.originalResponse,
          givenPrompt: r?.givenPrompt,
        }),
      );
    },
    [postResponse],
  );

  const contextValue = useMemo(
    () => ({
      availableResponses,
      allResponses,
      myResponses,
      postResponse,
      allResponsesSets,
      myResponsesSets,
      assistantsResponsesSets,
      createAllResponsesSet,
      deleteAllResponsesSet,
      deleteResponse,
      deleteResponsesSetsForRound,
      importResponses,
    }),
    [
      allResponses,
      allResponsesSets,
      assistantsResponsesSets,
      availableResponses,
      createAllResponsesSet,
      deleteAllResponsesSet,
      deleteResponse,
      deleteResponsesSetsForRound,
      importResponses,
      myResponses,
      myResponsesSets,
      postResponse,
    ],
  );
  return (
    <ResponsesContext.Provider value={contextValue}>
      {children}
    </ResponsesContext.Provider>
  );
};

export const useResponses = (): ResponsesContextType =>
  useContext<ResponsesContextType>(ResponsesContext);
