import { useMemo } from 'react';

import { Member } from '@graasp/sdk';

import {
  AssistantConfiguration,
  AssistantPersona,
} from '@/interfaces/assistant';
import { Participant, ParticipantType } from '@/interfaces/participant';
import { useMembersContext } from '@/modules/context/MembersContext';
import { useSettings } from '@/modules/context/SettingsContext';

export type UseParticipantsValue = {
  members: Array<Participant<Member>>;
  assistants: Array<Participant<AssistantPersona<AssistantConfiguration>>>;
};

const useParticipants = (): UseParticipantsValue => {
  const { notParticipating, assistants: assistantsSetting } = useSettings();
  const { assistants } = assistantsSetting;
  const rawMembers = useMembersContext();
  const members: Participant<Member>[] = useMemo(
    () =>
      rawMembers
        .filter(({ id }) => !notParticipating.ids.includes(id))
        .map((m) => ({ memberType: ParticipantType.Account, ...m })),
    [notParticipating, rawMembers],
  );
  const assistantsParticipants: Participant<
    AssistantPersona<AssistantConfiguration>
  >[] = useMemo(
    () =>
      assistants.map((a) => ({
        ...a,
        memberType: ParticipantType.Bot,
      })),
    [assistants],
  );
  return { members, assistants: assistantsParticipants };
};

export default useParticipants;
