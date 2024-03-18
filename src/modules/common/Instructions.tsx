import { FC } from 'react';

import Typography from '@mui/material/Typography';

import {
  DETAILS_INSTRUCTIONS_CY,
  TITLE_INSTRUCTIONS_CY,
} from '@/config/selectors';

import Paper from '@mui/material/Paper';
import { useSettings } from '../context/SettingsContext';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface InstructionsProps {}

const Instructions: FC<InstructionsProps> = () => {
  const { instructions } = useSettings();
  const { title, details } = instructions;
  return (
    <Paper
      elevation={1}
      sx={{
        width: '100%',
        pt: 2,
        pb: 2,
        pl: 1,
        pr: 1,
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'flex-start',
        mb: 4,
      }}
    >
      <Typography
        sx={{ fontSize: '1.5rem', mb: 2 }}
        variant="body1"
        data-cy={TITLE_INSTRUCTIONS_CY}
      >
        {title.content}
      </Typography>
      {typeof details !== 'undefined' && details.content.length > 0 && (
        <Typography variant="body1" data-cy={DETAILS_INSTRUCTIONS_CY}>
          {details?.content}
        </Typography>
      )}
    </Paper>
  );
};

export default Instructions;
