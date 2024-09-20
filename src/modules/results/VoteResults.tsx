import { FC, useMemo } from 'react';
import Grid from '@mui/material/Grid';
import { sortResponsesByNumberOfVote } from '@/hooks/utils/evaluation';
import Response from '@/modules/common/response/Response';
import { useActivityContext } from '../context/ActivityContext';
import { useVoteContext } from '../context/VoteContext';

interface VoteResultsProps {}

const VoteResults: FC<VoteResultsProps> = () => {
  const { allResponses } = useActivityContext();
  const { allVotes } = useVoteContext();
  const sortedResponses = useMemo(
    () => sortResponsesByNumberOfVote(allResponses, allVotes),
    [allResponses, allVotes],
  );
  return (
    <Grid container spacing={2}>
      {sortedResponses
        ? sortedResponses.map((response) => (
            <Grid item key={response.id} md={6} sm={12} xs={12}>
              <Response
                response={response}
                nbrOfVotes={response.data.evaluation?.votes}
              />
            </Grid>
          ))
        : ''}
    </Grid>
  );
};

export default VoteResults;
