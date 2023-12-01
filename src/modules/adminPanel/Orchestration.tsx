import { FC, MouseEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import InputIcon from '@mui/icons-material/Input';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PollIcon from '@mui/icons-material/Poll';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import {
  IconButton,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';

import { CurrentStateAppData, CurrentStateData } from '@/config/appDataTypes';
import { INITIAL_STATE } from '@/config/constants';
import { ActivityStatus, ActivityType } from '@/interfaces/interactionProcess';
import { getCurrentState } from '@/utils/state';

import { useAppDataContext } from '../context/AppDataContext';
import { useSettings } from '../context/SettingsContext';
import SectionTitle from './SectionTitle';

interface OrchestrationProps {
  onChange?: (state: ActivityStatus) => void;
}

const Orchestration: FC<OrchestrationProps> = ({ onChange }) => {
  const { t } = useTranslation();
  const { appData, postAppData, patchAppData } = useAppDataContext();
  const { orchestrator } = useSettings();
  const [currentState, setCurrentState] = useState<CurrentStateAppData>();
  const [processStatus, setActivityStatus] = useState<ActivityStatus>();
  const [round, setRound] = useState<number>(0);
  const [activity, setActivity] = useState<ActivityType>(
    ActivityType.Collection,
  );

  useEffect(() => {
    const tmpCurrentState = getCurrentState(appData, orchestrator.id);
    setCurrentState(tmpCurrentState);
    setActivityStatus(tmpCurrentState?.data.status);
    const tmpRound = tmpCurrentState?.data?.round;
    if (tmpRound) {
      setRound(tmpRound);
    }
  }, [appData, orchestrator.id]);

  const updateState = async ({
    newProcessState,
    newRound,
    newActivity,
  }: {
    newProcessState?: ActivityStatus;
    newRound?: number;
    newActivity?: ActivityType;
  }): Promise<void> => {
    if (currentState?.id) {
      const {
        status: previousState,
        round: previousRound,
        activity: previousActivity,
      } = currentState.data as CurrentStateData;
      const newData: CurrentStateData = {
        status: newProcessState ?? previousState,
        round: newRound ?? previousRound,
        activity: newActivity ?? previousActivity,
      };
      patchAppData({
        id: currentState.id,
        data: newData,
      });
    } else {
      const {
        status: previousState,
        round: previousRound,
        activity: previousActivity,
      } = INITIAL_STATE.data;
      const newData: CurrentStateData = {
        status: newProcessState ?? previousState,
        round: newRound ?? previousRound,
        activity: newActivity ?? previousActivity,
      };
      postAppData({
        ...INITIAL_STATE,
        data: newData,
      });
    }
  };
  const handleChange = ({
    newProcessState,
    newRound,
  }: {
    newProcessState?: ActivityStatus;
    newRound?: number;
  }): void => {
    if (newProcessState) {
      setActivityStatus(newProcessState);
    }
    if (newRound) {
      setRound(newRound);
    }
    updateState({ newProcessState, newRound });
    if (onChange && newProcessState) {
      onChange(newProcessState);
    }
  };

  const handleActivityChange = (
    _event: MouseEvent,
    value: ActivityType,
  ): void => {
    setActivity(value);
    updateState({ newActivity: value });
  };
  return (
    <>
      <SectionTitle>{t('ADMIN_PANEL.CONTROLS.TITLE')}</SectionTitle>
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
          {processStatus === ActivityStatus.Play ? (
            <IconButton
              onClick={() =>
                handleChange({ newProcessState: ActivityStatus.Pause })
              }
            >
              <PauseCircleOutlineIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={() =>
                handleChange({ newProcessState: ActivityStatus.Play })
              }
            >
              <PlayCircleOutlineIcon />
            </IconButton>
          )}
          <Tooltip title={t('ADMIN_PANEL.CONTROLS.PREVIOUS_ROUND_TOOLTIP')}>
            <IconButton
              // enabled={round >= 0}
              onClick={() => handleChange({ newRound: round - 1 })}
            >
              <SkipPreviousIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="caption">
            {t('ADMIN_PANEL.CONTROLS.ROUND_HELPER', { round })}
          </Typography>
          <Tooltip title={t('ADMIN_PANEL.CONTROLS.NEXT_ROUND_TOOLTIP')}>
            <IconButton onClick={() => handleChange({ newRound: round + 1 })}>
              <SkipNextIcon />
            </IconButton>
          </Tooltip>
        </Paper>
      </Stack>
    </>
  );
};

export default Orchestration;
