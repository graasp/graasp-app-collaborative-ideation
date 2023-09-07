import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Avatar,
  Badge,
  Collapse,
  Divider,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Paper,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import grey from '@mui/material/colors/grey';

import { Member } from '@graasp/sdk';
import { Button } from '@graasp/ui';

import { CurrentStateAppData } from '@/config/appDataTypes';
import { INITIAL_STATE } from '@/config/constants';
import { hooks } from '@/config/queryClient';
import { useAppDataContext } from '@/modules/context/AppDataContext';

import Synchronizer from '../common/Synchronizer';

interface AdminControlProps {
  width?: string;
}

const AdminControl: FC<AdminControlProps> = ({ width }): JSX.Element => {
  const { t } = useTranslation();
  const { postAppData, patchAppData, appData } = useAppDataContext();
  const [currentState, setCurrentState] = useState<CurrentStateAppData>();
  const [sync, setSync] = useState<boolean>(false);
  const initState = (): void => {
    postAppData(INITIAL_STATE);
  };
  const { data: appContext } = hooks.useAppContext();

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
      <Stack spacing={2} direction="column">
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
        <Typography variant="h4" fontSize="14pt">
          Orchestration
        </Typography>
        <FormGroup>
          <FormHelperText>
            When enabled, the applications distribute ideas to the participants
            in an anonymous way.
          </FormHelperText>
          <FormControlLabel
            control={<Switch checked={sync} onChange={handleSyncChange} />}
            label="Enable syncronisation"
          />
        </FormGroup>
        <Collapse in={sync} mountOnEnter unmountOnExit>
          <Synchronizer sync={sync} />
        </Collapse>
      </Stack>
    </Paper>
  );
};

export default AdminControl;
