import { AppSetting } from '@graasp/sdk';

import { AllSettingsType } from '@/config/appSettingsType';
import {
  ActivityType,
  ResponseVisibilityMode,
} from '@/interfaces/interactionProcess';

import { mockItem } from './mockItem';
import { mockMembers } from './mockMembers';

let settingCounter = 0;

const newSettingFactory = (
  settingName: string,
  data: AppSetting['data'],
): AppSetting => {
  const id = settingCounter.toString();
  settingCounter += 1;
  return {
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    item: mockItem,
    data,
    name: settingName,
  };
};

const ALL_SETTINGS_OBJECT: AllSettingsType = {
  instructions: {
    title: {
      content: 'What are your big ideas today?',
      format: 'plain-text',
    },
    details: {
      content:
        "Don't limitate yourself and express any idea that you may have.",
      format: 'plain-text',
    },
    collection: {
      choose: {
        content: 'Choose an idea to build upon',
        format: 'plain-text',
      },
      input: {
        content: 'Submit your great idea',
        format: 'plain-text',
      },
    },
    evaluation: {
      content: 'Evaluate the responses.',
      format: 'plain-text',
    },
  },
  orchestrator: {
    id: mockMembers[0].id,
  },
  activity: {
    mode: ResponseVisibilityMode.Open,
    numberOfResponsesPerSet: 3,
    numberOfBotResponsesPerSet: 1,
    exclusiveResponseDistribution: true,
    steps: [
      {
        type: ActivityType.Collection,
        round: 0,
        time: 60,
      },
      {
        type: ActivityType.Collection,
        round: 1,
        time: 60,
      },
      {
        type: ActivityType.Evaluation,
        round: 2,
        time: 120,
      },
    ],
    reformulateResponses: false,
    numberOfParticipantsResponsesTriggeringResponsesGeneration: 0,
  },
  notParticipating: { ids: [] },
  assistants: {
    assistants: [],
  },
  prompts: {
    selectedSet: 'test',
    maxNumberOfQueries: 5,
  },
};

export const mockSettings = Object.entries(ALL_SETTINGS_OBJECT).map(
  ([key, value]) => newSettingFactory(key, value),
);
