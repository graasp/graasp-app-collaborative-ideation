import { FC, useEffect } from 'react';

import { Alert } from '@mui/material';

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

  // Sync effect
  useEffect(() => {
    if (sync) {
      const setId = appData.find(({ type }) => type === 'idea-set')?.id;
      const ideas = appData.filter(
        ({ type }) => type === 'idea',
      ) as List<IdeaAppData>;
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
  }, [appData, patchAppData, postAppData, sync]);

  return <Alert severity="success">All ideas are sync.</Alert>; // TODO: improve
};

export default Synchronizer;
