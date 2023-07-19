import type { Database, LocalContext } from '@graasp/apps-query-client';
import {
  AppData,
  AppDataVisibility,
  Item,
  ItemSettings,
  Member,
  PermissionLevel,
} from '@graasp/sdk';

import { API_HOST } from '@/config/env';

export const mockContext: LocalContext = {
  apiHost: API_HOST,
  permission: PermissionLevel.Admin,
  context: 'player',
  itemId: '1234-1234-123456-8123-123456',
  memberId: 'mock-member-id',
};

export const mockMembers: Member[] = [
  {
    id: mockContext.memberId || '',
    name: 'current-member',
    email: '',
    extra: {},
    type: 'individual',
    createdAt: new Date('1996-09-08T19:00:00'),
    updatedAt: new Date(),
  },
  {
    id: 'mock-member-id-2',
    name: 'mock-member-2',
    email: '',
    extra: {},
    type: 'individual',
    createdAt: new Date('1995-02-02T15:00:00'),
    updatedAt: new Date(),
  },
];

const mockItem: Item<ItemSettings> = {
  id: mockContext.itemId,
  name: 'app-brainwriting',
  description: null,
  path: '',
  settings: {},
  creator: mockMembers[0],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockAppData: AppData[] = [
  {
    id: '0',
    item: mockItem,
    creator: mockMembers[0],
    type: 'idea',
    member: mockMembers[0],
    visibility: AppDataVisibility.Member,
    createdAt: new Date(),
    updatedAt: new Date(),
    data: {
      idea: 'A giant spaceship.',
      round: 0,
    },
  },
  {
    id: '1',
    item: mockItem,
    creator: mockMembers[0],
    type: 'idea',
    member: mockMembers[0],
    visibility: AppDataVisibility.Member,
    createdAt: new Date(),
    updatedAt: new Date(),
    data: {
      idea: 'A small spaceship.',
      round: 0,
    },
  },
  {
    id: '2',
    item: mockItem,
    creator: mockMembers[0],
    type: 'idea',
    member: mockMembers[0],
    visibility: AppDataVisibility.Member,
    createdAt: new Date(),
    updatedAt: new Date(),
    data: {
      idea: 'Drilling into the Earth.',
      round: 0,
    },
  },
  {
    id: '3',
    item: mockItem,
    creator: mockMembers[0],
    type: 'idea-set',
    member: mockMembers[0],
    visibility: AppDataVisibility.Member,
    createdAt: new Date(),
    updatedAt: new Date(),
    data: {
      ideas: [
        { id: '0', idea: 'A', round: 0 },
        { id: '1', idea: 'B', round: 0 },
        { id: '2', idea: 'C', round: 0 },
      ],
      round: 1,
    },
  },
];

const buildDatabase = (
  appContext: Partial<LocalContext>,
  members?: Member[],
): Database => ({
  appData: mockAppData,
  appActions: [],
  members: members ?? mockMembers,
  appSettings: [],
  items: [mockItem],
});

export default buildDatabase;
