import { Member } from '@graasp/sdk';

import { AssistantPersona, PromptMode } from '@/interfaces/assistant';
import { EvaluationType } from '@/interfaces/evaluationType';
import {
  ActivityStep,
  ActivityType,
  ResponseVisibilityMode,
} from '@/interfaces/interactionProcess';

import { t } from 'i18next';
import { DEFAULT_SYSTEM_PROMPT } from './prompts';

type InstructionFormatType = 'html' | 'markdown' | 'plain-text';

type InstructionType = {
  content: string;
  format: InstructionFormatType;
};

export type InstructionsSetting = {
  title: InstructionType;
  details?: InstructionType;
  collection: {
    choose: InstructionType;
    input: InstructionType;
  };
  evaluation: InstructionType;
};

export type OrchestratorSetting = {
  id: string;
};

export type ActivitySetting = {
  mode: ResponseVisibilityMode;
  numberOfResponsesPerSet: number;
  numberOfBotResponsesPerSet: number;
  exclusiveResponseDistribution: boolean;
  evaluationType: EvaluationType;
  steps: ActivityStep[];
  reformulateResponses: boolean;
};

export type AssistantsSetting = {
  assistants: AssistantPersona[];
  promptMode?: PromptMode;
  includeDetails?: boolean;
};

export type PromptsSetting = {
  selectedSet?: string;
  maxNumberOfQueries?: number;
};

export type NotParticipatingSetting = { ids: Member['id'][] };

export type AllSettingsType = {
  instructions: InstructionsSetting;
  orchestrator: OrchestratorSetting;
  activity: ActivitySetting;
  notParticipating: NotParticipatingSetting;
  chatbot: {
    systemPrompt: string;
  };
  assistants: AssistantsSetting;
  prompts: PromptsSetting;
};

// default values for the data property of settings by name
export const defaultSettingsValues: AllSettingsType = {
  instructions: {
    title: {
      content: '',
      format: 'plain-text',
    },
    collection: {
      input: {
        content: t('RESPONSE_COLLECTION.CHOOSE_HELPER_INSTRUCTION'),
        format: 'plain-text',
      },
      choose: {
        content: t('RESPONSE_COLLECTION.CHOOSE_HELPER_INSTRUCTION'),
        format: 'plain-text',
      },
    },
    evaluation: {
      content: '',
      format: 'plain-text',
    },
  },
  orchestrator: {
    id: '',
  },
  activity: {
    mode: ResponseVisibilityMode.Open,
    numberOfResponsesPerSet: 3,
    numberOfBotResponsesPerSet: 1,
    exclusiveResponseDistribution: false,
    evaluationType: EvaluationType.UsefulnessNoveltyRating,
    reformulateResponses: false,
    steps: [
      {
        type: ActivityType.Collection,
        round: 0,
        time: 120,
      },
      {
        type: ActivityType.Collection,
        round: 1,
        time: 120,
      },
      {
        type: ActivityType.Collection,
        round: 2,
        time: 120,
      },
      {
        type: ActivityType.Collection,
        round: 3,
        time: 120,
      },
      {
        type: ActivityType.Evaluation,
        time: 180,
      },
    ],
  },
  notParticipating: { ids: [] },
  chatbot: {
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
  },
  assistants: {
    assistants: [],
    promptMode: PromptMode.Problem,
    includeDetails: false,
  },
  prompts: {
    selectedSet: undefined,
    maxNumberOfQueries: undefined,
  },
};
