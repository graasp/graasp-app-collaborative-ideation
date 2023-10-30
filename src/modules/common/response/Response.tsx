import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from '@mui/material';
import green from '@mui/material/colors/green';

import { useLocalContext } from '@graasp/apps-query-client';
import { AppDataVisibility } from '@graasp/sdk';
import { Button } from '@graasp/ui';

import {
  AnonymousIdeaData,
  RatingsAppData,
  RatingsData,
} from '@/config/appDataTypes';
import { NoveltyRelevanceRatings } from '@/interfaces/ratings';

import { useAppDataContext } from '../../context/AppDataContext';
import LikertScale from '../LikertScale';

type RatingName = 'novelty' | 'relevance';

const Response: FC<{
  idea: AnonymousIdeaData;
  onSelect?: (id: string) => void;
  onRatingsChange?: (
    newRatings: { [key: string]: number },
    complete?: boolean,
  ) => void;
  enableBuildAction?: boolean;
}> = ({ idea, onSelect, onRatingsChange, enableBuildAction = true }) => {
  const { t } = useTranslation();
  const { appData, patchAppData, postAppData } = useAppDataContext();
  const { memberId } = useLocalContext();
  const ratings = useMemo(
    () =>
      appData.find(
        ({ data, type, creator }) =>
          data?.ideaRef === idea.id &&
          type === 'ratings' &&
          creator?.id === memberId,
      ) as RatingsAppData<NoveltyRelevanceRatings> | undefined,
    [appData, idea.id, memberId],
  );
  const [noveltyRating, setNoveltyRating] = useState<number>();
  const [relevanceRating, setRelevanceRating] = useState<number>();

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
    const ratingsData: RatingsData<NoveltyRelevanceRatings> = {
      ideaRef: idea.id,
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
    <Card
      variant="outlined"
      sx={{
        maxWidth: '30%',
        minWidth: '160pt',
        backgroundColor:
          noveltyRating && relevanceRating ? green[100] : 'white',
        borderColor: noveltyRating && relevanceRating ? green[700] : 'default',
      }}
    >
      <CardContent sx={{ minHeight: '32pt' }}>
        <Typography variant="body1">{idea.idea}</Typography>
      </CardContent>
      <Divider />
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
      <CardActions>
        <Button
          disabled={!enableBuildAction}
          onClick={() => {
            if (typeof onSelect !== 'undefined') onSelect(idea.id);
          }}
        >
          {t('BUILD_ON_THIS_IDEA')}
        </Button>
      </CardActions>
    </Card>
  );
};

export default Response;
