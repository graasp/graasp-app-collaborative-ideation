import { useMemo } from 'react';

import { Member } from '@graasp/sdk';

import {
  AssistantConfiguration,
  AssistantPersona,
} from '@/interfaces/assistant';
import { Participant, ParticipantType } from '@/interfaces/participant';
import { useMembersContext } from '@/modules/context/MembersContext';
import { useSettings } from '@/modules/context/SettingsContext';
import { useLocalContext } from '@graasp/apps-query-client';

export type UseParticipantsValue = {
  members: Array<Participant<Member>>;
  assistants: Array<Participant<AssistantPersona<AssistantConfiguration>>>;
  me: Participant<Member>;
};

const useParticipants = (): UseParticipantsValue => {
  const { notParticipating, assistants: assistantsSetting } = useSettings();
  const { assistants } = assistantsSetting;
  const rawMembers = useMembersContext();
  const { accountId } = useLocalContext();
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

  const me: Participant<Member> = useMemo(() => {
    const myself = members.find((m) => m.id === accountId);
    if (myself) {
      return myself;
    }
    return {
      memberType: ParticipantType.Account,
      id: accountId ?? '',
      name: "anonymous",
      email: "anonymous@graasp.org",
    }
   }, [accountId, members]);
  return { members, assistants: assistantsParticipants, me };
};

export default useParticipants;
