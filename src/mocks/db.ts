import type { Database, LocalContext } from '@graasp/apps-query-client';
import {
  AppData,
  AppDataVisibility,
  CompleteMember,
  Context,
  DiscriminatedItem,
  ItemSettings,
  ItemType,
  PermissionLevel,
} from '@graasp/sdk';

import { API_HOST, PORT } from '@/config/env';

import { buildMockResponses } from './mockResponses';

export const mockMembers: CompleteMember[] = [
  {
    id: 'mock-member-id-1',
    name: 'I (current member)',
    email: 'i@graasp.org',
    extra: {},
    type: 'individual',
    createdAt: new Date('1996-09-08T19:00:00').toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'mock-member-id-2',
    name: 'You',
    email: 'you@graasp.org',
    extra: {},
    type: 'individual',
    createdAt: new Date('1995-02-02T15:00:00').toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const mockItem: DiscriminatedItem<ItemSettings> = {
  id: '1234-1234-1234-5678',
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

const mockResponses = buildMockResponses(mockItem, mockMembers);

const mockAppData: AppData[] = [
  ...mockResponses,
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

export const defaultMockContext: LocalContext = {
  apiHost: API_HOST,
  permission: PermissionLevel.Admin,
  context: Context.Builder,
  itemId: mockItem.id,
  memberId: mockMembers[0].id,
};

const buildDatabase = (members?: CompleteMember[]): Database => ({
  appData: mockAppData,
  appActions: [],
  members: members ?? mockMembers,
  appSettings: [],
  items: [mockItem],
});

export default buildDatabase;
