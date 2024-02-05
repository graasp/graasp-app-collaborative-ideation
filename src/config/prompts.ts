import { TFunction } from 'i18next';

import { RESPONSE_MAXIMUM_LENGTH } from './constants';

export const DEFAULT_SYSTEM_PROMPT =
  'You are part of a group of designers trying to solve a wicked problem. Help your group by proposing new ideas';

export const getSingleResponsePrompt = (prompt: string): string =>
  `We are given the following wicked problem: "${prompt}"
  
  Generate a single solution to this challenge. Express it in less than ${RESPONSE_MAXIMUM_LENGTH} characters.`;

export const promptForSingleResponse = (
  problemStatement: string,
  t: TFunction,
): string =>
  t('PROMPTS.SINGLE_RESPONSE', {
    problemStatement,
    maxChars: RESPONSE_MAXIMUM_LENGTH,
  });

export const promptForSingleResponseAndProvideResponses = (
  problemStatement: string,
  responses: string[],
  t: TFunction,
): string => {
  const responsesString = responses.map(
    (r) => `<solution>\n${r}\n</solution>\n`,
  );
  return t('PROMPTS.SINGLE_RESPONSE_AND_PROVIDE_RESPONSES', {
    problemStatement,
    responses: responsesString,
    maxChars: RESPONSE_MAXIMUM_LENGTH,
  });
};
