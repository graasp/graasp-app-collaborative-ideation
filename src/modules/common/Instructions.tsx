import { FC } from 'react';

import Typography from '@mui/material/Typography';

import { useSettings } from '../context/SettingsContext';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface InstructionsProps {}

const Instructions: FC<InstructionsProps> = () => {
  const { instructions } = useSettings();
  return (
    <Typography sx={{ fontSize: '18pt' }} variant="h4">
      {instructions.title.content}
    </Typography>
  );
};

export default Instructions;
