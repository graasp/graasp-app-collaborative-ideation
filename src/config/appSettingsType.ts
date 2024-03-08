import { Member } from '@graasp/sdk';

import { AssistantPersona } from '@/interfaces/assistant';
import { EvaluationType } from '@/interfaces/evaluationType';
import {
  ActivityStep,
  ActivityType,
  ResponseVisibilityMode,
} from '@/interfaces/interactionProcess';

import { DEFAULT_SYSTEM_PROMPT } from './prompts';

type InstructionType = 'html' | 'markdown' | 'plain-text';

export type InstructionsSetting = {
  title: {
    content: string;
    type: InstructionType;
  };
  details?: {
    content: string;
    type: InstructionType;
  };
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
};

// default values for the data property of settings by name
export const defaultSettingsValues: AllSettingsType = {
  instructions: {
    title: {
      content: '',
      type: 'plain-text',
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
  },
};
