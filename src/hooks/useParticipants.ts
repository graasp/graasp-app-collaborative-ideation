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
  const { notParticipating, assistants: assistantsSetting } = useSettings();
  const { assistants } = assistantsSetting;
  const rawMembers = useMembersContext();
  const members: Participant<Member>[] = useMemo(
    () =>
      rawMembers
        .filter(({ id }) => !notParticipating.ids.includes(id))
        .map((m) => ({ type: ParticipantType.Member, ...m })),
    [notParticipating, rawMembers],
  );
  const assistantsParticipants: Participant<AssistantPersona>[] = useMemo(
    () => assistants.map((a) => ({ type: ParticipantType.Bot, ...a })),
    [assistants],
  );
  return { members, assistants: assistantsParticipants };
};

export default useParticipants;
