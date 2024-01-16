import { AppSetting } from '@graasp/sdk';

import { MOCK_SERVER_DISCRIMINATED_ITEM } from './mockItem';

export const QUESTION_SETTING: AppSetting = {
  id: '0',
  name: 'question',
  data: {
    label: 'Is the question field working?',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  item: MOCK_SERVER_DISCRIMINATED_ITEM,
};

export const ANSWERS_SETTING = {
  id: '1',
  name: 'answers',
  data: {
    answers: [
      {
        key: 'fine',
        label: "It's working fine",
      },
      {
        key: 'well',
        label: "It's working well",
      },
    ],
    defaultAnswer: [],
    multipleAnswers: false,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  item: MOCK_SERVER_DISCRIMINATED_ITEM,
};

export const ANSWERS_SETTING_MULTI_ANSWERS = {
  ...ANSWERS_SETTING,
  data: {
    ...ANSWERS_SETTING.data,
    multipleAnswers: true,
  },
};
