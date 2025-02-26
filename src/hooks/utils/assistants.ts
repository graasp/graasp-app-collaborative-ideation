import { ChatbotResponseAppData } from '@/config/appDataTypes';
import { ResponseData, ResponseEvaluation } from '@/interfaces/response';

const ASSISTANT_RESPONSE_DEFAULT: Partial<ResponseData> = {
  response: '',
  bot: true,
  markup: 'markdown',
};

export const makeAssistantResponse = (
  chatResponse: ChatbotResponseAppData,
  round: number,
): ResponseData<ResponseEvaluation> => ({
  ...ASSISTANT_RESPONSE_DEFAULT,
  response: chatResponse.data.completion ?? '',
  assistantId: chatResponse.data.assistantId ?? '',
  round,
  author: {
    id: chatResponse.data.assistantId ?? '',
    name: 'Assistant', // TODO: Replace with actual assistant name if available
  },
  id: chatResponse.id ?? '', // Ensure id is always a string
});
