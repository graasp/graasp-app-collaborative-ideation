import type { Database } from '@graasp/apps-query-client';
import {
  AppData,
  CompleteMember,
  Context,
  LocalContext,
  PermissionLevel,
} from '@graasp/sdk';

import { API_HOST } from '@/config/env';

import { mockItem } from './mockItem';
import { mockMembers } from './mockMembers';
import { buildMockResponses } from './mockResponses';
import { mockSettings } from './mockSettings';

const mockResponses = buildMockResponses(mockItem, mockMembers);

const mockAppData: AppData[] = [...mockResponses];

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
  appSettings: [...mockSettings],
  items: [mockItem],
  uploadedFiles: [],
});

export default buildDatabase;
