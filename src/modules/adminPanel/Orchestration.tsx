import { FC, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

import InputIcon from '@mui/icons-material/Input';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PollIcon from '@mui/icons-material/Poll';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import WarningIcon from '@mui/icons-material/Warning';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import { PLAY_PAUSE_BUTTON_CY } from '@/config/selectors';
import { ActivityStatus, ActivityType } from '@/interfaces/interactionProcess';

import { useActivityContext } from '../context/ActivityContext';
import NextRoundButton from './NextRoundButton';
import SectionTitle from './SectionTitle';

interface OrchestrationProps {
  onChange?: (state: ActivityStatus) => void;
}

const Orchestration: FC<OrchestrationProps> = () => {
  const { t } = useTranslation();
  const {
    round,
    stateWarning,
    activityState,
    changeActivity,
    pauseActivity,
    playActivity,
  } = useActivityContext();
  const { activity } = activityState.data;
  const { status } = activityState.data;

  const handleActivityChange = (
    _event: MouseEvent,
    value: ActivityType,
  ): void => {
    if (value !== null) {
      changeActivity(value);
    }
  };
  return (
    <>
      <SectionTitle>{t('ADMIN_PANEL.CONTROLS.TITLE')}</SectionTitle>
      <Collapse in={stateWarning}>
        <Chip
          color="warning"
          icon={<WarningIcon />}
          label="State is duplicated"
        />
      </Collapse>
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="flex-start"
        spacing={1}
        width="100%"
      >
        <ToggleButtonGroup
          orientation="vertical"
          value={activity}
          exclusive
          onChange={handleActivityChange}
        >
          <ToggleButton
            value={ActivityType.Collection}
            aria-label={t('ADMIN_PANEL.CONTROLS.RESPONSE_COLLECTION_BUTTON')}
          >
            <InputIcon sx={{ mr: 1 }} />
            {t('ADMIN_PANEL.CONTROLS.RESPONSE_COLLECTION_BUTTON')}
          </ToggleButton>
          <ToggleButton
            value={ActivityType.Evaluation}
            aria-label={t('ADMIN_PANEL.CONTROLS.EVALUATION_BUTTON')}
          >
            <ThumbsUpDownIcon sx={{ mr: 1 }} />
            {/* Alternatives: */}
            {/* <PollIcon sx={{ mr: 1 }} /> */}
            {/* <HowToVoteIcon sx={{ mr: 1 }} /> */}
            {t('ADMIN_PANEL.CONTROLS.EVALUATION_BUTTON')}
          </ToggleButton>
          <ToggleButton
            value={ActivityType.Results}
            aria-label={t('ADMIN_PANEL.CONTROLS.RESULTS_BUTTON')}
          >
            <PollIcon sx={{ mr: 1 }} />
            {t('ADMIN_PANEL.CONTROLS.RESULTS_BUTTON')}
          </ToggleButton>
        </ToggleButtonGroup>
        <Paper variant="outlined" elevation={1} sx={{ p: 1 }}>
          {status === ActivityStatus.Play ? (
            <IconButton onClick={() => pauseActivity()}>
              <PauseCircleOutlineIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => playActivity()}
              data-cy={PLAY_PAUSE_BUTTON_CY}
            >
              <PlayCircleOutlineIcon />
            </IconButton>
          )}
          <Typography variant="caption">
            {t('ADMIN_PANEL.CONTROLS.ROUND_HELPER', { round })}
          </Typography>
          <NextRoundButton enable />
        </Paper>
      </Stack>
    </>
  );
};

export default Orchestration;
