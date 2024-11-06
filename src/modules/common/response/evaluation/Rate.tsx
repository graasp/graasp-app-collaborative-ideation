import { FC, useEffect, useState } from 'react';

import CardActions from '@mui/material/CardActions';
import Container from '@mui/material/Container';

import { RatingData } from '@/config/appDataTypes';
import { EVALUATION_RATE_CY } from '@/config/selectors';
import { RatingDescription } from '@/interfaces/evaluation';
import { useRatingsContext } from '@/modules/context/RatingsContext';

import LikertScale from '../../LikertScale';

const Rate: FC<{
  responseId: string;
}> = ({ responseId }) => {
  const { ratings, myRatings, ratingsName, rate } = useRatingsContext();

  const [values, setValues] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    const r = myRatings.find(({ data }) => data.responseRef === responseId);
    if (r) {
      const newVal = new Map<string, number>();
      const { ratings: currentRatings } = r.data;
      currentRatings.forEach((ratingVal) => {
        newVal.set(ratingVal.name, ratingVal.value);
      });
      setValues(newVal);
    }
  }, [myRatings, responseId]);

  const updateRating = (
    newRating: number,
    ratingName: RatingDescription['name'],
  ): void => {
    if (responseId) {
      const newValues = values.set(ratingName, newRating);
      const newRatingData: RatingData = {
        responseRef: responseId,
        name: ratingsName,
        ratings: Array.from(newValues.entries()).map((v) => ({
          name: v[0],
          value: v[1],
        })),
      };
      rate(newRatingData);
    }
  };

  return (
    <CardActions
      sx={{
        flexDirection: 'column',
      }}
      data-cy={EVALUATION_RATE_CY}
    >
      <Container>
        {typeof ratings !== 'undefined' &&
          ratings.map((r, index) => (
            <LikertScale
              onChange={(rating) => updateRating(rating, r.name)}
              minLabel={r.minLabel}
              maxLabel={r.maxLabel}
              levels={r.levels}
              key={index}
              value={values.get(r.name)}
            />
          ))}
      </Container>
    </CardActions>
  );
};

export default Rate;
