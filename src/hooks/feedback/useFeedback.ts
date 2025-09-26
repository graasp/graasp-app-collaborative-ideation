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
  generateSystemPrompt: (systemPrompt: string) => string;
  generateUserPrompt: (
    response: ResponseData,
    previousResponses: ResponseData[],
  ) => string;
}

const useFeedback = (): UseFeedbackValues => {
  const { i18n } = useTranslation('prompts');
  const lang = i18n.language;
  const { mutateAsync: postChatBot } = mutations.usePostChatBot(
    GPTVersion.GPT_4_O, // TODO: Allow user to choose which model to use.
  );

  const liquidRef = useRef(new Liquid({ cache: true }));

  const prompts = useMemo(() => feedbackPrompts[lang], [lang]);
  const { instructions, feedback } = useSettings();
  const { postAppDataAsync } = useAppDataContext();

  const { title, details } = instructions;

  const problemStatement = useMemo(
    () => [title.content, details?.content].join('\n'),
    [title, details],
  );

  const { updateResponse } = useThreadsContext();

  const generateSystemPrompt = useCallback(
    (systemPrompt: string) =>
      liquidRef.current.parseAndRenderSync(prompts.metaSystemPrompt, {
        systemPrompt,
      }) as string,
    [prompts.metaSystemPrompt],
  );

  const generateUserPrompt = useCallback(
    (response: ResponseData, previousResponses: ResponseData[]) => {
      const configuredUserPrompt = liquidRef.current.parseAndRenderSync(
        feedback.userPrompt ?? '{{response}}',
        {
          problem_statement: problemStatement,
          current_response: response.response,
          author: response.author.name,
          previous_responses: previousResponses,
        },
      ) as string;
      const userPrompt = liquidRef.current.parseAndRenderSync(
        prompts.metaUserPrompt,
        { userPrompt: configuredUserPrompt },
      ) as string;
      return userPrompt;
    },
    [feedback.userPrompt, problemStatement, prompts.metaUserPrompt],
  );

  const generateFeedback = useCallback(
    async (response: ResponseData, thread: Thread): Promise<void> => {
      const index = thread.responses.findIndex((r) => r.id === response.id);
      let previousResponses: ResponseData[] = [];
      if (index > 0) {
        previousResponses = thread.responses.slice(0, index);
      }
      const systemPrompt = generateSystemPrompt(feedback.systemPrompt ?? '');
      const userPrompt = generateUserPrompt(response, previousResponses);
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
      generateSystemPrompt,
      generateUserPrompt,
      postAppDataAsync,
      postChatBot,
      updateResponse,
    ],
  );

  return {
    generateFeedback,
    generateSystemPrompt,
    generateUserPrompt,
  };
};

export default useFeedback;
