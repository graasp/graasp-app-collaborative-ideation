import type { Database } from '@graasp/apps-query-client';
import {
  AccountType,
  AppData,
  AppDataVisibility,
  AppItemFactory,
  CompleteMember,
  Context,
  ItemType,
  LocalContext,
  MemberFactory,
  PermissionLevel,
} from '@graasp/sdk';

import { AppDataTypes } from '@/config/appDataTypes';
import { API_HOST, PORT } from '@/config/env';

import { buildMockResponses } from './mockResponses';

export const mockMembers: CompleteMember[] = [
  MemberFactory({
    id: 'mock-account-id-1',
    name: 'I (current account)',
    email: 'i@graasp.org',
    type: AccountType.Individual,
    createdAt: new Date('1996-09-08T19:00:00').toISOString(),
    updatedAt: new Date().toISOString(),
    enableSaveActions: true,
  }),
  MemberFactory({
    id: 'mock-account-id-2',
    name: 'You',
    email: 'you@graasp.org',
    type: AccountType.Individual,
    createdAt: new Date('1995-02-02T15:00:00').toISOString(),
    updatedAt: new Date().toISOString(),
    enableSaveActions: true,
  }),
];

export const mockItem = AppItemFactory({
  id: '1234-1234-1234-5678',
  name: 'app-collaborative-ideation',
  description: null,
  path: '',
  type: ItemType.APP,
  settings: {},
  creator: mockMembers[0],
  lang: 'en',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  extra: {
    app: {
      url: `http://localhost:${PORT}`,
    },
  },
});

const mockResponses = buildMockResponses(mockItem, mockMembers);

const mockAppData: AppData[] = [
  ...mockResponses,
  {
    id: '3',
    item: mockItem,
    creator: mockMembers[0],
    type: AppDataTypes.ResponsesSet,
    account: mockMembers[0],
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
  accountId: mockMembers[0].id,
};

const buildDatabase = (members?: CompleteMember[]): Database => ({
  appData: mockAppData,
  appActions: [],
  members: members ?? mockMembers,
  appSettings: [],
  items: [mockItem],
  uploadedFiles: [],
});

export default buildDatabase;
