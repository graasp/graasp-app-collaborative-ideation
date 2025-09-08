import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import TextField from '@mui/material/TextField';

import { FeedbackSettings } from '@/config/appSettingsType';

import SettingsSection from '../common/SettingsSection';

interface FeedbackPromptsSettingsProps {
  feedback: FeedbackSettings;
  onChange: (newFeedbackSettings: FeedbackSettings) => void;
}

const FeedbackPromptsSettings: FC<FeedbackPromptsSettingsProps> = ({
  feedback,
  onChange,
}) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'SETTINGS.FEEDBACK_PROMPTS',
  });
  const { systemPrompt, userPrompt } = feedback;
  const handleSystemPromptChange = (newSystemPrompt: string): void => {
    onChange({
      ...feedback,
      systemPrompt: newSystemPrompt,
    });
  };
  const handleUserPromptChange = (newUserPrompt: string): void => {
    onChange({
      ...feedback,
      userPrompt: newUserPrompt,
    });
  };

  return (
    <SettingsSection title={t('TITLE')}>
      <TextField
        value={systemPrompt}
        onChange={(e) => handleSystemPromptChange(e.target.value)}
        helperText={t('HELPER_SYSTEM_PROMPT')}
        multiline
        label={t('LABEL_SYSTEM_PROMPT')}
      />
      <TextField
        value={userPrompt}
        onChange={(e) => handleUserPromptChange(e.target.value)}
        helperText={t('HELPER_USER_PROMPT')}
        multiline
        label={t('LABEL_USER_PROMPT')}
      />
    </SettingsSection>
  );
};

export default FeedbackPromptsSettings;
