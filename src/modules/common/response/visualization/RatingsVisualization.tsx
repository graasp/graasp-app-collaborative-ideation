import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LinearProgress, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';

import { RatingData } from '@/config/appDataTypes';
import { TRANSLATIONS_NS } from '@/config/i18n';
import { useRatingsContext } from '@/modules/context/RatingsContext';

import CircularIndicator from './indicators/CircularIndicator';

interface RatingsVisualizationProps {
  responseId: string;
}

const RatingsVisualization: FC<RatingsVisualizationProps> = ({
  responseId,
}): JSX.Element => {
  const { t } = useTranslation(TRANSLATIONS_NS, { keyPrefix: 'EVALUATION' });
  const {
    ratings: ratingsDef,
    getRatingsStatsForResponse,
    ratingsThresholds,
  } = useRatingsContext();

  const [ratings, setRatings] = useState<RatingData['ratings'] | undefined>(
    undefined,
  );

  useEffect(() => {
    getRatingsStatsForResponse(responseId).then((d) => setRatings(d));
  }, [getRatingsStatsForResponse, responseId]);

  const nbrRatings = ratingsDef?.length ?? 0;

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="stretch"
      justifyContent="center"
      m={2}
    >
      {typeof ratingsDef === 'undefined' || typeof ratings === 'undefined' ? (
        <LinearProgress />
      ) : (
        ratingsDef.map((singleRatingDefinition, index) => {
          const { name } = singleRatingDefinition;
          if (ratings) {
            const result = ratings[index];
            if (typeof result === 'undefined') {
              return (
                <Typography key={index} variant="caption">
                  {t('NO_DATA_FOR_RATING', { ratingName: name })}
                </Typography>
              );
            }
            return (
              <CircularIndicator
                key={index}
                value={result.value}
                thresholds={ratingsThresholds}
                label={name}
                width={`${100 / nbrRatings}%`}
              />
            );
          }
          return <LinearProgress key={index} />;
        })
      )}
    </Stack>
  );
};

export default RatingsVisualization;
