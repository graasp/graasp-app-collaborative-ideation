import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';

import { ResponseData, ResponseVotes } from '@/interfaces/response';
import { useVoteContext } from '@/modules/context/VoteContext';
import { useThreadsContext } from '@/state/ThreadsContext';
import useParticipants from '@/state/useParticipants';

const Vote: FC<{
  response: ResponseData<ResponseVotes>;
  threadId: string;
}> = ({ response, threadId }) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'EVALUATION.VOTE',
  });

  const { me } = useParticipants();
  const { updateResponse } = useThreadsContext();
  const { availableVotes } = useVoteContext();

  const votes = useMemo(() => {
    const { evaluation } = response;
    if (evaluation) {
      const { votes: v } = evaluation;
      return v;
    }
    return [];
  }, [response]);

  const hasVote = useMemo(() => votes.includes(me.id), [me, votes]);

  const handleVote = (): void => {
    updateResponse(
      {
        ...response,
        evaluation: {
          votes: [...votes, me.id],
        },
      },
      threadId,
    );
  };

  const handleRemoveVote = (): void => {
    updateResponse(
      {
        ...response,
        evaluation: {
          votes: votes.filter((id) => id !== me.id),
        },
      },
      threadId,
    );
  };

  return (
    <CardActions>
      {hasVote ? (
        <Button
          color="success"
          startIcon={<ThumbUpIcon />}
          onClick={() => handleRemoveVote()}
        >
          {t('REMOVE_VOTE_FOR_THIS_RESPONSE')}
        </Button>
      ) : (
        <Button
          startIcon={<ThumbUpIcon />}
          disabled={availableVotes <= 0}
          onClick={() => handleVote()}
        >
          {t('VOTE_FOR_THIS_RESPONSE')}
        </Button>
      )}
    </CardActions>
  );
};

export default Vote;
