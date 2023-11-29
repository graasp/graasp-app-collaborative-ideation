import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Alert, Stack } from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';
import { AppDataVisibility } from '@graasp/sdk';

import isEqual from 'lodash.isequal';

import {
  AppDataTypes,
  RatingsAppData,
  ResponseAppData,
} from '@/config/appDataTypes';
import { REFRESH_INTERVAL_MS } from '@/config/constants';
import { NoveltyRelevanceRatings } from '@/interfaces/ratings';
import { anonymizeIdeas } from '@/utils/ideas';

import { useAppDataContext } from '../context/AppDataContext';
import Countdown from './Countdown';

interface SynchronizerProps {
  sync: boolean;
}

const Synchronizer: FC<SynchronizerProps> = ({ sync }) => {
  const { t } = useTranslation();
  const [isExpirationTimerRunning, setIsExpirationTimerRunning] =
    useState(true);
  const { postAppData, patchAppData, appData, invalidateAppData } =
    useAppDataContext();
  const { memberId } = useLocalContext();

  const [ideasIds, setIdeasIds] = useState<string[]>([]);

  const handleDataExpiration = (): void => {
    setIsExpirationTimerRunning(false);
    invalidateAppData().then(() => setIsExpirationTimerRunning(true));
  };

  const setId = useMemo(
    () =>
      appData.find(
        ({ type, creator }) => type === 'idea-set' && creator?.id === memberId,
      )?.id,
    [appData, memberId],
  );

  const ideas = useMemo(
    () =>
      appData.filter(
        ({ type }) => type === AppDataTypes.Response,
      ) as ResponseAppData[],
    [appData],
  );

  const ratings = useMemo(
    () =>
      appData.filter(
        ({ type }) => type === AppDataTypes.Ratings,
      ) as RatingsAppData<NoveltyRelevanceRatings>[],
    [appData],
  );

  // Sync effect
  useEffect(() => {
    if (sync) {
      const newIdeasIds = ideas.map(({ id }) => id).sort();
      if (ideas && !isEqual(ideasIds, newIdeasIds)) {
        setIdeasIds(newIdeasIds);
        const anonymousIdeas = anonymizeIdeas(ideas, ratings);
        if (setId) {
          patchAppData({
            id: setId,
            data: {
              ideas: anonymousIdeas,
            },
          });
        } else {
          postAppData({
            type: 'idea-set',
            visibility: AppDataVisibility.Item,
            data: {
              ideas: anonymousIdeas,
            },
          });
        }
      }
    }
  }, [ideas, ideasIds, patchAppData, postAppData, ratings, setId, sync]);

  return (
    <Stack width="100%" direction="row" spacing={1}>
      <Alert severity="success">{t('SYNC_ALERT_SUCCESS')}</Alert>
      <Countdown
        start={isExpirationTimerRunning}
        time={REFRESH_INTERVAL_MS}
        onTimeOut={handleDataExpiration}
      />
    </Stack>
  ); // TODO: improve
};

export default Synchronizer;
