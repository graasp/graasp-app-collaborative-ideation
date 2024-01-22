import { ChatBotMessage } from '@graasp/sdk';

export type AssistantPersona = {
  name: string;
  message: ChatBotMessage[];
};

export type AssistantPersonaPreset = AssistantPersona & {
  iconUrl: string;
  description: string;
};
