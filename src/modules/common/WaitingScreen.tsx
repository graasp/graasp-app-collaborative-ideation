import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Alert from '@mui/material/Alert';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { ActivityStatus } from '@/interfaces/activity_state';

interface WaitingScreenProps {
  state: ActivityStatus;
}

const WaitingScreen: FC<WaitingScreenProps> = ({ state }) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'WAIT_TO_START_SCREEN',
  });

  if (state === ActivityStatus.Pause) {
    return (
      <Stack direction="column" justifyItems="center" spacing={4}>
        <LinearProgress />
        <Alert severity="info">{t('PAUSE_MESSAGE')}</Alert>
      </Stack>
    );
  }
  return (
    <Stack direction="column" justifyItems="center" spacing={4}>
      <Typography variant="body1">
        {t('MAIN_INSTRUCTION')}
        <ul>
          <li>{t('STEP1')}</li>
          <li>{t('STEP2')}</li>
          <li>{t('STEP3')}</li>
        </ul>
      </Typography>
    </Stack>
  );
};

export default WaitingScreen;
