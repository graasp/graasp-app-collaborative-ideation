import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import CardActions from '@mui/material/CardActions';

import Button from '@mui/material/Button';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useVoteContext } from '@/modules/context/VoteContext';

const Vote: FC<{
  responseId: string;
}> = ({ responseId }) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'EVALUATION.VOTE',
  });

  const { voteFor, removeVoteFor, checkIfHasVote, availableVotes } =
    useVoteContext();

  const hasVote = checkIfHasVote(responseId);

  return (
    <CardActions>
      {hasVote ? (
        <Button
          color="success"
          startIcon={<ThumbUpIcon />}
          onClick={() => removeVoteFor(responseId)}
        >
          {t('REMOVE_VOTE_FOR_THIS_RESPONSE')}
        </Button>
      ) : (
        <Button
          startIcon={<ThumbUpIcon />}
          disabled={availableVotes <= 0}
          onClick={() => voteFor(responseId)}
        >
          {t('VOTE_FOR_THIS_RESPONSE')}
        </Button>
      )}
    </CardActions>
  );
};

export default Vote;
