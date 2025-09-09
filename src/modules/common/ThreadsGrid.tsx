import { FC, JSX, Key } from 'react';

import Grid from '@mui/material/Grid2';

export const ThreadsGridItem: FC<{
  children: JSX.Element;
  key: Key;
  grow?: boolean;
}> = ({ children, key, grow = false }) => (
  <Grid key={key} size={grow ? 'grow' : { xl: 6, sm: 12, xs: 12 }} width="100%">
    {children}
  </Grid>
);

const ThreadsGridContainer: FC<{ children: JSX.Element[] | JSX.Element }> = ({
  children,
}) => (
  <Grid container spacing={2} wrap="wrap" width="100%">
    {children}
  </Grid>
);

export default ThreadsGridContainer;
