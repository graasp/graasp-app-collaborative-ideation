import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Input from '@mui/material/Input';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';

import clone from 'lodash.clone';

import { ActivitySetting } from '@/config/appSettingsType';
import {
  ActivityStep,
  ResponseVisibilityMode,
} from '@/interfaces/interactionProcess';
import { useSettings } from '@/modules/context/SettingsContext';

import SettingsSection from '../../common/SettingsSection';
import StepsSettings from './steps/StepsSettings';

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

  const { saveSettings } = useSettings();

  const {
    mode,
    exclusiveResponseDistribution,
    numberOfParticipantsResponsesTriggeringResponsesGeneration,
    reformulateResponses,
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

  const handleReformulateResponsesChange = (newToggle: boolean): void => {
    onChange({
      ...activity,
      reformulateResponses: newToggle,
    });
  };

  const handleNumberOfParticipantsResponsesTriggeringResponsesGenerationChange =
    (newVal: string): void => {
      const newValNbr = parseInt(newVal, 10);
      onChange({
        ...activity,
        numberOfParticipantsResponsesTriggeringResponsesGeneration: newValNbr,
      });
    };

  const handleChangeSteps = (newSteps: ActivityStep[]): void => {
    const newActivity = {
      ...activity,
      steps: clone(newSteps),
    };
    onChange(newActivity);
  };
  return (
    <SettingsSection title={t('TITLE')}>
      <Stack spacing={1} direction="row" justifyContent="space-between">
        <FormControl>
          <FormLabel>{t('MODE_LABEL')}</FormLabel>
          <RadioGroup
            aria-labelledby="ideation-mode-radio-button"
            defaultValue={ResponseVisibilityMode.Sync}
            value={mode}
            name="radio-buttons-group"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleModeChange(
                (event.target as HTMLInputElement)
                  .value as ResponseVisibilityMode,
              );
            }}
          >
            {/* TODO: translate */}
            <FormControlLabel
              value={ResponseVisibilityMode.Sync}
              control={<Radio />}
              label="Synchronous"
            />
            <FormControlLabel
              value={ResponseVisibilityMode.Async}
              control={<Radio />}
              label="Asynchronous"
            />
            <FormControlLabel
              value={ResponseVisibilityMode.Individual}
              control={<Radio />}
              label="Individual"
              disabled
            />
          </RadioGroup>
        </FormControl>
        <Box>
          <FormControl>
            <FormLabel>{t('ADVANCED_CONFIGURATION')}</FormLabel>
            <FormControlLabel
              control={
                <Switch
                  checked={exclusiveResponseDistribution ?? false}
                  onChange={(e) =>
                    handleExclDistributionChange(e.target.checked)
                  }
                />
              }
              label={t('EXCLUSIVE_RESPONSE_DISTRIBUTION_LABEL')}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={reformulateResponses ?? false}
                  onChange={(e) =>
                    handleReformulateResponsesChange(e.target.checked)
                  }
                />
              }
              label={t('REFORMULATE_RESPONSE_LABEL')}
            />
          </FormControl>
          <FormControl>
            <FormControlLabel
              control={
                <Input
                  value={
                    numberOfParticipantsResponsesTriggeringResponsesGeneration
                  }
                  onChange={(e) =>
                    handleNumberOfParticipantsResponsesTriggeringResponsesGenerationChange(
                      e.target.value,
                    )
                  }
                />
              }
              disabled={mode !== ResponseVisibilityMode.Sync}
              labelPlacement="top"
              label={t(
                'NUMBER_OF_PARTICIPANTS_RESPONSES_TRIGGERING_RESPONSES_GENERATION',
              )}
            />
          </FormControl>
        </Box>
      </Stack>
      <StepsSettings
        steps={steps}
        onChange={handleChangeSteps}
        onSave={() => saveSettings('activity', activity)}
      />
    </SettingsSection>
  );
};

export default ActivitySettings;
