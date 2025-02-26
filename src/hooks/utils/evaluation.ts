import { VoteAppData } from '@/config/appDataTypes';
import { ResponseData, ResponseVotes } from '@/interfaces/response';

export const sortResponsesByNumberOfVote = (
  responses: Array<ResponseData>,
  votes: Array<VoteAppData>,
): Array<ResponseData<ResponseVotes>> =>
  responses
    .map((response) => {
      const votesForResponse = votes.filter(
        (vote) => vote.data.responseRef === response.id,
      );
      const numberOfVotes = votesForResponse.length;
      return {
        ...response,
        evaluation: {
          votes: numberOfVotes,
        },
      };
    })
    .sort((r1, r2) => {
      const v1 = r1.evaluation?.votes || 0;
      const v2 = r2.evaluation?.votes || 0;
      if (v1 > v2) {
        return -1;
      }
      if (v1 < v2) {
        return 1;
      }
      return 0;
    });
