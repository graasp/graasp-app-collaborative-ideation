import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ActivityStep, ActivityType } from '@/interfaces/interactionProcess';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Step from './Step';

interface StepsSettingsProps {
  steps: ActivityStep[];
  onChange: (newEvaluationType: ActivityStep[]) => void;
}

// const validateSteps = <T,>(
//   prompt: string,
//   callbacks: {
//     onSuccess?: () => void;
//     onError?: () => void;
//   },
// ): T | undefined => {
//   try {
//     const jsonNewChatbotPrompt = JSON.parse(prompt);
//     callbacks.onSuccess?.();
//     return jsonNewChatbotPrompt;
//   } catch {
//     callbacks.onError?.();
//   }
//   return undefined;
// };

const StepsSettings: FC<StepsSettingsProps> = ({ steps, onChange }) => {
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
        <Grid item xs={3} key={index}>
          <Step
            step={step}
            position={index}
            onChange={handleChangeStep}
            onDelete={handleDeleteStep}
          />
        </Grid>
      ))}
      <Button onClick={addStep}>{t('ADD_STEP')}</Button>
    </Grid>
  );
};

export default StepsSettings;
