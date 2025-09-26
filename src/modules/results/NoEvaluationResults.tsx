import { FC } from 'react';

import Stack from '@mui/material/Stack';

import { useThreadsContext } from '@/state/ThreadsContext';

import ThreadsGridContainer, { ThreadsGridItem } from '../common/ThreadsGrid';
import Thread from '../common/response/Thread';

type NoEvaluationResultsProps = unknown;

const NoEvaluationResults: FC<NoEvaluationResultsProps> = () => {
  const { allThreads } = useThreadsContext();
  return (
    <Stack
      direction="column"
      justifyItems="center"
      alignItems="center"
      spacing={2}
    >
      <ThreadsGridContainer>
        {allThreads ? (
          allThreads.map((thread) => (
            <ThreadsGridItem key={thread.id}>
              <Thread thread={thread} />
            </ThreadsGridItem>
          ))
        ) : (
          // TODO: translate and improve this message
          <p>Nothing to show.</p>
        )}
      </ThreadsGridContainer>
      {/* <ExportResponsesButton responses={allResponses} /> */}
    </Stack>
  );
};

export default NoEvaluationResults;
