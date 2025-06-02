import { ChatbotResponseAppData } from '@/config/appDataTypes';
import { ResponseData } from '@/interfaces/response';

const ASSISTANT_RESPONSE_DEFAULT: Partial<ResponseData> = {
  response: '',
  bot: true,
  markup: 'markdown',
};

export const makeAssistantResponse = (
  chatResponse: ChatbotResponseAppData,
  round: number,
): ResponseData => ({
  ...ASSISTANT_RESPONSE_DEFAULT,
  response: chatResponse.data.completion,
  assistantId: chatResponse.data.assistantId,
  round,
});
