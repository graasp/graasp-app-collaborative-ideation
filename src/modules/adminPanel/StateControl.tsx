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

import { CurrentStateAppData } from '@/config/appDataTypes';
import { INITIAL_STATE } from '@/config/constants';
import { ActivityType, ProcessStatus } from '@/interfaces/interactionProcess';
import { getCurrentState } from '@/utils/state';

import { useAppDataContext } from '../context/AppDataContext';
import { useSettings } from '../context/SettingsContext';
import SectionTitle from './SectionTitle';

interface StateControlProps {
  onChange?: (state: ProcessStatus) => void;
}

const StateControl: FC<StateControlProps> = ({ onChange }) => {
  const { t } = useTranslation();
  const { appData, postAppData, patchAppData } = useAppDataContext();
  const { orchestrator } = useSettings();
  const [currentState, setCurrentState] = useState<CurrentStateAppData>();
  const [processStatus, setProcessStatus] = useState<ProcessStatus>();
  const [round, setRound] = useState<number>(0);
  const [activity, setActivity] = useState<ActivityType>(
    ActivityType.ResponseCollection,
  );

  useEffect(() => {
    const tmpCurrentState = getCurrentState(appData, orchestrator.id);
    setCurrentState(tmpCurrentState);
    setProcessStatus(tmpCurrentState?.data.status);
  }, [appData, orchestrator.id]);

  const updateState = async ({
    newProcessState,
    newRound,
  }: {
    newProcessState?: ProcessStatus;
    newRound?: number;
  }): Promise<void> => {
    if (currentState?.id) {
      const { state: previousState, round: previousRound } =
        currentState.data.toJS() as { state: ProcessStatus; round: number };
      const newData = {
        state: newProcessState ?? previousState,
        round: newRound ?? previousRound,
      };
      patchAppData({
        id: currentState.id,
        data: newData,
      });
    } else {
      const { status: previousState, round: previousRound } =
        INITIAL_STATE.data;
      const newData = {
        state: newProcessState ?? previousState,
        round: newRound ?? previousRound,
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
    newProcessState?: ProcessStatus;
    newRound?: number;
  }): void => {
    if (newProcessState) {
      setProcessStatus(newProcessState);
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
  };
  return (
    <>
      <SectionTitle>{t('ADMIN_PANEL.CONTROLS.TITLE')}</SectionTitle>
      <Stack
        direction="row"
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
            value={ActivityType.ResponseCollection}
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
          {processStatus === ProcessStatus.Play ? (
            <IconButton
              onClick={() =>
                handleChange({ newProcessState: ProcessStatus.Pause })
              }
            >
              <PauseCircleOutlineIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={() =>
                handleChange({ newProcessState: ProcessStatus.Play })
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

export default StateControl;
