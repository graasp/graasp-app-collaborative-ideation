import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Alert,
  LinearProgress,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';

import { GraaspLogo } from '@graasp/ui';

import { ActivityStatus } from '@/interfaces/interactionProcess';

interface WaitingScreenProps {
  state: ActivityStatus;
}

const WaitingScreen: FC<WaitingScreenProps> = ({ state }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  if (state === ActivityStatus.Pause) {
    return (
      <Stack direction="column" justifyItems="center" spacing={4}>
        <GraaspLogo height={90} sx={{ fill: theme.palette.primary.main }} />
        <LinearProgress />
        <Alert severity="info">{t('PAUSE_MESSAGE')}</Alert>
      </Stack>
    );
  }
  return (
    <Stack direction="column" justifyItems="center" spacing={4}>
      <GraaspLogo height={90} sx={{ fill: theme.palette.primary.main }} />
      <Typography>
        {t('WAIT_TO_START_SCREEN_MAIN_INSTRUCTION')}
        <ul>
          <li>{t('WAIT_TO_START_SCREEN_STEP1')}</li>
          <li>{t('WAIT_TO_START_SCREEN_STEP2')}</li>
        </ul>
      </Typography>
    </Stack>
  );
};

export default WaitingScreen;
