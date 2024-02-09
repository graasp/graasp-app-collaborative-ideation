import { Member } from '@graasp/sdk';

export const MEMBERS: { [key: string]: Member } = {
  ANNA: {
    id: '0f0a2774-a965-4b97-afb4-bccc3796e060',
    name: 'anna',
    email: 'anna@graasp.org',
  },
  BOB: {
    id: '1f0a2774-a965-4b97-afb4-bccc3796e060',
    name: 'bob',
    email: 'bob@graasp.org',
  },
};

export const CURRENT_MEMBER = MEMBERS.ANNA;
