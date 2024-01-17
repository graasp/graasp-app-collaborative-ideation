import { ChatbotRole } from '@graasp/sdk';

import { ChatbotResponseAppData } from '@/config/appDataTypes';
import { getSingleResponsePrompt } from '@/config/chatbot';
import { DEFAULT_CHATBOT_RESPONSE_APP_DATA } from '@/config/constants';
import { mutations } from '@/config/queryClient';
import { useAppDataContext } from '@/modules/context/AppDataContext';
import { useSettings } from '@/modules/context/SettingsContext';

interface UseChatbotValues {
  generateSingleResponse: () => Promise<ChatbotResponseAppData | undefined>;
}

const useChatbot = (): UseChatbotValues => {
  const { mutateAsync: postChatBot } = mutations.usePostChatBot();
  const { chatbot, prompt } = useSettings();
  const { postAppDataAsync } = useAppDataContext();
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
        content: getSingleResponsePrompt(prompt.content),
      },
    ]).then((ans) => {
      const a = postAppDataAsync({
        ...DEFAULT_CHATBOT_RESPONSE_APP_DATA,
        data: ans,
      }) as Promise<ChatbotResponseAppData>;
      return a;
    });

  return { generateSingleResponse };
};

export default useChatbot;
