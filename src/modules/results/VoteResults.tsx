import { FC, useMemo } from 'react';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

import { sortResponsesByNumberOfVote } from '@/hooks/utils/evaluation';
import Response from '@/modules/common/response/Response';

import ExportResponsesButton from '../common/ExportRepsonsesButton';
import { useActivityContext } from '../context/ActivityContext';
import { useVoteContext } from '../context/VoteContext';

type VoteResultsProps = unknown;

const VoteResults: FC<VoteResultsProps> = () => {
  const { allResponses } = useActivityContext();
  const { allVotes } = useVoteContext();
  const sortedResponses = useMemo(
    () => sortResponsesByNumberOfVote(allResponses, allVotes),
    [allResponses, allVotes],
  );
  return (
    <Stack
      direction="column"
      justifyItems="center"
      alignItems="center"
      spacing={2}
    >
      <Grid container spacing={2}>
        {sortedResponses
          ? sortedResponses.map((response) => (
              <Grid item key={response.id} xl={2} sm={4} xs={6}>
                <Response
                  response={response}
                  nbrOfVotes={response.data.evaluation?.votes}
                />
              </Grid>
            ))
          : ''}
      </Grid>
      <ExportResponsesButton responses={sortedResponses} />
    </Stack>
  );
};

export default VoteResults;
