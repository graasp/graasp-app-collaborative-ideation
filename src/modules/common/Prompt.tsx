import { FC } from 'react';

import Typography from '@mui/material/Typography';

import { useSettings } from '../context/SettingsContext';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PromptProps {}

const Prompt: FC<PromptProps> = () => {
  const { prompt } = useSettings();
  return (
    <Typography sx={{ fontSize: '18pt' }} variant="h4">
      {prompt.content}
    </Typography>
  );
};

export default Prompt;
