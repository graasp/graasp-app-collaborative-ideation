import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Avatar,
  Badge,
  Divider,
  Paper,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import grey from '@mui/material/colors/grey';

import { AppDataVisibility, Member } from '@graasp/sdk';
import { Button } from '@graasp/ui';

import { List } from 'immutable';

import { CurrentStateAppData, IdeaAppData } from '@/config/appDataTypes';
import { INITIAL_STATE } from '@/config/constants';
import { hooks } from '@/config/queryClient';
import { useAppDataContext } from '@/modules/context/AppDataContext';
import { anonymizeIdeas } from '@/utils/ideas';

interface AdminControlProps {
  width?: string;
}

const AdminControl: FC<AdminControlProps> = ({ width }): JSX.Element => {
  const { t } = useTranslation();
  const { postAppData, patchAppData } = useAppDataContext();
  const [currentState, setCurrentState] = useState<CurrentStateAppData>();
  const [sync, setSync] = useState<boolean>(false);
  const initState = (): void => {
    postAppData(INITIAL_STATE);
  };
  const { appData } = useAppDataContext();
  const { data: appContext } = hooks.useAppContext();

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

  useEffect(() => {
    const state = appData.find(
      ({ type }) => type === 'current-state',
    ) as CurrentStateAppData;
    setCurrentState(state);
  }, [appData]);
  if (!currentState) {
    return <Button onClick={initState}>Initialize</Button>;
  }
  const members = appContext?.members;

  const getNumberOfIdeas = (member: Member): number => {
    const ideasForMember = appData.filter(
      ({ type, member: memberData }) =>
        type === 'idea' && memberData.id === member.id,
    );
    return ideasForMember.size;
  };

  const handleSyncChange = (
    _event: React.ChangeEvent,
    checked: boolean,
  ): void => {
    setSync(checked);
  };

  return (
    <Paper
      variant="outlined"
      elevation={2}
      sx={{
        width,
        backgroundColor: grey[50],
        // b: '1pt',
        // borderColor: 'black',
        p: 4,
        m: 1,
        // borderRadius: 2,
      }}
    >
      <Stack direction="column">
        <Typography variant="h3" fontSize="16pt">
          {t('ADMIN_PANE_TITLE')}
        </Typography>
        <Divider />
        <Typography variant="h4" fontSize="14pt">
          Participants
        </Typography>
        <Stack sx={{ m: 1 }} direction="row" spacing={2}>
          {members?.map((member) => (
            <Badge
              key={member.id}
              badgeContent={getNumberOfIdeas(member)}
              color="secondary"
            >
              <Avatar alt={member.name}>{member.name[0]}</Avatar>
            </Badge>
          ))}
        </Stack>
        <Switch checked={sync} onChange={handleSyncChange} />
      </Stack>
    </Paper>
  );
};

export default AdminControl;
