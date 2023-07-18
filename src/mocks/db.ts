import type { Database, LocalContext } from '@graasp/apps-query-client';
import { Member, PermissionLevel } from '@graasp/sdk';

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

const buildDatabase = (
  appContext: Partial<LocalContext>,
  members?: Member[],
): Database => ({
  appData: [],
  appActions: [],
  members: members ?? mockMembers,
  appSettings: [],
  items: [
    {
      id: mockContext.itemId,
      name: 'app-starter-ts-vite',
      description: null,
      path: '',
      settings: {},
      creator: mockMembers[0],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
});

export default buildDatabase;
