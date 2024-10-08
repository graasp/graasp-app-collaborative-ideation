import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useLocalContext } from '@graasp/apps-query-client';
import { AppDataVisibility, ChatbotRole, GPTVersion } from '@graasp/sdk';

import {
  AppDataTypes,
  ChatbotResponseAppData,
  ListAssistantStateAppData,
  ResponseAppData,
} from '@/config/appDataTypes';
import {
  DEFAULT_CHATBOT_RESPONSE_APP_DATA,
  LAST_RECORDED_NUMBER_OF_RESPONSES_SESSION_STORE_KEY,
  RESPONSE_MAXIMUM_LENGTH,
} from '@/config/constants';
import {
  promptForSingleResponse,
  promptForSingleResponseAndProvideResponses,
} from '@/config/prompts';
import { mutations } from '@/config/queryClient';
import {
  AssistantPersona,
  AssistantType,
  LLMAssistantConfiguration,
  ListAssistantConfiguration,
  ListAssistantStateData,
} from '@/interfaces/assistant';
import { ResponseVisibilityMode } from '@/interfaces/interactionProcess';
import { useActivityContext } from '@/modules/context/ActivityContext';
import { useAppDataContext } from '@/modules/context/AppDataContext';
import { useSettings } from '@/modules/context/SettingsContext';

import { joinMultipleResponses } from './utils/responses';

interface UseAssistantsValues {
  promptAssistant: (
    assistant: AssistantPersona<LLMAssistantConfiguration>,
    prompt: string,
  ) => Promise<ChatbotResponseAppData | undefined>;
  reformulateResponse: (
    response: string,
  ) => Promise<ChatbotResponseAppData | undefined>;
  generateResponsesWithEachAssistant: () => Promise<
    Promise<ResponseAppData | undefined>[]
  >;
}

