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
