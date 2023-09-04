import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, CardActions, CardContent, Typography } from '@mui/material';

import { Button } from '@graasp/ui';

import { AnonymousIdeaData } from '@/config/appDataTypes';
import { Ratings } from '@/interfaces/ratings';

const Idea: FC<{
  idea: AnonymousIdeaData;
  onSelect?: (id: string) => void;
  ratings?: Ratings;
}> = ({ idea, onSelect, ratings }) => {
  const { t } = useTranslation();
  return (
    <Card>
      <CardContent>
        <Typography variant="body1">{idea.idea}</Typography>
      </CardContent>
      <CardActions>
        <Button
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
