import { AppDataVisibility, DiscriminatedItem, Member } from '@graasp/sdk';

import { AppDataTypes, ResponseAppData } from '@/config/appDataTypes';

const buildMockResponses = (
  mockItem: DiscriminatedItem,
  mockMembers: Member[],
): ResponseAppData[] => [
  // Member 0, response 0, round 0
  {
    id: '000',
    item: mockItem,
    creator: mockMembers[0],
    type: AppDataTypes.Response,
    account: mockMembers[0],
    visibility: AppDataVisibility.Item,
    createdAt: new Date().toDateString(),
    updatedAt: new Date().toISOString(),
    data: {
      response: 'A giant spaceship.',
      round: 0,
    },
  },
  // Member 0, response 1, round 0
  {
    id: '010',
    item: mockItem,
    creator: mockMembers[0],
    type: AppDataTypes.Response,
    account: mockMembers[0],
    visibility: AppDataVisibility.Item,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: {
      response: 'A small spaceship.',
      round: 0,
    },
  },
  // Member 0, response 2, round 0
  {
    id: '020',
    item: mockItem,
    creator: mockMembers[0],
    type: AppDataTypes.Response,
    account: mockMembers[0],
    visibility: AppDataVisibility.Item,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: {
      response: 'Drilling into the Earth.',
      round: 0,
    },
  },
  // Member 0, response 0, round 1
  {
    id: '001',
    item: mockItem,
    creator: mockMembers[0],
    type: AppDataTypes.Response,
    account: mockMembers[0],
    visibility: AppDataVisibility.Item,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: {
      response: 'Covering the sun',
      round: 1,
    },
  },
  // Member 0, response 1, round 1
  {
    id: '011',
    item: mockItem,
    creator: mockMembers[0],
    type: AppDataTypes.Response,
    account: mockMembers[0],
    visibility: AppDataVisibility.Item,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: {
      response: 'Involving alien species in brainstormings',
      round: 1,
    },
  },
  // Member 0, response 2, round 1
  {
    id: '021',
    item: mockItem,
    creator: mockMembers[0],
    type: AppDataTypes.Response,
    account: mockMembers[0],
    visibility: AppDataVisibility.Item,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: {
      response: 'Drilling into the Earth.',
      round: 1,
    },
  },
  // Member 1, response 0, round 0
  {
    id: '100',
    item: mockItem,
    creator: mockMembers[1],
    type: AppDataTypes.Response,
    account: mockMembers[1],
    visibility: AppDataVisibility.Item,
    createdAt: new Date().toDateString(),
    updatedAt: new Date().toISOString(),
    data: {
      response: 'Putting trees everywhere',
      round: 0,
    },
  },
  // Member 1, response 1, round 0
  {
    id: '110',
    item: mockItem,
    creator: mockMembers[1],
    type: AppDataTypes.Response,
    account: mockMembers[1],
    visibility: AppDataVisibility.Item,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: {
      response: 'Reinforcing education in rural areas.',
      round: 0,
    },
  },
  // Member 1, response 2, round 0
  {
    id: '120',
    item: mockItem,
    creator: mockMembers[1],
    type: AppDataTypes.Response,
    account: mockMembers[1],
    visibility: AppDataVisibility.Item,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: {
      response: 'Shielding buildings agains radiations.',
      round: 0,
    },
  },
  // Member 1, response 0, round 1
  {
    id: '101',
    item: mockItem,
    creator: mockMembers[1],
    type: AppDataTypes.Response,
    account: mockMembers[1],
    visibility: AppDataVisibility.Item,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: {
      response: 'Sending help message across the universe.',
      round: 1,
    },
  },
  // Member 1, response 1, round 1
  {
    id: '111',
    item: mockItem,
    creator: mockMembers[1],
    type: AppDataTypes.Response,
    account: mockMembers[1],
    visibility: AppDataVisibility.Item,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: {
      response: 'Removing unnecessary lights in public spaces.',
      round: 1,
    },
  },
  // Member 1, response 2, round 1
  {
    id: '121',
    item: mockItem,
    creator: mockMembers[0],
    type: AppDataTypes.Response,
    account: mockMembers[0],
    visibility: AppDataVisibility.Item,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: {
      response: 'Stop Making Sense',
      round: 1,
    },
  },
];

export { buildMockResponses };
