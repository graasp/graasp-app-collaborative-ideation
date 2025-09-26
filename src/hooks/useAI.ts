import { useLoroContext } from '@/state/LoroContext';
import { getResponsesList } from '@/state/utils';
import { binToString } from '@/utils/ws_codec';

interface UseAIValues {
  getFeedback: (responseId: string) => void;
}

const useAI = (): UseAIValues => {
  const { sendMessage, doc } = useLoroContext();
  const responsesList = getResponsesList(doc);

  const getFeedback = (responseId: string): void => {
    const rIndex = responsesList
      .toArray()
      .findIndex((r) => r.id === responseId);
    const cursor = responsesList.getCursor(rIndex)?.encode();
    sendMessage({
      type: 'query_a_i',
      data: {
        verb: 'get_feedback',
        parameters: cursor
          ? {
              cursor: binToString(cursor),
            }
          : null,
      },
    });
  };

  return {
    getFeedback,
  };
};

export default useAI;
