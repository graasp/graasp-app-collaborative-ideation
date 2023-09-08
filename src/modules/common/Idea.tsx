import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from '@mui/material';
import green from '@mui/material/colors/green';

import { Button } from '@graasp/ui';

import { AnonymousIdeaData } from '@/config/appDataTypes';
import { Ratings } from '@/interfaces/ratings';

import LikertScale from './LikertScale';

const Idea: FC<{
  idea: AnonymousIdeaData;
  onSelect?: (id: string) => void;
  ratings?: Ratings;
  onRatingsChange?: (
    newRatings: { [key: string]: number },
    complete?: boolean,
  ) => void;
  enableBuildAction?: boolean;
}> = ({
  idea,
  onSelect,
  // Will be required in future versions
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ratings,
  onRatingsChange,
  enableBuildAction = true,
}) => {
  const { t } = useTranslation();
  const [noveltyRating, setNoveltyRating] = useState<number>();
  const [relevanceRating, setRelevanceRating] = useState<number>();

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
  return (
    <Card
      variant="outlined"
      sx={{
        width: '30%',
        minWidth: '200pt',
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
          onChange={(rating) => setNoveltyRating(rating)}
          minLabel="Common"
          maxLabel="Novel"
          levels={7}
          levelsLabels={[
            'Common',
            'Somewhat common',
            'Familiar',
            'Not common nor novel',
            'Unfamiliar',
            'Somewhat novel',
            'Novel',
          ]}
        />
        <LikertScale
          onChange={(rating) => setRelevanceRating(rating)}
          minLabel="Irrelevant"
          maxLabel="Relevant"
          levelsLabels={[
            'Very irrelevant',
            'Irrelevant',
            'Not very relevant',
            'Not relevant nor irrelevant',
            'Slightly relevant',
            'Relevant',
            'Very relevant',
          ]}
          levels={7}
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

export default Idea;
