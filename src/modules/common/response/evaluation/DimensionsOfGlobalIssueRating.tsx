import { FC, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import CardActions from '@mui/material/CardActions';
import Container from '@mui/material/Container';

import { Data, useLocalContext } from '@graasp/apps-query-client';
import { AppData, AppDataVisibility } from '@graasp/sdk';

import {
  AppDataTypes,
  RatingsAppData,
  RatingsData,
} from '@/config/appDataTypes';
import useActions from '@/hooks/useActions';
import { EvaluationType } from '@/interfaces/evaluationType';
import { DimensionsOfGIRatings } from '@/interfaces/ratings';
import { useAppDataContext } from '@/modules/context/AppDataContext';

import Feedback from '../../Feedback';

const DimensionsOfGlobalIssueRating: FC<{
  responseId: string;
  // eslint-disable-next-line react/no-unused-prop-types
  onRatingsChange?: (
    newRatings: { [key: string]: number },
    complete?: boolean,
  ) => void;
}> = ({ responseId }) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'RATINGS.DIMENSIONS_OF_GI',
  });
  const { appData, patchAppDataAsync, postAppDataAsync } = useAppDataContext();
  const { memberId } = useLocalContext();
  const { postEvaluateResponseAction } = useActions();
  const promiseUpdateRatings = useRef<Promise<void>>();

  const ratings = useMemo(
    () =>
      appData.find(
        ({ data, type, creator }) =>
          data?.ideaRef === responseId &&
          data?.type === EvaluationType.DimensionsOfGIRating &&
          type === AppDataTypes.Ratings &&
          creator?.id === memberId,
      ) as RatingsAppData<DimensionsOfGIRatings> | undefined,
    [appData, responseId, memberId],
  );

  const callbackPromiseUpdateRatings = (data: AppData<Data> | void): void => {
    if (data) {
      postEvaluateResponseAction<DimensionsOfGIRatings>(
        data as RatingsAppData<DimensionsOfGIRatings>,
      );
    }
  };

  const updateRatings = (newRatings: Partial<DimensionsOfGIRatings>): void => {
    if (responseId) {
      const ratingsData: RatingsData<DimensionsOfGIRatings> = {
        ideaRef: responseId,
        type: EvaluationType.DimensionsOfGIRating,
        ratings: {
          coordination: 0,
          global: 0,
          socioTechnic: 0,
          ...ratings?.data.ratings,
          ...newRatings,
        },
      };
      if (ratings?.id) {
        promiseUpdateRatings.current = patchAppDataAsync({
          id: ratings.id,
          data: ratingsData,
        }).then(callbackPromiseUpdateRatings);
      } else {
        promiseUpdateRatings.current = postAppDataAsync({
          data: ratingsData,
          type: AppDataTypes.Ratings,
          visibility: AppDataVisibility.Item,
        }).then(callbackPromiseUpdateRatings);
      }
    }
  };

  return (
    <CardActions
      sx={{
        flexDirection: 'column',
      }}
    >
      <Container>
        <Feedback
          onChange={(rating) => updateRatings({ coordination: rating })}
          label={t('COORDINATION_LABEL')}
          levels={3}
          value={ratings?.data.ratings.coordination}
        />
        <Feedback
          onChange={(rating) => updateRatings({ global: rating })}
          label={t('GLOBAL_LABEL')}
          levels={3}
          value={ratings?.data.ratings.global}
        />
        <Feedback
          onChange={(rating) => updateRatings({ socioTechnic: rating })}
          label={t('SOCIOTECHNIC_LABEL')}
          levels={3}
          value={ratings?.data.ratings.socioTechnic}
        />
      </Container>
    </CardActions>
  );
};

export default DimensionsOfGlobalIssueRating;