const useAssistants = (): UseAssistantsValues => {
  const { t } = useTranslation('prompts');
  const { mutateAsync: postChatBot } = mutations.usePostChatBot(
    GPTVersion.GPT_4_O, // TODO: Allow user to choose which model to use.
  );
  const { accountId, itemId } = useLocalContext();
  const {
    instructions: generalPrompt,
    assistants,
    instructions,
    activity,
    orchestrator,
  } = useSettings();

  const { includeDetails, promptMode } = assistants;
  const { postAppDataAsync, appData, patchAppDataAsync } = useAppDataContext();
  const { mode, numberOfParticipantsResponsesTriggeringResponsesGeneration } =
    activity;

  const { assistantsResponsesSets, round, allResponses, postResponse } =
    useActivityContext();

  const listAssistantsStates = useMemo(
    () =>
      appData.filter(
        (a) => a.type === AppDataTypes.ListAssistantState,
      ) as Array<ListAssistantStateAppData>,
    [appData],
  );

  const reformulateResponse = (
    response: string,
  ): Promise<ChatbotResponseAppData | undefined> =>
    postChatBot([
      {
        role: 'system',
        content: t('REFORMULATE.SYSTEM'),
      },
      {
        role: 'user',
        content: t('REFORMULATE.USER_1', {
          problem: generalPrompt.title.content,
          details: generalPrompt.details
            ? t('REFORMULATE.USER_1_DETAILS', {
                details: generalPrompt.details.content,
              })
            : '',
          maxChars: RESPONSE_MAXIMUM_LENGTH,
        }),
      },
      {
        role: 'assistant',
        content: t('REFORMULATE.ASSISTANT_1'),
      },
      {
        role: 'user',
        content: t('REFORMULATE.USER_2', { response }),
      },
    ]).then((ans) => {
      const a = postAppDataAsync({
        ...DEFAULT_CHATBOT_RESPONSE_APP_DATA,
        data: {
          ...ans,
        },
      }) as Promise<ChatbotResponseAppData>;
      return a;
    });

  const promptAssistant = useCallback(
    async (
      assistant: AssistantPersona<LLMAssistantConfiguration>,
      prompt: string,
    ): Promise<ChatbotResponseAppData | undefined> => {
      if (assistant.type === AssistantType.LLM) {
        return postChatBot([
          ...assistant.configuration,
          {
            role: ChatbotRole.User,
            content: prompt,
          },
        ]).then((ans) => {
          const a = postAppDataAsync({
            ...DEFAULT_CHATBOT_RESPONSE_APP_DATA,
            data: {
              ...ans, // Be careful. Destructure.
              assistantId: assistant.id,
            },
          }) as Promise<ChatbotResponseAppData>;
          return a;
        });
      }
      throw Error('This assistant is not configured to use an LLM.');
      return undefined;
    },
    [postAppDataAsync, postChatBot],
  );

  const generateResponseWithLLMAssistant = useCallback(
    async (
      assistant: AssistantPersona<LLMAssistantConfiguration>,
    ): Promise<ResponseAppData | undefined> => {
      let promise: Promise<ChatbotResponseAppData | undefined>;
      const assistantSet = assistantsResponsesSets.find(
        (set) =>
          set.data.assistant === assistant.id && set.data.round === round - 1,
      );
      if (assistantSet) {
        const responses = assistantSet.data.responses.map((r) =>
          joinMultipleResponses(
            allResponses.find(({ id }) => r === id)?.data.response || '',
          ),
        );
        promise = promptAssistant(
          assistant,
          promptForSingleResponseAndProvideResponses(
            instructions.title.content,
            responses,
            t,
            includeDetails ? instructions.details?.content : undefined,
            promptMode,
          ),
        );
      } else {
        promise = promptAssistant(
          assistant,
          promptForSingleResponse(
            instructions.title.content,
            t,
            includeDetails ? instructions.details?.content : undefined,
            promptMode,
          ),
        );
      }
      return promise.then(async (assistantResponseAppData) => {
        if (assistantResponseAppData) {
          const { completion: response, assistantId } =
            assistantResponseAppData.data;
          return postResponse({
            response,
            round,
            bot: true,
            assistantId,
          });
        }
        return assistantResponseAppData;
      });
    },
    [
      allResponses,
      assistantsResponsesSets,
      includeDetails,
      instructions,
      postResponse,
      promptAssistant,
      promptMode,
      round,
      t,
    ],
  );

  const updateListAssistantState = useCallback(
    async (data: ListAssistantStateData): Promise<void> => {
      const state = listAssistantsStates.find(
        (s) => s.data.assistantRef === data.assistantRef,
      );
      if (state) {
        patchAppDataAsync({
          id: state.id,
          data,
        });
      } else {
        postAppDataAsync({
          data,
          visibility: AppDataVisibility.Item,
          type: AppDataTypes.ListAssistantState,
        });
      }
    },
    [listAssistantsStates, patchAppDataAsync, postAppDataAsync],
  );

  const generateResponseWithListAssistant = useCallback(
    async (
      assistant: AssistantPersona<ListAssistantConfiguration>,
    ): Promise<ResponseAppData | undefined> => {
      const { id, configuration } = assistant;
      const state = listAssistantsStates.find(
        (s) => s.data.assistantRef === id,
      );
      let indexToMark: number | undefined;
      const response = configuration.find((_, index) => {
        indexToMark = index;
        return !(index in (state?.data.postedIndex ?? []));
      });
      if (typeof indexToMark !== 'undefined') {
        const postedIndex =
          typeof state?.data?.postedIndex !== 'undefined'
            ? [...state.data.postedIndex, indexToMark]
            : [indexToMark];
        updateListAssistantState({
          assistantRef: id,
          postedIndex,
        });
      }
      if (response) {
        return postResponse({
          response,
          round,
          bot: true,
          assistantId: id,
        });
      }
      return undefined;
    },
    [listAssistantsStates, postResponse, round, updateListAssistantState],
  );

  const generateResponsesWithEachAssistant = useCallback(async (): Promise<
    Promise<ResponseAppData | undefined>[]
  > => {
    const lLMAssistants = assistants.assistants.filter(
      (a) => a.type === AssistantType.LLM,
    ) as Array<AssistantPersona<LLMAssistantConfiguration>>;
    const listAssistants = assistants.assistants.filter(
      (a) => a.type === AssistantType.LIST,
    ) as Array<AssistantPersona<ListAssistantConfiguration>>;
    const responsesLLMAssistants = lLMAssistants.map((a) =>
      generateResponseWithLLMAssistant(a),
    );
    const responseListAssistants = listAssistants.map((a) =>
      generateResponseWithListAssistant(a),
    );
    return [...responseListAssistants, ...responsesLLMAssistants];
  }, [
    assistants,
    generateResponseWithLLMAssistant,
    generateResponseWithListAssistant,
  ]);

  // Automatic responses generation effect for live mode
  useEffect(() => {
    if (
      mode === ResponseVisibilityMode.OpenLive &&
      orchestrator.id === accountId
    ) {
      const previousNumberOfResponses = parseInt(
        sessionStorage.getItem(
          LAST_RECORDED_NUMBER_OF_RESPONSES_SESSION_STORE_KEY(itemId),
        ) ?? '0',
        10,
      );
      const currentNumberOfResponses = allResponses.length;
      if (
        previousNumberOfResponses +
          numberOfParticipantsResponsesTriggeringResponsesGeneration <=
        currentNumberOfResponses
      ) {
        generateResponsesWithEachAssistant();
        try {
          sessionStorage.setItem(
            LAST_RECORDED_NUMBER_OF_RESPONSES_SESSION_STORE_KEY(itemId),
            (currentNumberOfResponses + assistants.assistants.length).toString(
              10,
            ),
          );
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }
    }
  }, [
    accountId,
    allResponses.length,
    assistants,
    generateResponsesWithEachAssistant,
    itemId,
    mode,
    numberOfParticipantsResponsesTriggeringResponsesGeneration,
    orchestrator,
  ]);

  return {
    promptAssistant,
    reformulateResponse,
    generateResponsesWithEachAssistant,
  };
};

export default useAssistants;
