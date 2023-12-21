import { useMemo } from 'react';

import { Member } from '@graasp/sdk';

import { useMembersContext } from '@/modules/context/MembersContext';
import { useSettings } from '@/modules/context/SettingsContext';

type UseParticipantsValue = Member[];

const useParticipants = (): UseParticipantsValue => {
  const { notParticipating } = useSettings();
  const members = useMembersContext();
  const participants = useMemo(
    () => members.filter(({ id }) => !notParticipating.ids.includes(id)),
    [notParticipating, members],
  );
  return participants;
};

export default useParticipants;
