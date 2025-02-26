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
      id: 'data-000',
      author: mockMembers[0],
      response: 'A giant spaceship.',
      round: 0,
    },
  },
  // Member 0, response 1, round 0
  {
    id: '010',
    item: mockItem,
    creator: mockMembers[1],
    type: AppDataTypes.Response,
    account: mockMembers[1],
    visibility: AppDataVisibility.Item,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: {
      id: 'data-010',
      author: mockMembers[0],
      response: 'A small spaceship.',
      round: 0,
    },
  },
  // Member 0, response 2, round 0
  {
    id: '020',
    item: mockItem,
    creator: mockMembers[1],
    type: AppDataTypes.Response,
    account: mockMembers[1],
    visibility: AppDataVisibility.Item,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: {
      id: 'data-020',
      author: mockMembers[0],
      response: 'Drilling into the Earth.',
      round: 0,
    },
  },
  // Member 0, response 0, round 1
  {
    id: '001',
    item: mockItem,
    creator: mockMembers[1],
    type: AppDataTypes.Response,
    account: mockMembers[1],
    visibility: AppDataVisibility.Item,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: {
      id: 'data-001',
      author: mockMembers[0],
      response: 'Covering the sun',
      round: 1,
    },
  },
  // Member 0, response 1, round 1
  {
    data: {
      id: 'data-011',
      author: mockMembers[0],
      response: 'Involving alien species in brainstormings',
      round: 1,
    },
    account: mockMembers[0],
    visibility: AppDataVisibility.Item,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    id: '150',
    item: mockItem,
    creator: mockMembers[1],
    type: AppDataTypes.Response,
  },
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
      id: 'data-110',
      author: mockMembers[1],
      response: 'Reinforcing education in rural areas.',
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
      id: 'data-120',
      author: mockMembers[1],
      response: 'Shielding buildings agains radiations.',
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
      id: 'data-101',
      author: mockMembers[1],
      response: 'Sending help message across the universe.',
      round: 1,
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
      id: 'data-111',
      author: mockMembers[1],
      response: 'Removing unnecessary lights in public spaces.',
      round: 1,
    },
  },
  // Member 1, response 1, round 1
  {
    id: '111',
    data: {
      id: 'data-121',
      author: mockMembers[0],
      response: 'Stop Making Sense',
      round: 1,
    },
    item: mockItem,
    creator: mockMembers[1],
    type: AppDataTypes.Response,
    account: mockMembers[1],
    visibility: AppDataVisibility.Item,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const buildMockBotResponses = (
  mockItem: DiscriminatedItem,
  mockMembers: Member[],
): ResponseAppData[] => [
  {
    id: '000-bot',
    item: mockItem,
    creator: mockMembers[0],
    type: AppDataTypes.Response,
    account: mockMembers[0],
    visibility: AppDataVisibility.Item,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: {
      id: 'data-000-bot',
      author: mockMembers[0],
      response: 'A giant robots factory.',
      round: 0,
      bot: true,
      assistantId: 'assistant-1',
    },
  },
  {
    id: '001-bot',
    item: mockItem,
    creator: mockMembers[0],
    type: AppDataTypes.Response,
    account: mockMembers[0],
    visibility: AppDataVisibility.Item,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: {
      id: 'data-001-bot',
      author: mockMembers[0],
      response: 'Downloading human consciousness into robotic bodies.',
      round: 0,
      bot: true,
      assistantId: 'assistant-1',
    },
  },
];

export { buildMockResponses, buildMockBotResponses };
