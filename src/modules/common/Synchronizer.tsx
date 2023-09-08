import { FC, useEffect, useMemo } from 'react';

import { Alert } from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';
import { AppDataVisibility } from '@graasp/sdk';

import { List } from 'immutable';

import { IdeaAppData } from '@/config/appDataTypes';
import { anonymizeIdeas } from '@/utils/ideas';

import { useAppDataContext } from '../context/AppDataContext';

interface SynchronizerProps {
  sync: boolean;
}

const Synchronizer: FC<SynchronizerProps> = ({ sync }) => {
  const { postAppData, patchAppData, appData } = useAppDataContext();
  const { memberId } = useLocalContext();

  const setId = useMemo(
    () =>
      appData.find(
        ({ type, creator }) => type === 'idea-set' && creator?.id === memberId,
      )?.id,
    [appData, memberId],
  );

  const ideas = useMemo(
    () => appData.filter(({ type }) => type === 'idea') as List<IdeaAppData>,
    [appData],
  );

  // Sync effect
  useEffect(() => {
    if (sync) {
      if (ideas) {
        const anonymousIdeas = anonymizeIdeas(ideas);
        if (setId) {
          patchAppData({
            id: setId,
            data: {
              ideas: anonymousIdeas.toJS(),
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
  }, [ideas, patchAppData, postAppData, setId, sync]);

  return <Alert severity="success">All ideas are sync.</Alert>; // TODO: improve
};

export default Synchronizer;
