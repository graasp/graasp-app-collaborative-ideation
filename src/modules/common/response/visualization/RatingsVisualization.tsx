import { FC, useEffect, useState } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

import { RatingData } from '@/config/appDataTypes';
import { useRatingsContext } from '@/modules/context/RatingsContext';

import CircularIndicator from './indicators/CircularIndicator';

interface RatingsVisualizationProps {
  responseId: string;
}

const RatingsVisualization: FC<RatingsVisualizationProps> = ({
  responseId,
}): JSX.Element => {
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

  if (typeof ratingsDef === 'undefined' || typeof ratings === 'undefined') {
    // TODO: Make that look good.
    return <CircularProgress />;
  }

  const nbrRatings = ratingsDef?.length ?? 0;

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="stretch"
      justifyContent="center"
      m={2}
    >
      {ratingsDef.map((singleRatingDefinition, index) => {
        const { name } = singleRatingDefinition;
        if (ratings) {
          const result = ratings[index];
          console.info(`For aspect ${name}, result is:`, result.value);
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
        return <CircularProgress key={index} />;
      })}
    </Stack>
  );
};

export default RatingsVisualization;
