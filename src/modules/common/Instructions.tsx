import { FC } from 'react';

import Typography from '@mui/material/Typography';

import {
  DETAILS_INSTRUCTIONS_CY,
  TITLE_INSTRUCTIONS_CY,
} from '@/config/selectors';

import { useSettings } from '../context/SettingsContext';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface InstructionsProps {}

const Instructions: FC<InstructionsProps> = () => {
  const { instructions } = useSettings();
  const { title, details } = instructions;
  return (
    <>
      <Typography
        sx={{ fontSize: '18pt' }}
        variant="h4"
        data-cy={TITLE_INSTRUCTIONS_CY}
      >
        {title.content}
      </Typography>
      {typeof details !== 'undefined' && details.content.length > 0 && (
        <Typography variant="body1" data-cy={DETAILS_INSTRUCTIONS_CY}>
          {details?.content}
        </Typography>
      )}
    </>
  );
};

export default Instructions;
