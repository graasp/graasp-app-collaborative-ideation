import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Input from '@mui/material/Input';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';

import { ActivitySetting } from '@/config/appSettingsType';
import { EvaluationType } from '@/interfaces/evaluationType';
import {
  ActivityStep,
  ResponseVisibilityMode,
} from '@/interfaces/interactionProcess';

import SettingsSection from '../../common/SettingsSection';
import EvaluationTypeSelection from './EvaluationTypeSelection';
import StepsSettings from './StepsSettings';

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

  const {
    mode,
    evaluationType,
    exclusiveResponseDistribution,
    numberOfBotResponsesPerSet,
    numberOfResponsesPerSet,
    steps,
  } = activity;

  const handleModeChange = (newMode: ResponseVisibilityMode): void => {
    onChange({
      ...activity,
      mode: newMode,
    });
  };

  const handleExclDistributionChange = (newToggle: boolean): void => {
    onChange({
      ...activity,
      exclusiveResponseDistribution: newToggle,
    });
  };

  const handleNbrRespSetChange = (newVal: string): void => {
    const newValNbr = parseInt(newVal, 10);
    onChange({
      ...activity,
      numberOfResponsesPerSet: newValNbr,
    });
  };

  const handleNbrBotRespSetChange = (newVal: string): void => {
    const newValNbr = parseInt(newVal, 10);
    onChange({
      ...activity,
      numberOfBotResponsesPerSet: newValNbr,
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

  const handleChangeSteps = (newSteps: ActivityStep[]): void => {
    onChange({
      ...activity,
      steps: newSteps,
    });
  };
  return (
    <SettingsSection title={t('TITLE')}>
      <Stack spacing={1} direction="row" justifyContent="space-between">
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
        <FormControl>
          <FormLabel>{t('ADVANCED_CONFIGURATION')}</FormLabel>
          <FormControlLabel
            control={
              <Switch
                value={exclusiveResponseDistribution}
                onChange={(e) => handleExclDistributionChange(e.target.checked)}
              />
            }
            label={t('EXCLUSIVE_RESPONSE_DISTRIBUTION_LABEL')}
          />
          <FormControlLabel
            control={
              <Input
                value={numberOfResponsesPerSet}
                onChange={(e) => handleNbrRespSetChange(e.target.value)}
              />
            }
            labelPlacement="top"
            label={t('NUMBER_RESP_SET_LABEL')}
          />
          <FormControlLabel
            control={
              <Input
                value={numberOfBotResponsesPerSet}
                onChange={(e) => handleNbrBotRespSetChange(e.target.value)}
              />
            }
            labelPlacement="top"
            label={t('NUMBER_BOT_RESP_SET_LABEL')}
          />
        </FormControl>
      </Stack>
      <EvaluationTypeSelection
        evaluationType={evaluationType}
        onChange={handleEvaluationTypeChange}
      />
      <StepsSettings steps={steps} onChange={handleChangeSteps} />
    </SettingsSection>
  );
};

export default ActivitySettings;
