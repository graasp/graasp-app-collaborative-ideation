import { TFunction } from 'i18next';

import { RESPONSE_MAXIMUM_LENGTH } from '@/config/constants';
import { PromptMode } from '@/interfaces/assistant';

export const DEFAULT_SYSTEM_PROMPT =
  'You are part of a group of designers trying to solve a wicked problem. Help your group by proposing new ideas';

export const getSingleResponsePrompt = (prompt: string): string =>
  `We are given the following wicked problem: "${prompt}"
  
  Generate a single solution to this challenge. Express it in less than ${RESPONSE_MAXIMUM_LENGTH} characters.`;

export const promptForSingleResponse = (
  problemStatement: string,
  t: TFunction<'prompts', undefined>,
  details?: string,
  promptMode?: PromptMode,
): string => {
  if (promptMode === PromptMode.Instructions) {
    return typeof details === 'undefined'
      ? t('INSTRUCTIONS.SINGLE_RESPONSE', {
          instructions: problemStatement,
          maxChars: RESPONSE_MAXIMUM_LENGTH,
        })
      : t('INSTRUCTIONS.SINGLE_RESPONSE_WITH_DETAILS', {
          // TODO: Put this in translations
          instructions: problemStatement,
          details,
          maxChars: RESPONSE_MAXIMUM_LENGTH,
        });
  }
  return typeof details === 'undefined'
    ? t('PROBLEM.SINGLE_RESPONSE', {
        problemStatement,
        maxChars: RESPONSE_MAXIMUM_LENGTH,
      })
    : t('PROBLEM.SINGLE_RESPONSE_WITH_DETAILS', {
        // TODO: Put this in translations
        problemStatement,
        details,
        maxChars: RESPONSE_MAXIMUM_LENGTH,
      });
};

export const promptForSingleResponseAndProvideResponses = (
  problemStatement: string,
  responses: string[],
  t: TFunction<'prompts', undefined>,
  details?: string,
  promptMode?: PromptMode,
): string => {
  const responsesString = responses.map(
    (r) => `<solution>\n${r}\n</solution>\n`,
  );
  if (promptMode === PromptMode.Instructions) {
    return typeof details === 'undefined'
      ? t('INSTRUCTIONS.SINGLE_RESPONSE_AND_PROVIDE_RESPONSES', {
          instructions: problemStatement,
          responses: responsesString,
          maxChars: RESPONSE_MAXIMUM_LENGTH,
        })
      : t('INSTRUCTIONS.SINGLE_RESPONSE_WITH_DETAILS_AND_PROVIDE_RESPONSES', {
          instructions: problemStatement,
          details,
          responses: responsesString,
          maxChars: RESPONSE_MAXIMUM_LENGTH,
        });
  }
  return typeof details === 'undefined'
    ? t('PROBLEM.SINGLE_RESPONSE_AND_PROVIDE_RESPONSES', {
        instructions: problemStatement,
        responses: responsesString,
        maxChars: RESPONSE_MAXIMUM_LENGTH,
      })
    : t('PROBLEM.SINGLE_RESPONSE_WITH_DETAILS_AND_PROVIDE_RESPONSES', {
        instructions: problemStatement,
        details,
        responses: responsesString,
        maxChars: RESPONSE_MAXIMUM_LENGTH,
      });
};
