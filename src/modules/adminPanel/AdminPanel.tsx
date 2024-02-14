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
import stringToColor from '@/utils/stringToColor';

import { useActivityContext } from '../context/ActivityContext';
import IdeaInput from '../responseCollection/ResponseInput';
import Assistants from './Assistants';
import Orchestration from './Orchestration';
import SectionTitle from './SectionTitle';

interface AdminPanelProps {
  width?: string;
}

const AdminPanel: FC<AdminPanelProps> = ({ width }): JSX.Element => {
  const { t } = useTranslation();

  const { participants } = useActivityContext();

  const { members } = participants;

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
        <Assistants />
        <SectionTitle>{t('PARTICIPANTS')}</SectionTitle>
        <Stack sx={{ m: 1 }} direction="row" spacing={2}>
          {members?.map((member) => (
            // <Badge
            //   key={member.id}
            //   badgeContent={getNumberOfIdeas(member)}
            //   color="secondary"
            // >
            <Tooltip title={member.name} key={member.id}>
              <Avatar
                sx={{ bgcolor: stringToColor(member.name) }}
                alt={member.name}
              >
                {member.name[0]}
              </Avatar>
            </Tooltip>
            // </Badge>
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
