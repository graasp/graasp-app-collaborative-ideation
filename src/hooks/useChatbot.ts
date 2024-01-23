import { ChatbotRole } from '@graasp/sdk';

import { ChatbotResponseAppData } from '@/config/appDataTypes';
import { DEFAULT_CHATBOT_RESPONSE_APP_DATA } from '@/config/constants';
import { getSingleResponsePrompt } from '@/config/prompts';
import { mutations } from '@/config/queryClient';
import { AssistantPersona } from '@/interfaces/assistant';
import { useAppDataContext } from '@/modules/context/AppDataContext';
import { useSettings } from '@/modules/context/SettingsContext';

interface UseChatbotValues {
  generateSingleResponse: () => Promise<ChatbotResponseAppData | undefined>;
  promptAssistant: (
    assistant: AssistantPersona,
    prompt: string,
  ) => Promise<ChatbotResponseAppData | undefined>;
  promptAllAssistants: (
    prompt: string,
  ) => Promise<Promise<ChatbotResponseAppData | undefined>[]>;
}

const useChatbot = (): UseChatbotValues => {
  const { mutateAsync: postChatBot } = mutations.usePostChatBot();
  const { chatbot, instructions: generalPrompt, assistants } = useSettings();
  const { postAppDataAsync } = useAppDataContext();

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

  return { generateSingleResponse, promptAssistant, promptAllAssistants };
};

export default useChatbot;
