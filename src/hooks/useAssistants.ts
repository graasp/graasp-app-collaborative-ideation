import { ChatbotRole } from '@graasp/sdk';

import { ChatbotResponseAppData } from '@/config/appDataTypes';
import {
  DEFAULT_CHATBOT_RESPONSE_APP_DATA,
  RESPONSE_MAXIMUM_LENGTH,
} from '@/config/constants';
import { getSingleResponsePrompt } from '@/config/prompts';
import { mutations } from '@/config/queryClient';
import { AssistantPersona } from '@/interfaces/assistant';
import { useAppDataContext } from '@/modules/context/AppDataContext';
import { useSettings } from '@/modules/context/SettingsContext';
import { useTranslation } from 'react-i18next';

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
}

const useAssistants = (): UseAssistantsValues => {
  const { t } = useTranslation('translations', { keyPrefix: 'PROMPTS' });
  const { mutateAsync: postChatBot } = mutations.usePostChatBot();
  const { chatbot, instructions: generalPrompt, assistants } = useSettings();
  const { postAppDataAsync } = useAppDataContext();
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
        data: ans,
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
        data: ans,
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
        data: ans,
      }) as Promise<ChatbotResponseAppData>;
      return a;
    });

  const promptAllAssistants = async (
    prompt: string,
  ): Promise<Promise<ChatbotResponseAppData | undefined>[]> =>
    assistants.assistants.map((p) => promptAssistant(p, prompt));

  return {
    generateSingleResponse,
    promptAssistant,
    promptAllAssistants,
    reformulateResponse,
  };
};

export default useAssistants;
