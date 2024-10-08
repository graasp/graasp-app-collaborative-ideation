import { Member as MemberType } from '@graasp/sdk';

export enum ParticipantType {
  Account = 'account',
  Bot = 'bot',
}

export type Participant<T = MemberType> = T & {
  memberType: T extends MemberType
    ? ParticipantType.Account
    : ParticipantType.Bot;
};
