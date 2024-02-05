import { ChatBotMessage } from '@graasp/sdk';

export type AssistantId = string;

export type AssistantPersona = {
  id: AssistantId;
  name: string;
  description?: string;
  message: ChatBotMessage[];
  iconUrl?: string;
};

export type AssistantPersonaPreset = Pick<
  AssistantPersona,
  'iconUrl' | 'message' | 'name'
> & {
  description: string;
};

export const makeEmptyAssistant = (id?: AssistantId): AssistantPersona => ({
  id: id || '',
  name: 'GraaspBot',
  description: '',
  message: [],
});
