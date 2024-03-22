import { RatingsAppData } from '@/config/appDataTypes';
import { DimensionsOfGIRatings } from '@/interfaces/ratings';
import Stack from '@mui/material/Stack';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import CircularIndicator from './indicators/CircularIndicator';

const RATING_SCALE = 3;

const compputeMeanRatings = (
  accumulatedRatings: DimensionsOfGIRatings,
  currentRating: DimensionsOfGIRatings,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _index: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _array: DimensionsOfGIRatings[],
): DimensionsOfGIRatings => {
  const newAccumulatedRatings: DimensionsOfGIRatings = {
    coordination:
      (accumulatedRatings.coordination || 0) +
      (currentRating.coordination || 0),
    global: (accumulatedRatings.global || 0) + (currentRating.global || 0),
    socioTechnic:
      (accumulatedRatings.socioTechnic || 0) +
      (currentRating.socioTechnic || 0),
  };
  return newAccumulatedRatings;
};

const DimensionsOfGlobalIssue = ({
  ratings,
}: {
  ratings: RatingsAppData<DimensionsOfGIRatings>[];
}): JSX.Element => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'RATINGS.DIMENSIONS_OF_GI',
  });
  const { t: tGeneral } = useTranslation('translations');

  const DEFAULT_THRESHOLDS: {
    value: number;
    label: string;
    color: 'success' | 'warning' | 'error' | 'primary';
  }[] = useMemo(
    () => [
      {
        value: 0,
        color: 'error',
        label: tGeneral('BAD'),
      },
      {
        value: 1 / RATING_SCALE,
        color: 'warning',
        label: tGeneral('OKAY'),
      },
      {
        value: 2 / RATING_SCALE,
        color: 'success',
        label: tGeneral('GOOD'),
      },
    ],
    [tGeneral],
  );

  const meanRatings = useMemo(() => {
    const accumulatedRatings = ratings
      .map(({ data }) => data.ratings)
      .reduce(compputeMeanRatings);
    // TODO: Divide only by actual number of ratings i.e. don't count undefined.
    const divider = RATING_SCALE * ratings.length;
    return {
      coordination: (accumulatedRatings.coordination || 0) / divider,
      global: (accumulatedRatings.global || 0) / divider,
      socioTechnic: (accumulatedRatings.socioTechnic || 0) / divider,
    };
  }, [ratings]);
  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="stretch"
      justifyContent="center"
      m={2}
    >
      <CircularIndicator
        value={meanRatings.coordination}
        thresholds={DEFAULT_THRESHOLDS}
        label={t('COORDINATION_LABEL_VIZ')}
        width="33%"
      />
      <CircularIndicator
        value={meanRatings.global}
        thresholds={DEFAULT_THRESHOLDS}
        label={t('GLOBAL_LABEL_VIZ')}
        width="33%"
      />
      <CircularIndicator
        value={meanRatings.socioTechnic}
        thresholds={DEFAULT_THRESHOLDS}
        label={t('SOCIOTECHNIC_LABEL_VIZ')}
        width="33%"
      />
    </Stack>
  );
};

export default DimensionsOfGlobalIssue;
