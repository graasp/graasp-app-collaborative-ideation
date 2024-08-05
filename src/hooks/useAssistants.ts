import { ChatbotRole, GPTVersion } from '@graasp/sdk';

import { ChatbotResponseAppData, ResponseAppData } from '@/config/appDataTypes';
import {
  DEFAULT_CHATBOT_RESPONSE_APP_DATA,
  RESPONSE_MAXIMUM_LENGTH,
} from '@/config/constants';
import {
  getSingleResponsePrompt,
  promptForSingleResponse,
  promptForSingleResponseAndProvideResponses,
} from '@/config/prompts';
import { mutations } from '@/config/queryClient';
import { AssistantPersona } from '@/interfaces/assistant';
import { useAppDataContext } from '@/modules/context/AppDataContext';
import { useSettings } from '@/modules/context/SettingsContext';
import { useTranslation } from 'react-i18next';
import { useActivityContext } from '@/modules/context/ActivityContext';
import { joinMultipleResponses } from './utils/responses';

interface UseAssistantsValues {
  generateSingleResponse: () => Promise<ChatbotResponseAppData | undefined>;
  promptAssistant: (
    assistant: AssistantPersona,
    prompt: string,
  ) => Promise<ChatbotResponseAppData | undefined>;
  promptAllAssistants: (
    prompt: string,
  ) => Promise<Promise<ChatbotResponseAppData | undefined>[]>;
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
  const {
    chatbot,
    instructions: generalPrompt,
    assistants,
    instructions,
  } = useSettings();

  const { includeDetails, promptMode } = assistants;
  const { postAppDataAsync } = useAppDataContext();

  const { assistantsResponsesSets, round, allResponses, postResponse } =
    useActivityContext();

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

  /**
   *
   * @deprecated
   */
  const generateSingleResponse = async (): Promise<
    ChatbotResponseAppData | undefined
  > =>
    postChatBot([
      {
        role: ChatbotRole.System,
        content: chatbot.systemPrompt,
      },
      {
        role: ChatbotRole.User,
        content: getSingleResponsePrompt(generalPrompt.title.content),
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

  const promptAssistant = async (
    assistant: AssistantPersona,
    prompt: string,
  ): Promise<ChatbotResponseAppData | undefined> =>
    postChatBot([
      ...assistant.message,
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

  const promptAllAssistants = async (
    prompt: string,
  ): Promise<Promise<ChatbotResponseAppData | undefined>[]> =>
    assistants.assistants.map((p) => promptAssistant(p, prompt));

  const generateResponsesWithEachAssistant = async (): Promise<
    Promise<ResponseAppData | undefined>[]
  > => {
    const responsesAssistants = assistants.assistants
      .map((persona) => {
        const assistantSet = assistantsResponsesSets.find(
          (set) =>
            set.data.assistant === persona.id && set.data.round === round - 1,
        );
        if (assistantSet) {
          const responses = assistantSet.data.responses.map((r) =>
            joinMultipleResponses(
              allResponses.find(({ id }) => r === id)?.data.response || '',
            ),
          );
          return promptAssistant(
            persona,
            promptForSingleResponseAndProvideResponses(
              instructions.title.content,
              responses,
              t,
              includeDetails ? instructions.details?.content : undefined,
              promptMode,
            ),
          );
        }
        return promptAssistant(
          persona,
          promptForSingleResponse(
            instructions.title.content,
            t,
            includeDetails ? instructions.details?.content : undefined,
            promptMode,
          ),
        );
      })
      .map((promise) =>
        promise.then(async (assistantResponseAppData) => {
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
        }),
      );

    return responsesAssistants;
  };

  return {
    generateSingleResponse,
    promptAssistant,
    promptAllAssistants,
    reformulateResponse,
    generateResponsesWithEachAssistant,
  };
};

export default useAssistants;
