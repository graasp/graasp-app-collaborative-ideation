import { Author } from './author';

export enum EvaluationType {
  None = 'none',
  Rate = 'rate',
  Vote = 'vote',
  Rank = 'rank',
}

export type RatingDescription = {
  name: string;
  description?: string;
  maxLabel: string;
  minLabel: string;
  levels: number;
};

export type EvaluationParameters = {
  maxNumberOfVotes?: number;
  ratings?: Array<RatingDescription>;
  ratingsName?: string;
};

export type Vote = {
  author: Author;
};

// export type Rating = {
//   author: Author;
//   rating: number;
// }

export type Evaluation<T extends Vote = Vote> = {
  type: EvaluationType;
  value: T;
};

export type Evaluations = Array<Evaluation>;
