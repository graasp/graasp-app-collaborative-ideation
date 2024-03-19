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
import { SFERARating } from '@/interfaces/ratings';
import { useAppDataContext } from '@/modules/context/AppDataContext';

import LikertScale from '../../LikertScale';

const SFERARatingComp: FC<{
  responseId: string;
  // eslint-disable-next-line react/no-unused-prop-types
  onRatingsChange?: (
    newRatings: { [key: string]: number },
    complete?: boolean,
  ) => void;
}> = ({ responseId }) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'RATINGS.SFERA',
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
          data?.type === EvaluationType.SFERARating &&
          type === AppDataTypes.Ratings &&
          creator?.id === memberId,
      ) as RatingsAppData<SFERARating> | undefined,
    [appData, responseId, memberId],
  );

  const callbackPromiseUpdateRatings = (data: AppData<Data> | void): void => {
    if (data) {
      postEvaluateResponseAction<SFERARating>(
        data as RatingsAppData<SFERARating>,
      );
    }
  };

  const updateRatings = (newRatings: Partial<SFERARating>): void => {
    if (responseId) {
      const ratingsData: RatingsData<SFERARating> = {
        ideaRef: responseId,
        type: EvaluationType.SFERARating,
        ratings: {
          globalLocal: 0,
          personalGeneral: 0,
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
        <LikertScale
          onChange={(rating) => updateRatings({ globalLocal: rating })}
          minLabel={t('LOCAL')}
          maxLabel={t('GLOBAL')}
          levels={5}
          value={ratings?.data.ratings.globalLocal}
        />
        <LikertScale
          onChange={(rating) => updateRatings({ personalGeneral: rating })}
          minLabel={t('PERSONAL_INTEREST')}
          maxLabel={t('GENERAL_INTEREST')}
          levels={5}
          value={ratings?.data.ratings.personalGeneral}
        />
      </Container>
    </CardActions>
  );
};

export default SFERARatingComp;
