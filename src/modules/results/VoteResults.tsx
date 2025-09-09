import { FC } from 'react';

import Stack from '@mui/material/Stack';

import { EvaluationType } from '@/interfaces/evaluation';
import { useThreadsContext } from '@/state/ThreadsContext';

import ThreadsGridContainer, { ThreadsGridItem } from '../common/ThreadsGrid';
import Thread from '../common/response/Thread';

type VoteResultsProps = unknown;

const VoteResults: FC<VoteResultsProps> = () => {
  const { allThreads } = useThreadsContext();
  return (
    <Stack
      direction="column"
      justifyItems="center"
      alignItems="center"
      spacing={2}
    >
      <ThreadsGridContainer>
        {allThreads.map((thread) => (
          <ThreadsGridItem key={thread.id}>
            <Thread
              thread={thread}
              nbrOfVotes={
                thread.evaluations.filter((e) => e.type === EvaluationType.Vote)
                  .length
              }
            />
          </ThreadsGridItem>
        ))}
      </ThreadsGridContainer>
      {/* <ExportResponsesButton responses={sortedResponses} /> */}
    </Stack>
  );
};

export default VoteResults;
