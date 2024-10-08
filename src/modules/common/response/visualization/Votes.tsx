/* eslint-disable arrow-body-style */
import { FC } from 'react';

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const Votes: FC<{
  votes: number;
}> = ({ votes }) => {
  // const { t } = useTranslation('translations', {
  //   keyPrefix: 'VISUALIZATION.VOTES',
  // });

  return (
    <Stack direction="row" spacing={2} justifyContent="center" m={2}>
      <ThumbUpIcon />
      <Typography>{votes}</Typography>
    </Stack>
  );
};

export default Votes;
