import { FC, useEffect, useMemo, useState } from 'react';

import { CardActions } from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';
import { AppDataVisibility } from '@graasp/sdk';

import { RatingsAppData, RatingsData } from '@/config/appDataTypes';
import { NoveltyRelevanceRatings } from '@/interfaces/ratings';
import { useAppDataContext } from '@/modules/context/AppDataContext';

import LikertScale from '../LikertScale';

type RatingName = 'novelty' | 'relevance';

const Rating: FC<{
  responseId: string;
  onRatingsChange?: (
    newRatings: { [key: string]: number },
    complete?: boolean,
  ) => void;
}> = ({ responseId, onRatingsChange }) => {
  const [noveltyRating, setNoveltyRating] = useState<number>();
  const [relevanceRating, setRelevanceRating] = useState<number>();
  const { appData, patchAppData, postAppData } = useAppDataContext();
  const { memberId } = useLocalContext();

  const ratings = useMemo(
    () =>
      appData.find(
        ({ data, type, creator }) =>
          data?.ideaRef === responseId &&
          type === 'ratings' &&
          creator?.id === memberId,
      ) as RatingsAppData<NoveltyRelevanceRatings> | undefined,
    [appData, responseId, memberId],
  );

  useEffect(() => {
    if (ratings) {
      const { novelty, usefulness } = ratings.data.ratings;
      if (novelty) {
        setNoveltyRating(novelty);
      }
      if (usefulness) {
        setRelevanceRating(usefulness);
      }
    }
  }, [ratings]);
  useEffect(() => {
    if (onRatingsChange) {
      onRatingsChange(
        {
          ...(noveltyRating && { novelty: noveltyRating }),
          ...(relevanceRating && { relevance: relevanceRating }),
        },
        Boolean(noveltyRating) && Boolean(relevanceRating),
      );
    }
  }, [noveltyRating, onRatingsChange, relevanceRating]);

  const updateRatings = (
    novelty: number | undefined,
    relevance: number | undefined,
  ): void => {
    if (responseId) {
      const ratingsData: RatingsData<NoveltyRelevanceRatings> = {
        ideaRef: responseId,
        ratings: {
          novelty,
          usefulness: relevance,
        },
      };
      if (ratings?.id) {
        patchAppData({
          id: ratings.id,
          data: ratingsData,
        });
      } else {
        postAppData({
          data: ratingsData,
          type: 'ratings',
          visibility: AppDataVisibility.Member,
        });
      }
    }
  };

  const handleRatingChange = (rating: RatingName, value: number): void => {
    if (rating === 'novelty') {
      setNoveltyRating(value);
      updateRatings(value, relevanceRating);
    } else if (rating === 'relevance') {
      setRelevanceRating(value);
      updateRatings(noveltyRating, value);
    }
  };
  return (
    <CardActions
      sx={{
        flexDirection: 'column',
      }}
    >
      <LikertScale
        onChange={(rating) => handleRatingChange('novelty', rating)}
        minLabel="Common"
        maxLabel="Novel"
        levels={7}
        value={noveltyRating}
      />
      <LikertScale
        onChange={(rating) => handleRatingChange('relevance', rating)}
        minLabel="Useless"
        maxLabel="Useful"
        levels={7}
        value={relevanceRating}
      />
    </CardActions>
  );
};

export default Rating;
