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
  const { mutateAsync: postChatBot } = mutations.usePostChatBot();
  const { chatbot, instructions: generalPrompt, assistants } = useSettings();
  const { postAppDataAsync } = useAppDataContext();
  const reformulateResponse = (
    response: string,
  ): Promise<ChatbotResponseAppData | undefined> =>
    postChatBot([
      {
        role: 'system',
        content:
          'You are an helpful assistant. You will help in reformulating short text that the user will give you.',
      },
      {
        role: 'user',
        content: `I will give you a response. You need to reformulate it so that it has a neutral tone, is clearer and match the following problem:\n${generalPrompt.title.content}\n\n${generalPrompt.details ? `Details about the problem:\n${generalPrompt.details.content}\n\n` : ''}The reformulated response must not exceed ${RESPONSE_MAXIMUM_LENGTH}. When answering, give me only the reformulated idea.`,
      },
      {
        role: 'assistant',
        content: 'Provide me with the idea you want me to reformulate',
      },
      {
        role: 'user',
        content: `Reformulate this response:\n${response}`,
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
