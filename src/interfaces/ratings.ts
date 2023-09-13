export interface Rating {
  type: string;
  label: string;
  min: number;
  max: number;
  step: number;
}

export type Ratings = Array<Rating>;

export interface LikertScale extends Rating {
  type: 'likert-scale';
  min: 1;
  step: 1;
}

export type NoveltyRelevanceRatings = {
  novelty: number | undefined;
  usefulness: number | undefined;
};
