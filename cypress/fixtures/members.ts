import { Member, MemberType } from '@graasp/sdk';

export const MEMBERS: { [key: string]: Member } = {
  ANNA: {
    id: '0f0a2774-a965-4b97-afb4-bccc3796e060',
    name: 'anna',
    type: MemberType.Individual,
    email: 'anna@graasp.org',
    extra: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  BOB: {
    id: '1f0a2774-a965-4b97-afb4-bccc3796e060',
    name: 'bob',
    type: MemberType.Individual,
    email: 'bob@graasp.org',
    extra: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export const CURRENT_MEMBER = MEMBERS.ANNA;
