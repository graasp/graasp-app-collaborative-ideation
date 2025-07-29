import { AppItemFactory, ItemType, DiscriminatedItem } from '@graasp/sdk';

import { PORT } from '@/config/env';

import { mockMembers } from './mockMembers';


export const mockItem: DiscriminatedItem = AppItemFactory({
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
