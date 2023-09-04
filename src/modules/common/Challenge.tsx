import { FC } from 'react';

import Typography from '@mui/material/Typography';

interface ChallengeProps {
  children: JSX.Element | string;
}

const Challenge: FC<ChallengeProps> = (props) => {
  const { children } = props;
  return (
    <Typography sx={{ fontSize: '18pt' }} variant="h4">
      {children}
    </Typography>
  );
};

export default Challenge;
