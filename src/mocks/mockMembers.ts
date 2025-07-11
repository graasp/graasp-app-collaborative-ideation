import { AccountType, CompleteMember, MemberFactory } from '@graasp/sdk';

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
