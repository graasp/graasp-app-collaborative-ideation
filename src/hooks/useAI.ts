
import { useLoroContext } from '@/state/LoroContext';

interface UseAIValues {
  getFeedback: () => void;
}

const useAI = (): UseAIValues => {
  const { sendMessage } = useLoroContext();


  const getFeedback = (): void => {
    sendMessage({
      type: 'query_a_i',
      data: {
        verb: "get_feedback",
        parameters: null,
      },
    });
};


  return {
    getFeedback
  };
};

export default useAI;
