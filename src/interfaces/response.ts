import { v4 } from 'uuid';

import { Author } from '@/interfaces/author';

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

export type ResponseComment = {
  id: string;
  author: Author;
  content: string;
  markup?: 'none' | 'markdown';
};

export type ResponseData<
  EvaluationType extends ResponseEvaluation = ResponseEvaluation,
> = {
  id: string;
  author: Author;
  response: string;
  round?: number;
  parentId?: string;
  markup?: 'none' | 'markdown';
  originalResponse?: string;
  givenPrompt?: string;
  evaluation?: EvaluationType;
  feedback?: string;
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
  parentId: partialResponse?.parentId,
  markup: partialResponse?.markup ?? 'none',
  originalResponse: partialResponse?.originalResponse,
  givenPrompt: partialResponse?.givenPrompt,
  evaluation: partialResponse?.evaluation,
  author: author ?? partialResponse.author,
  feedback: partialResponse?.feedback,
});

export type ResponseDataExchangeFormat = Omit<
  ResponseData<ResponseEvaluation>,
  'id'
> & {
  id: number;
  votes?: number;
};
