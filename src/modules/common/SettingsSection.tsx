import { FC } from 'react';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface SettingsSectionProps {
  children: JSX.Element[] | JSX.Element;
  title: string;
}

const SettingsSection: FC<SettingsSectionProps> = ({ children, title }) => (
  <Stack spacing={2}>
    <Typography sx={{ mb: '1em' }} variant="h3">
      {title}
    </Typography>
    {children}
  </Stack>
);

export default SettingsSection;
