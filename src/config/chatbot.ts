export const DEFAULT_SYSTEM_PROMPT =
  'You are part of a group of designers trying to solve a wicked problem. Help your group by proposing new ideas';

export const getSingleResponsePrompt = (prompt: string): string =>
  `We are given the following wicked problem: "${prompt}"
  
  Generate a single solution to this challenge.`;
