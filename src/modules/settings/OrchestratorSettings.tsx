import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Autocomplete from '@mui/material/Autocomplete';
import FormGroup from '@mui/material/FormGroup';
import TextField from '@mui/material/TextField';

import { OrchestratorSetting } from '@/config/appSettingsType';

import SettingsSection from '../common/SettingsSection';
import { useMembersContext } from '../context/MembersContext';

interface OrchestratorSettingsProps {
  orchestrator: OrchestratorSetting;
  onChange: (instuctions: OrchestratorSetting) => void;
}

const OrchestratorSettings: FC<OrchestratorSettingsProps> = ({
  orchestrator,
  onChange,
}) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'SETTINGS.ORCHESTRATOR',
  });

  const members = useMembersContext();
  const { id: orchestratorId } = orchestrator;
  const handleIdChange = (newId: string): void => {
    onChange({
      id: newId,
    });
  };
  return (
    <SettingsSection title={t('TITLE')}>
      <FormGroup>
        <Autocomplete
          options={members.map((member) => member.id)}
          getOptionLabel={(option) =>
            members.find(({ id }) => id === option)?.name || ''
          }
          value={orchestratorId}
          renderInput={(params) => (
            <TextField {...params} variant="standard" label={t('LABEL')} />
          )}
          onChange={(_e, value) => handleIdChange(value || '')}
        />
      </FormGroup>
    </SettingsSection>
  );
};

export default OrchestratorSettings;
