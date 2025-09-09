import { FC } from 'react';

import Stack from '@mui/material/Stack';

import { useThreadsContext } from '@/state/ThreadsContext';

import ThreadsGridContainer, { ThreadsGridItem } from '../common/ThreadsGrid';
import Thread from '../common/response/Thread';

type RatingsResultsProps = unknown;

const RatingsResults: FC<RatingsResultsProps> = () => {
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
            <Thread thread={thread} showRatings />
          </ThreadsGridItem>
        ))}
      </ThreadsGridContainer>
      {/* <ExportResponsesButton responses={allResponses} /> */}
    </Stack>
  );
};

export default RatingsResults;
