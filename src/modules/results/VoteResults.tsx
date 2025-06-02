import { FC, useMemo } from 'react';

import Stack from '@mui/material/Stack';

import { sortResponsesByNumberOfVote } from '@/hooks/utils/evaluation';
import Response from '@/modules/common/response/Response';

import ExportResponsesButton from '../common/ExportRepsonsesButton';
import ResponsesGridContainer, {
  ResponseGridItem,
} from '../common/ResponsesGrid';
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
      <ResponsesGridContainer>
        {sortedResponses ? (
          sortedResponses.map((response) => (
            <ResponseGridItem key={response.id}>
              <Response
                response={response}
                nbrOfVotes={response.data.evaluation?.votes}
              />
            </ResponseGridItem>
          ))
        ) : (
          // TODO: translate and improve this message
          <p>Nothing to show.</p>
        )}
      </ResponsesGridContainer>
      <ExportResponsesButton responses={sortedResponses} />
    </Stack>
  );
};

export default VoteResults;
