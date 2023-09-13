import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import { IconButton, Stack } from '@mui/material';

import { CurrentStateAppData } from '@/config/appDataTypes';
import { INITIAL_STATE } from '@/config/constants';
import { IdeationState } from '@/interfaces/ideation';
import { getCurrentState } from '@/utils/ideas';

import { useAppDataContext } from '../context/AppDataContext';
import { useSettings } from '../context/SettingsContext';
import SectionTitle from './SectionTitle';

interface StateControlProps {
  onChange?: (state: IdeationState) => void;
}

const StateControl: FC<StateControlProps> = ({ onChange }) => {
  const { t } = useTranslation();
  const { appData, postAppData, patchAppData } = useAppDataContext();
  const { orchestrator } = useSettings();
  const [currentState, setCurrentState] = useState<CurrentStateAppData>();
  const [processState, setProcessState] = useState<IdeationState>();

  useEffect(() => {
    const tmpCurrentState = getCurrentState(appData, orchestrator.id);
    setCurrentState(tmpCurrentState);
    setProcessState(tmpCurrentState?.data.state);
  }, [appData, orchestrator.id]);

  const updateState = async (
    newProcessState?: IdeationState,
  ): Promise<void> => {
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
  const handleChange = (newState: IdeationState): void => {
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
        {processState === IdeationState.Play ? (
          <IconButton onClick={() => handleChange(IdeationState.Pause)}>
            <PauseCircleOutlineIcon />
          </IconButton>
        ) : (
          <IconButton onClick={() => handleChange(IdeationState.Play)}>
            <PlayCircleOutlineIcon />
          </IconButton>
        )}
        <IconButton onClick={() => handleChange(IdeationState.End)}>
          <StopCircleOutlinedIcon />
        </IconButton>
        {processState === IdeationState.End && (
          <IconButton
            onClick={() => handleChange(IdeationState.WaitingForStart)}
          >
            <ReplayOutlinedIcon />
          </IconButton>
        )}
      </Stack>
    </>
  );
};

export default StateControl;
