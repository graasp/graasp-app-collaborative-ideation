import { Member as MemberType } from '@graasp/sdk';

export enum ParticipantType {
  Member = 'member',
  Bot = 'bot',
}

export type Participant<T = MemberType> = T & {
  type: T extends MemberType ? ParticipantType.Member : ParticipantType.Bot;
};
