import { useMemo } from 'react';

import { Member } from '@graasp/sdk';

import { AssistantPersona } from '@/interfaces/assistant';
import { Participant, ParticipantType } from '@/interfaces/participant';
import { useMembersContext } from '@/modules/context/MembersContext';
import { useSettings } from '@/modules/context/SettingsContext';

export type UseParticipantsValue = {
  members: Array<Participant<Member>>;
  assistants: Array<Participant<AssistantPersona>>;
};

const useParticipants = (): UseParticipantsValue => {
  const { notParticipating, assistant } = useSettings();
  const { personas } = assistant;
  const rawMembers = useMembersContext();
  const members: Participant<Member>[] = useMemo(
    () =>
      rawMembers
        .filter(({ id }) => !notParticipating.ids.includes(id))
        .map((m) => ({ type: ParticipantType.Member, ...m })),
    [notParticipating, rawMembers],
  );
  const assistants: Participant<AssistantPersona>[] = useMemo(
    () => personas.map((a) => ({ type: ParticipantType.Bot, ...a })),
    [personas],
  );
  return { members, assistants };
};

export default useParticipants;
