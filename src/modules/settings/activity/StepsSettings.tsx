import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ActivityStep, ActivityType } from '@/interfaces/interactionProcess';
import CodeEditor from '@/modules/common/CodeEditor';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

interface StepsSettingsProps {
  steps: ActivityStep[];
  onChange: (newEvaluationType: ActivityStep[]) => void;
}

const validateSteps = <T,>(
  prompt: string,
  callbacks: {
    onSuccess?: () => void;
    onError?: () => void;
  },
): T | undefined => {
  try {
    const jsonNewChatbotPrompt = JSON.parse(prompt);
    callbacks.onSuccess?.();
    return jsonNewChatbotPrompt;
  } catch {
    callbacks.onError?.();
  }
  return undefined;
};

const StepsSettings: FC<StepsSettingsProps> = ({ steps, onChange }) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'SETTINGS.ACTIVITY.STEPS',
  });
  const [stepsJson, setStepsJson] = useState<string>(
    JSON.stringify(steps) || '[]',
  );
  const [hasFormattingErrors, setHasFormattingErrors] =
    useState<boolean>(false);

  const handleChangeSteps = (newStepsJson: string): void => {
    setStepsJson(newStepsJson);
    const newSteps = validateSteps<ActivityStep[]>(newStepsJson, {
      onSuccess: () => setHasFormattingErrors(false),
      onError: () => setHasFormattingErrors(true),
    });
    if (typeof newSteps !== 'undefined') {
      onChange(newSteps);
    }
  };
  const addStep = (): void => {
    const newSteps = typeof steps === 'undefined' ? [] : steps;
    newSteps.push({
      type: ActivityType.Collection,
      round: 0,
      time: 60,
    });
    onChange(newSteps);
    setStepsJson(JSON.stringify(newSteps));
  };
  return (
    <Stack spacing={1}>
      <CodeEditor
        value={stepsJson}
        onChange={(value: string) => handleChangeSteps(value)}
      />
      {hasFormattingErrors ? (
        <Typography color="error">
          {t('ERROR_PROMPT_NOT_IN_JSON_FORMAT')}
        </Typography>
      ) : null}
      <Button onClick={addStep}>{t('ADD_STEP')}</Button>
    </Stack>
  );
};

export default StepsSettings;
