import { FC, JSX, Key } from 'react';

import Grid from '@mui/material/Grid2';

export const ResponseGridItem: FC<{
  children: JSX.Element;
  key: Key;
  grow?: boolean;
}> = ({ children, key, grow = false }) => (
  <Grid key={key} size={grow ? 'grow' : { xl: 4, sm: 6, xs: 12 }} width="100%">
    {children}
  </Grid>
);

const ResponsesGridContainer: FC<{ children: JSX.Element[] | JSX.Element }> = ({
  children,
}) => (
  <Grid container spacing={2} wrap="wrap" width="100%">
    {children}
  </Grid>
);

export default ResponsesGridContainer;
