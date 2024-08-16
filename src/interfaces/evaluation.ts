export enum EvaluationType {
  Rate = 'rate',
  Vote = 'vote',
  Rank = 'rank',
  None = 'none',
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
};
