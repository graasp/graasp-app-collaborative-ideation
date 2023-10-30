import { FC } from 'react';

import { Typography, TypographyProps } from '@mui/material';

const SectionTitle: FC<TypographyProps> = (props) => (
  <Typography variant="h4" fontSize="14pt" {...props}>
    {props.children}
  </Typography>
);

export default SectionTitle;
