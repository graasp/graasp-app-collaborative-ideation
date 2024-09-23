import { ChatBotMessage } from '@graasp/sdk';

export type AssistantId = string;

export enum AssistantType {
  LLM = 'llm',
  LIST = 'list',
}

export type LLMAssistantConfiguration = Array<ChatBotMessage>;
export type ListAssistantConfiguration = Array<string>;

export type AssistantConfiguration =
  | LLMAssistantConfiguration
  | ListAssistantConfiguration;

export type AssistantPersona<ConfigurationType extends AssistantConfiguration> =
  {
    id: AssistantId;
    type: ConfigurationType extends LLMAssistantConfiguration
      ? AssistantType.LLM
      : AssistantType.LIST;
    name: string;
    description?: string;
    configuration: ConfigurationType;
    iconUrl?: string;
  };

export type AssistantPersonaPreset<T extends AssistantConfiguration> = Pick<
  AssistantPersona<T>,
  'iconUrl' | 'configuration' | 'name'
> & {
  description: string;
};

export const makeEmptyLLMAssistant = (
  id?: AssistantId,
): AssistantPersona<LLMAssistantConfiguration> => ({
  id: id || '',
  name: 'GraaspBot',
  description: '',
  configuration: [],
  type: AssistantType.LLM,
});

export const makeEmptyListAssistant = (
  id?: AssistantId,
): AssistantPersona<ListAssistantConfiguration> => ({
  id: id || '',
  name: 'GraaspBot',
  description: '',
  configuration: [],
  type: AssistantType.LIST,
});

export enum PromptMode {
  Problem = 'problem',
  Instructions = 'instructions',
}

export type ListAssistantStateData = {
  assistantRef: AssistantId;
  postedIndex: Array<number>;
};
