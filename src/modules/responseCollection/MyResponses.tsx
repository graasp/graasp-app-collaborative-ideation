import { FC } from 'react';

import Typography from '@mui/material/Typography';

import { useLocalContext } from '@graasp/apps-query-client';

import Response from '@/modules/common/response/Response';

import ResponsesGridContainer, {
  ResponseGridItem,
} from '../common/ResponsesGrid';
import { useActivityContext } from '../context/ActivityContext';

const MyResponses: FC = () => {
  const { accountId } = useLocalContext();
  const { myResponses, deleteResponse, round } = useActivityContext();

  const handleDelete = async (id: string): Promise<void> => deleteResponse(id);
  if (accountId) {
    return (
      <>
        <Typography sx={{ fontSize: '18pt' }} variant="h4">
          My responses
        </Typography>
        <ResponsesGridContainer>
          {myResponses ? (
            myResponses.map((response) => (
              <ResponseGridItem key={response.id}>
                <Response
                  key={response.id}
                  response={response}
                  onDelete={
                    response.data.round === round ? handleDelete : undefined
                  }
                />
              </ResponseGridItem>
            ))
          ) : (
            <Typography variant="body1">
              {/* TODO: Improve this message */}
              You have not submitted any response yet.
            </Typography>
          )}
        </ResponsesGridContainer>
      </>
    );
  }
  return null;
};

export default MyResponses;
