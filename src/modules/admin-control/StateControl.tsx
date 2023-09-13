import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import { IconButton, Stack } from '@mui/material';

import { IdeationState } from '@/interfaces/ideation';

import SectionTitle from './SectionTitle';

interface StateControlProps {
  onChange?: (state: IdeationState) => void;
}

const StateControl: FC<StateControlProps> = ({ onChange }) => {
  const { t } = useTranslation();
  const [state, setState] = useState<IdeationState>(
    IdeationState.WaitingForStart,
  );
  const handleChange = (newState: IdeationState): void => {
    setState(newState);
    if (onChange) {
      onChange(newState);
    }
  };
  return (
    <>
      <SectionTitle>{t('STATE_CONTROL_TITLE')}</SectionTitle>
      <Stack direction="row" spacing={1}>
        {state === IdeationState.Play ? (
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
        {state === IdeationState.End && (
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
