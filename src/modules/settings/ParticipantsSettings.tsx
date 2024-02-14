import { FC, SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';

import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';

import { Member } from '@graasp/sdk';

import { NotParticipatingSetting } from '@/config/appSettingsType';

import SettingsSection from '../common/SettingsSection';
import { useMembersContext } from '../context/MembersContext';

interface ParticipantsSettingsProps {
  notParticipating: NotParticipatingSetting;
  onChange: (newNotParticipating: NotParticipatingSetting) => void;
}

const ParticipantsSettings: FC<ParticipantsSettingsProps> = ({
  notParticipating,
  onChange,
}) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'SETTINGS.PARTICIPANTS',
  });

  const members = useMembersContext();

  const handleChange = (
    _e: SyntheticEvent<Element, Event>,
    value: Member[],
  ): void => {
    onChange({ ids: value.map(({ id }) => id) });
  };

  return (
    <SettingsSection title={t('TITLE')}>
      <Autocomplete
        multiple
        fullWidth
        options={members}
        getOptionLabel={(option) => option.name}
        filterSelectedOptions
        disableCloseOnSelect
        renderOption={(props, option: Member, { selected }) => (
          <li {...props}>
            <Checkbox style={{ marginRight: 8 }} checked={selected} />
            {option.name}
          </li>
        )}
        renderInput={(params) => (
          <TextField variant="standard" {...params} label={t('FIELD_LABEL')} />
        )}
        value={members.filter(({ id }) => notParticipating.ids.includes(id))}
        onChange={handleChange}
        isOptionEqualToValue={(a, b) => a.id === b.id}
      />
    </SettingsSection>
  );
};

export default ParticipantsSettings;
