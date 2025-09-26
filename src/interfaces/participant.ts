import { Member as MemberType } from '@graasp/sdk';

import { Author } from './author';

export enum ParticipantType {
  Account = 'account',
  Bot = 'bot',
}

export type Participant<T = MemberType> = T & {
  memberType: T extends MemberType
    ? ParticipantType.Account
    : ParticipantType.Bot;
};

export const participantToAuthor = (p: Participant): Author => ({
  id: p.id,
  name: p.name,
  email: p.email,
});
