import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import CardActions from '@mui/material/CardActions';
import Container from '@mui/material/Container';

import { useLocalContext } from '@graasp/apps-query-client';
import { AppDataVisibility } from '@graasp/sdk';

import {
  AppDataTypes,
  RatingsAppData,
  RatingsData,
} from '@/config/appDataTypes';
import { EvaluationType } from '@/interfaces/evaluationType';
import { UsefulnessNoveltyRatings } from '@/interfaces/ratings';
import { useAppDataContext } from '@/modules/context/AppDataContext';

import LikertScale from '../../LikertScale';

type RatingName = 'novelty' | 'relevance';

const UsefulnessNoveltyRating: FC<{
  responseId: string;
  onRatingsChange?: (
    newRatings: { [key: string]: number },
    complete?: boolean,
  ) => void;
}> = ({ responseId, onRatingsChange }) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'RATINGS.USEFULNESS_NOVELTY',
  });
  const [noveltyRating, setNoveltyRating] = useState<number>();
  const [usefulnessRating, setUsefulnessRating] = useState<number>();
  const { appData, patchAppData, postAppData } = useAppDataContext();
  const { memberId } = useLocalContext();

  const ratings = useMemo(
    () =>
      appData.find(
        ({ data, type, creator }) =>
          data?.ideaRef === responseId &&
          type === AppDataTypes.Ratings &&
          creator?.id === memberId,
      ) as RatingsAppData<UsefulnessNoveltyRatings> | undefined,
    [appData, responseId, memberId],
  );

  useEffect(() => {
    if (ratings) {
      const { novelty, usefulness } = ratings.data.ratings;
      if (novelty) {
        setNoveltyRating(novelty);
      }
      if (usefulness) {
        setUsefulnessRating(usefulness);
      }
    }
  }, [ratings]);
  useEffect(() => {
    if (onRatingsChange) {
      onRatingsChange(
        {
          ...(noveltyRating && { novelty: noveltyRating }),
          ...(usefulnessRating && { relevance: usefulnessRating }),
        },
        Boolean(noveltyRating) && Boolean(usefulnessRating),
      );
    }
  }, [noveltyRating, onRatingsChange, usefulnessRating]);

  const updateRatings = (
    novelty: number | undefined,
    relevance: number | undefined,
  ): void => {
    if (responseId) {
      const ratingsData: RatingsData<UsefulnessNoveltyRatings> = {
        ideaRef: responseId,
        type: EvaluationType.UsefulnessNoveltyRating,
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
          type: AppDataTypes.Ratings,
          visibility: AppDataVisibility.Member,
        });
      }
    }
  };

  const handleRatingChange = (rating: RatingName, value: number): void => {
    if (rating === 'novelty') {
      setNoveltyRating(value);
      updateRatings(value, usefulnessRating);
    } else if (rating === 'relevance') {
      setUsefulnessRating(value);
      updateRatings(noveltyRating, value);
    }
  };
  return (
    <CardActions
      sx={{
        flexDirection: 'column',
      }}
    >
      <Container>
        <LikertScale
          onChange={(rating) => handleRatingChange('novelty', rating)}
          minLabel={t('COMMON')}
          maxLabel={t('NOVEL')}
          levels={7}
          value={noveltyRating}
        />
        <LikertScale
          onChange={(rating) => handleRatingChange('relevance', rating)}
          minLabel={t('USELESS')}
          maxLabel={t('USEFUL')}
          levels={7}
          value={usefulnessRating}
        />
      </Container>
    </CardActions>
  );
};

export default UsefulnessNoveltyRating;
