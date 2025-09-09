import { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { ChatbotRole, GPTVersion } from '@graasp/sdk';

import { Liquid } from 'liquidjs';

import { ChatbotResponseAppData } from '@/config/appDataTypes';
import { DEFAULT_CHATBOT_RESPONSE_APP_DATA } from '@/config/constants';
import { mutations } from '@/config/queryClient';
import { ResponseData } from '@/interfaces/response';
import { Thread } from '@/interfaces/threads';
import { useAppDataContext } from '@/modules/context/AppDataContext';
import { useSettings } from '@/modules/context/SettingsContext';
import { useThreadsContext } from '@/state/ThreadsContext';

import { feedbackPrompts } from './prompts';

interface UseFeedbackValues {
  generateFeedback: (response: ResponseData, thread: Thread) => Promise<void>;
}

const useFeedback = (): UseFeedbackValues => {
  const { i18n } = useTranslation('prompts');
  const lang = i18n.language;
  const { mutateAsync: postChatBot } = mutations.usePostChatBot(
    GPTVersion.GPT_4_O, // TODO: Allow user to choose which model to use.
  );

  const liquidRef = useRef(new Liquid({ cache: true }));

  const prompts = useMemo(() => feedbackPrompts[lang], [lang]);
  const { feedback } = useSettings();
  const { postAppDataAsync } = useAppDataContext();

  const { updateResponse } = useThreadsContext();

  const generateFeedback = useCallback(
    async (response: ResponseData, thread: Thread): Promise<void> => {
      const systemPrompt = liquidRef.current.parseAndRenderSync(
        prompts.metaSystemPrompt,
        { systemPrompt: feedback.systemPrompt },
      ) as string;
      const configuredUserPrompt = liquidRef.current.parseAndRenderSync(
        feedback.userPrompt ?? '{{response}}',
        { response: response.response, author: response.author.name },
      ) as string;
      const userPrompt = liquidRef.current.parseAndRenderSync(
        prompts.metaUserPrompt,
        { userPrompt: configuredUserPrompt },
      ) as string;
      const promise: Promise<ChatbotResponseAppData | undefined> = postChatBot([
        { role: ChatbotRole.System, content: systemPrompt },
        {
          role: ChatbotRole.User,
          content: userPrompt,
        },
      ]).then((ans) => {
        const a = postAppDataAsync({
          ...DEFAULT_CHATBOT_RESPONSE_APP_DATA,
          data: {
            ...ans, // Be careful. Destructure.
            feedback: true,
          },
        }) as Promise<ChatbotResponseAppData>;
        return a;
      });
      return promise.then(async (assistantResponseAppData) => {
        if (assistantResponseAppData) {
          const { completion } = assistantResponseAppData.data;
          const updatedResponse = { ...response, feedback: completion };
          return updateResponse(updatedResponse, thread.id);
        }
        return assistantResponseAppData;
      });
    },
    [
      feedback.systemPrompt,
      feedback.userPrompt,
      postAppDataAsync,
      postChatBot,
      prompts.metaSystemPrompt,
      prompts.metaUserPrompt,
      updateResponse,
    ],
  );

  return {
    generateFeedback,
  };
};

export default useFeedback;
