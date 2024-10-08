import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Input from '@mui/material/Input';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';

import { PromptsSetting } from '@/config/appSettingsType';
import whatIfs from '@/config/what-ifs.json';

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

  const [maxQueriesNaNError, setMaxQueriesNaNError] = useState(false);

  const { selectedSet, maxNumberOfQueries } = prompts;

  const handleMaxQueriesChange = (newVal: string): void => {
    const newValNbr = newVal.length === 0 ? 0 : parseInt(newVal, 10);
    if (Number.isNaN(newValNbr)) {
      setMaxQueriesNaNError(true);
    } else {
      setMaxQueriesNaNError(false);
      onChange({ ...prompts, maxNumberOfQueries: newValNbr });
    }
  };

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
        <FormControl error={maxQueriesNaNError}>
          <FormControlLabel
            control={
              <Input
                value={maxNumberOfQueries}
                onChange={(e) => handleMaxQueriesChange(e.target.value)}
              />
            }
            labelPlacement="top"
            label={t('MAX_QUERIES_LABEL')}
          />
        </FormControl>
      </Stack>
    </SettingsSection>
  );
};

export default PromptsSettings;
