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
  response: string | Array<string>;
  round?: number;
  bot?: boolean;
  assistantId?: AssistantId;
  parentId?: string;
  markup?: 'none' | 'markdown';
  originalResponse?: string;
  givenPrompt?: string;
  evaluation?: EvaluationType;
};

export type ResponseDataExchangeFormat = ResponseData<ResponseEvaluation> & {
  id: number;
  votes?: number;
};
