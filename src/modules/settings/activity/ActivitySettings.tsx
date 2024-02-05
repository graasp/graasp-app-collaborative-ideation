import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

import { ActivitySetting } from '@/config/appSettingsType';
import { EvaluationType } from '@/interfaces/evaluationType';
import { ResponseVisibilityMode } from '@/interfaces/interactionProcess';

import SettingsSection from '../../common/SettingsSection';
import EvaluationTypeSelection from './EvaluationTypeSelection';

interface ActivitySettingsProps {
  activity: ActivitySetting;
  onChange: (activity: ActivitySetting) => void;
}

const ActivitySettings: FC<ActivitySettingsProps> = ({
  activity,
  onChange,
}) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'SETTINGS.ACTIVITY',
  });

  const { mode, evaluationType } = activity;

  const handleModeChange = (newMode: ResponseVisibilityMode): void => {
    onChange({
      ...activity,
      mode: newMode,
    });
  };

  const handleEvaluationTypeChange = (
    newEvaluationType: EvaluationType,
  ): void => {
    onChange({
      ...activity,
      evaluationType: newEvaluationType,
    });
  };
  return (
    <SettingsSection title={t('TITLE')}>
      <FormControl>
        <FormLabel>{t('MODE_LABEL')}</FormLabel>
        <RadioGroup
          aria-labelledby="ideation-mode-radio-button"
          defaultValue={ResponseVisibilityMode.Open}
          value={mode}
          name="radio-buttons-group"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            handleModeChange(
              (event.target as HTMLInputElement)
                .value as ResponseVisibilityMode,
            );
          }}
        >
          <FormControlLabel
            value={ResponseVisibilityMode.Open}
            control={<Radio />}
            label="Open (brainstorming)"
          />
          <FormControlLabel
            value={ResponseVisibilityMode.PartiallyBlind}
            control={<Radio />}
            label="Partially blind (brainwriting)"
          />
          <FormControlLabel
            value={ResponseVisibilityMode.FullyBlind}
            control={<Radio />}
            label="Fully blind (individual ideation)"
            disabled
          />
        </RadioGroup>
      </FormControl>
      <EvaluationTypeSelection
        evaluationType={evaluationType}
        onChange={handleEvaluationTypeChange}
      />
    </SettingsSection>
  );
};

export default ActivitySettings;
