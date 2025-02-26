import { v4 } from 'uuid';

import { Author } from '@/interfaces/author';

import { AssistantId } from './assistant';

export type ResponseVotes = {
  votes: number;
};

export type ResponseRatings = {
  ratings: Array<{
    name: string;
    value: number;
  }>;
};

export type ResponseEvaluation = ResponseVotes | ResponseRatings | undefined;

export type ResponseData<
  EvaluationType extends ResponseEvaluation = undefined,
> = {
  id: string;
  author: Author;
  response: string | Array<string>;
  round?: number;
  bot?: boolean;
  assistantId?: AssistantId;
  parentId?: string;
  encoding?: 'raw' | 'markdown';
  originalResponse?: string;
  givenPrompt?: string;
  evaluation?: EvaluationType;
};

export type InputResponseData = Pick<ResponseData, 'response'> &
  Partial<ResponseData>;

export const responseDataFactory = (
  partialResponse: InputResponseData,
  author: Author,
): ResponseData => ({
  id: v4(),
  response: partialResponse.response,
  round: partialResponse?.round,
  assistantId: partialResponse?.assistantId,
  bot: !(
    partialResponse?.bot ?? typeof partialResponse?.assistantId !== 'undefined'
  ),
  parentId: partialResponse?.parentId,
  encoding: partialResponse?.encoding ?? 'raw',
  originalResponse: partialResponse?.originalResponse,
  givenPrompt: partialResponse?.givenPrompt,
  evaluation: partialResponse?.evaluation,
  author: author ?? partialResponse.author,
});

export type ResponseDataExchangeFormat = ResponseData<ResponseEvaluation> & {
  id: number;
  votes?: number;
};
