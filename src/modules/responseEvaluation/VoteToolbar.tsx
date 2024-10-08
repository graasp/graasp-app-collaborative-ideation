import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { useVoteContext } from '../context/VoteContext';

const VoteToolbar: FC = () => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'EVALUATION.VOTE',
  });
  const { availableVotes, maxNumberOfVotes } = useVoteContext();
  return (
    <Box justifyItems="flex-end" width="100%">
      <Paper
        variant="outlined"
        elevation={1}
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1,
          mt: 0,
          mb: 2,
          width: 'auto',
        }}
      >
        <Typography>
          {t('VOTES_LEFT', { availableVotes, maxNumberOfVotes })}
        </Typography>
      </Paper>
    </Box>
  );
};

export default VoteToolbar;
