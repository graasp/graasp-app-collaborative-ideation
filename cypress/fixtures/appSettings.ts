import { AppSetting } from '@graasp/sdk';

import { AllSettingsType } from '@/config/appSettingsType';
import { EvaluationType } from '@/interfaces/evaluation';
import {
  ActivityType,
  ResponseVisibilityMode,
} from '@/interfaces/interactionProcess';

import { AssistantType } from '@/interfaces/assistant';
import cloneDeep from 'lodash.clonedeep';
import { MEMBERS } from './members';
import { MOCK_SERVER_DISCRIMINATED_ITEM } from './mockItem';


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
    item: MOCK_SERVER_DISCRIMINATED_ITEM,
    data,
    name: settingName,
  };
};

export const ALL_SETTINGS_OBJECT: AllSettingsType = {
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
    id: MEMBERS.ANNA.id,
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

export const ALL_SETTINGS = Object.entries(ALL_SETTINGS_OBJECT).map(
  ([key, value]) => newSettingFactory(key, value),
);

const SETTINGS_WITH_ASSISTANT_OBJECT = cloneDeep(ALL_SETTINGS_OBJECT);

SETTINGS_WITH_ASSISTANT_OBJECT.assistants.assistants = [
  {
    id: 'assistant1',
    name: 'GraaspBot',
    configuration: [
      {
        role: 'system',
        content: 'You are a helpful assistant. You always give your most creative ideas.',
      },
    ],
    type: AssistantType.LLM
  },
];
SETTINGS_WITH_ASSISTANT_OBJECT.activity.steps = [
  {
    type: ActivityType.Collection,
    round: 0,
    time: 1,
  },
  {
    type: ActivityType.Collection,
    round: 1,
    time: 1,
  },
  {
    type: ActivityType.Evaluation,
    round: 2,
    time: 1,
    evaluationType: EvaluationType.Vote,
    evaluationParameters: {
      maxNumberOfVotes: 3,
    },
  },
  {
    type: ActivityType.Results,
    round: 3,
    time: 240,
  },
];

export const SETTINGS_WITH_ASSISTANT = Object.entries(
  SETTINGS_WITH_ASSISTANT_OBJECT,
).map(([key, value]) => newSettingFactory(key, value));

const SETTINGS_WITH_RATINGS_OBJECT = cloneDeep(ALL_SETTINGS_OBJECT);

SETTINGS_WITH_RATINGS_OBJECT.activity.steps = [
  {
    type: ActivityType.Collection,
    round: 0,
    time: 1,
  },
  {
    type: ActivityType.Evaluation,
    round: 1,
    time: 1,
    evaluationType: EvaluationType.Rate,
    evaluationParameters: {
      ratings: [
        {
          name: 'Usefulness',
          description: 'How useful is the response',
          maxLabel: 'Useful',
          minLabel: 'Useless',
          levels: 5,
        },
        {
          name: 'Novelty',
          description: 'How novel is the response',
          maxLabel: 'Novel',
          minLabel: 'Common',
          levels: 5,
        },
      ],
      ratingsName: "Usefulness and novelty",
    },
  },
  {
    type: ActivityType.Results,
    round: 1,
    time: 240,
    resultsType: EvaluationType.Rate,
  },
];

export const SETTINGS_WITH_RATINGS = Object.entries(
  SETTINGS_WITH_RATINGS_OBJECT,
).map(([key, value]) => newSettingFactory(key, value));
