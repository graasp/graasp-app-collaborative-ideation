import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import grey from '@mui/material/colors/grey';

import { Member } from '@graasp/sdk';

import { CurrentStateAppData } from '@/config/appDataTypes';
import { INITIAL_STATE } from '@/config/constants';
import { hooks } from '@/config/queryClient';
import { ADMIN_PANEL_CY, INITIALIZE_BTN_CY } from '@/config/selectors';
import { useAppDataContext } from '@/modules/context/AppDataContext';

import IdeaInput from '../responseCollection/ResponseInput';
import Orchestration from './Orchestration';
import SectionTitle from './SectionTitle';

interface AdminPanelProps {
  width?: string;
}

const AdminPanel: FC<AdminPanelProps> = ({ width }): JSX.Element => {
  const { t } = useTranslation();
  const { postAppData, appData } = useAppDataContext();
  const [currentState, setCurrentState] = useState<CurrentStateAppData>();
  // const [sync, setSync] = useState<boolean>(true);
  const initState = (): void => {
    postAppData(INITIAL_STATE);
  };
  const { data: appContext } = hooks.useAppContext();
  const getNumberOfIdeas = useCallback(
    (member: Member): number => {
      const ideasForMember = appData.filter(
        ({ type, member: memberData }) =>
          type === 'idea' && memberData.id === member.id,
      );
      return ideasForMember.length;
    },
    [appData],
  );

  useEffect(() => {
    const state = appData.find(
      ({ type }) => type === 'current-state',
    ) as CurrentStateAppData;
    setCurrentState(state);
  }, [appData]);
  if (!currentState) {
    return (
      <Button data-cy={INITIALIZE_BTN_CY} onClick={initState}>
        Initialize
      </Button>
    );
  }
  const members = appContext?.members;

  // const handleSyncChange = (
  //   _event: React.ChangeEvent,
  //   checked: boolean,
  // ): void => {
  //   setSync(checked);
  // };

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
      data-cy={ADMIN_PANEL_CY}
    >
      <Stack spacing={2} direction="column">
        <Typography variant="h3" fontSize="16pt">
          {t('ADMIN_PANEL.TITLE')}
        </Typography>
        <Divider />
        <Orchestration />
        <SectionTitle>{t('PARTICIPANTS')}</SectionTitle>
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
        <SectionTitle>Act as a bot</SectionTitle>
        <Typography>{t('ADMIN_PANEL.BOT.HELPER')}</Typography>
        <IdeaInput actAsBot />
      </Stack>
    </Paper>
  );
};

export default AdminPanel;
