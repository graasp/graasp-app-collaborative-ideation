import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';

import { ActivityStep, ActivityType } from '@/interfaces/activity_state';
import Step from './Step';

interface StepsSettingsProps {
  steps: ActivityStep[];
  onChange: (newEvaluationType: ActivityStep[]) => void;
  onSave: () => void;
}

const StepsSettings: FC<StepsSettingsProps> = ({ steps, onChange, onSave }) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'SETTINGS.ACTIVITY.STEPS',
  });

  const handleChangeStep = (newStep: ActivityStep, position: number): void => {
    const newSteps = steps;
    newSteps[position] = newStep;
    onChange(newSteps);
  };

  const handleDeleteStep = (position: number): void => {
    const newSteps = steps.toSpliced(position, 1);
    onChange(newSteps);
  };

  const addStep = (): void => {
    const newSteps = typeof steps === 'undefined' ? [] : steps;
    newSteps.push({
      type: ActivityType.Collection,
      round: 0,
      time: 60,
    });
    onChange(newSteps);
  };
  return (
    <Grid container spacing={1}>
      {steps.map((step, index) => (
        <Grid size={3} key={index}>
          <Step
            step={step}
            position={index}
            onChange={handleChangeStep}
            onDelete={handleDeleteStep}
            onSave={onSave}
          />
        </Grid>
      ))}
      <Button onClick={addStep}>{t('ADD_STEP')}</Button>
    </Grid>
  );
};

export default StepsSettings;
