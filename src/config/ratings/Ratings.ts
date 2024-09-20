import { RatingDescription } from '@/interfaces/evaluation';

export const UsefulnessNoveltyRating: Array<RatingDescription> = [
  {
    name: 'Usefulness',
    description: 'How useful is the response',
    maxLabel: 'Useful',
    minLabel: 'Useless',
    levels: 5,
  },
  {
    name: 'Novelty',
    description: 'How novel is the response',
    maxLabel: 'Novel',
    minLabel: 'Common',
    levels: 5,
  },
];

export const RatingsSet = [
  {
    name: 'Usefulness and novelty',
    description: 'How useful and novel is this response',
    set: UsefulnessNoveltyRating,
  },
];
