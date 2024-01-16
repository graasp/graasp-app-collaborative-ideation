import { DiscriminatedItem, ItemType } from '@graasp/sdk';

import { MEMBERS } from './members';

export const MOCK_SERVER_ITEM = {
  id: '123456789',
  name: 'app-starter-ts-vite',
  description: null,
  path: '',
  settings: {},
  creator: MEMBERS[0],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const MOCK_SERVER_DISCRIMINATED_ITEM: DiscriminatedItem = {
  ...MOCK_SERVER_ITEM,
  type: ItemType.APP,
  extra: {
    app: {
      url: '',
    },
  },
  createdAt: MOCK_SERVER_ITEM.createdAt.toISOString(),
  updatedAt: MOCK_SERVER_ITEM.updatedAt.toISOString(),
};
