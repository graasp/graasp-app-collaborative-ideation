import type { Database, LocalContext } from '@graasp/apps-query-client';
import {
  AppData,
  AppDataVisibility,
  CompleteMember,
  DiscriminatedItem,
  ItemSettings,
  ItemType,
  PermissionLevel,
} from '@graasp/sdk';

import { API_HOST, PORT } from '@/config/env';

export const defaultMockContext: LocalContext = {
  apiHost: API_HOST,
  permission: PermissionLevel.Admin,
  context: 'builder',
  itemId: '1234-1234-123456-8123-123456',
  memberId: 'mock-member-id',
};

export const mockMembers: CompleteMember[] = [
  {
    id: defaultMockContext.memberId || '',
    name: 'current-member',
    email: '',
    extra: {},
    type: 'individual',
    createdAt: new Date('1996-09-08T19:00:00').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-member-id-2',
    name: 'mock-member-2',
    email: '',
    extra: {},
    type: 'individual',
    createdAt: new Date('1995-02-02T15:00:00').toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockItem: DiscriminatedItem<ItemSettings> = {
  id: defaultMockContext.itemId,
  name: 'app-brainwriting',
  description: null,
  path: '',
  type: ItemType.APP,
  settings: {},
  creator: mockMembers[0],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  extra: {
    app: {
      url: `http://localhost:${PORT}`,
    },
  },
};

const mockAppData: AppData[] = [
  {
    id: '0',
    item: mockItem,
    creator: mockMembers[0],
    type: 'idea',
    member: mockMembers[0],
    visibility: AppDataVisibility.Member,
    createdAt: new Date().toDateString(),
    updatedAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: {
      ideas: ['0', '1', '2'],
      round: 1,
    },
  },
];

const buildDatabase = (
  appContext: Partial<LocalContext>,
  members?: CompleteMember[],
): Database => ({
  appData: mockAppData,
  appActions: [],
  members: members ?? mockMembers,
  appSettings: [],
  items: [mockItem],
});

export default buildDatabase;
