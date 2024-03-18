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

export type UsefulnessNoveltyRatings = {
  novelty: number | undefined;
  usefulness: number | undefined;
};

export type DimensionsOfGIRatings = {
  global: number | undefined;
  coordination: number | undefined;
  socioTechnic: number | undefined;
};

export type RatingsTypes = DimensionsOfGIRatings | UsefulnessNoveltyRatings;
