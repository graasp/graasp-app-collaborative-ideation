import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import Paper from '@mui/material/Paper';
import Blue from '@mui/material/colors/blue';
import useTheme from '@mui/material/styles/useTheme';

import { ORCHESTRATION_BAR_CY } from '@/config/selectors';
import useSteps from '@/hooks/useSteps';
import { ActivityStatus } from '@/interfaces/interactionProcess';

import { useActivityContext } from '../context/ActivityContext';
import CommandButton from './CommandButton';
import StepsButton from './StepsButton';

interface OrchestrationBarProps {
  onChange?: (state: ActivityStatus) => void;
}

const OrchestrationBar: FC<OrchestrationBarProps> = () => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'ORCHESTRATION_BAR',
  });
  const { activityState, pauseActivity, playActivity } = useActivityContext();
  const { currentStep, nextStep } = useSteps();
  const { status } = activityState.data;

  const theme = useTheme();

  const handlePlay = (): void => {
    if (typeof currentStep === 'undefined') {
      playActivity(nextStep, 0);
    } else {
      playActivity();
    }
  };

  return (
    <Paper
      variant="outlined"
      elevation={1}
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 1,
        mt: 0,
        mb: 2,
        width: '100%',
        backgroundColor: Blue[50],
        borderColor: theme.palette.primary.main,
      }}
    >
      {status === ActivityStatus.Play ? (
        <CommandButton
          startIcon={<PauseCircleOutlineIcon />}
          onClick={() => pauseActivity()}
          data-cy={ORCHESTRATION_BAR_CY.PAUSE_BUTTON}
          color="warning"
        >
          {t('PAUSE')}
        </CommandButton>
      ) : (
        <CommandButton
          onClick={handlePlay}
          data-cy={ORCHESTRATION_BAR_CY.PLAY_BUTTON}
          startIcon={<PlayCircleOutlineIcon />}
          color="success"
        >
          {t('PLAY')}
        </CommandButton>
      )}
      <StepsButton enable />
    </Paper>
  );
};

export default OrchestrationBar;
