import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Stack from '@mui/material/Stack';

import { PromptsSetting } from '@/config/appSettingsType';

import whatIfs from '@/config/what-ifs.json';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import SettingsSection from '../../common/SettingsSection';

const { sets } = whatIfs;

interface PromptsSettingsProps {
  prompts: PromptsSetting;
  onChange: (newPrompts: PromptsSetting) => void;
}

const PromptsSettings: FC<PromptsSettingsProps> = ({ prompts, onChange }) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'SETTINGS.PROMPTS',
  });

  const { selectedSet } = prompts;

  return (
    <SettingsSection title={t('TITLE')}>
      <Stack spacing={1} direction="row" justifyContent="space-between">
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={selectedSet}
          onChange={(_e, id) => onChange({ ...prompts, selectedSet: id })}
        >
          <FormControlLabel
            value=""
            control={<Radio />}
            label={t('NO_SET_SELECTED')}
          />
          {sets.map((set, index) => (
            <FormControlLabel
              key={index}
              value={set.id}
              control={<Radio />}
              label={set.name}
            />
          ))}
        </RadioGroup>
      </Stack>
    </SettingsSection>
  );
};

export default PromptsSettings;
