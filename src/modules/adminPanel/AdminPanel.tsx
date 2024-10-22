import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import grey from '@mui/material/colors/grey';

import { ADMIN_PANEL_CY } from '@/config/selectors';
import useParticipants from '@/hooks/useParticipants';
import stringToColor from '@/utils/stringToColor';

import IdeaInput from '../responseCollection/ResponseInput';
import Orchestration from './Orchestration';
import SectionTitle from './SectionTitle';

interface AdminPanelProps {
  width?: string;
}

const AdminPanel: FC<AdminPanelProps> = ({ width }): JSX.Element => {
  const { t } = useTranslation();

  const participants = useParticipants();

  const { members } = participants;

  return (
    <Paper
      variant="outlined"
      elevation={2}
      sx={{
        width,
        backgroundColor: grey[50],
        p: 4,
        m: 1,
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
          {members?.map((account) => (
            <Tooltip title={account.name} key={account.id}>
              <Avatar
                sx={{ bgcolor: stringToColor(account.name) }}
                alt={account.name}
              >
                {account.name[0]}
              </Avatar>
            </Tooltip>
          ))}
        </Stack>
        <SectionTitle>Act as a bot</SectionTitle>
        <Typography>{t('ADMIN_PANEL.BOT.HELPER')}</Typography>
        <IdeaInput
          actAsBot
          onCancel={() => {
            // TODO: Implement
            // eslint-disable-next-line no-console
            console.warn('Nothing to do here.');
          }}
        />
      </Stack>
    </Paper>
  );
};

export default AdminPanel;
