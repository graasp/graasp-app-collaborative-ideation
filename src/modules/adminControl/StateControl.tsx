import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import { IconButton, Stack } from '@mui/material';

import { CurrentStateAppData } from '@/config/appDataTypes';
import { INITIAL_STATE } from '@/config/constants';
import { ProcessState } from '@/interfaces/interactionProcess';
import { getCurrentState } from '@/utils/ideas';

import { useAppDataContext } from '../context/AppDataContext';
import { useSettings } from '../context/SettingsContext';
import SectionTitle from './SectionTitle';

interface StateControlProps {
  onChange?: (state: ProcessState) => void;
}

const StateControl: FC<StateControlProps> = ({ onChange }) => {
  const { t } = useTranslation();
  const { appData, postAppData, patchAppData } = useAppDataContext();
  const { orchestrator } = useSettings();
  const [currentState, setCurrentState] = useState<CurrentStateAppData>();
  const [processState, setProcessState] = useState<ProcessState>();

  useEffect(() => {
    const tmpCurrentState = getCurrentState(appData, orchestrator.id);
    setCurrentState(tmpCurrentState);
    setProcessState(tmpCurrentState?.data.state);
  }, [appData, orchestrator.id]);

  const updateState = async (newProcessState?: ProcessState): Promise<void> => {
    if (currentState?.id) {
      patchAppData({
        id: currentState.id,
        data: {
          ...currentState.data.toJS(),
          state: newProcessState,
        },
      });
    } else {
      postAppData({
        ...INITIAL_STATE,
        data: {
          ...INITIAL_STATE.data,
          state: newProcessState,
        },
      });
    }
  };
  const handleChange = (newState: ProcessState): void => {
    setProcessState(newState);
    updateState(newState);
    if (onChange) {
      onChange(newState);
    }
  };
  return (
    <>
      <SectionTitle>{t('STATE_CONTROL_TITLE')}</SectionTitle>
      <Stack direction="row" spacing={1}>
        {processState === ProcessState.Play ? (
          <IconButton onClick={() => handleChange(ProcessState.Pause)}>
            <PauseCircleOutlineIcon />
          </IconButton>
        ) : (
          <IconButton onClick={() => handleChange(ProcessState.Play)}>
            <PlayCircleOutlineIcon />
          </IconButton>
        )}
        <IconButton onClick={() => handleChange(ProcessState.End)}>
          <StopCircleOutlinedIcon />
        </IconButton>
        {processState === ProcessState.End && (
          <IconButton
            onClick={() => handleChange(ProcessState.WaitingForStart)}
          >
            <ReplayOutlinedIcon />
          </IconButton>
        )}
      </Stack>
    </>
  );
};

export default StateControl;
