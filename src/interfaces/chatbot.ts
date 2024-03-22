import { ChatBotCompletion } from '@graasp/apps-query-client';
import { AssistantId } from './assistant';

export type ChatbotResponseData = ChatBotCompletion & {
  assistantId?: AssistantId;
};
