import { FC, Key } from 'react';

import Grid from '@mui/material/Grid2';

export const ResponseGridItem: FC<{ children: JSX.Element; key: Key }> = ({
  children,
  key,
}) => (
  <Grid key={key} size={{ xl: 4, sm: 6, xs: 12 }}>
    {children}
  </Grid>
);

const ResponsesGridContainer: FC<{ children: JSX.Element[] | JSX.Element }> = ({
  children,
}) => (
  <Grid container spacing={2}>
    {children}
  </Grid>
);

export default ResponsesGridContainer;
