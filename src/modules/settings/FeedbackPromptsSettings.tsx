import { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { FeedbackSettings } from '@/config/appSettingsType';
import { feedbackPrompts } from '@/hooks/feedback/prompts';
import useFeedback from '@/hooks/feedback/useFeedback';
import { responseDataFactory } from '@/interfaces/response';
import useParticipants from '@/state/useParticipants';

import SettingsSection from '../common/SettingsSection';

interface FeedbackPromptsSettingsProps {
  feedback: FeedbackSettings;
  onChange: (newFeedbackSettings: FeedbackSettings) => void;
}

const FeedbackPromptsSettings: FC<FeedbackPromptsSettingsProps> = ({
  feedback,
  onChange,
}) => {
  const { t, i18n } = useTranslation('translations', {
    keyPrefix: 'SETTINGS.FEEDBACK_PROMPTS',
  });

  const { generateSystemPrompt, generateUserPrompt } = useFeedback();
  const { me } = useParticipants();
  const { systemPrompt, userPrompt, enabled } = feedback;
  const handleSystemPromptChange = (newSystemPrompt: string): void => {
    onChange({
      ...feedback,
      systemPrompt: newSystemPrompt,
    });
  };
  const handleEnableChange = (enable: boolean): void => {
    onChange({
      ...feedback,
      enabled: enable,
    });
  };

  const handleUserPromptChange = (newUserPrompt: string): void => {
    onChange({
      ...feedback,
      userPrompt: newUserPrompt,
    });
  };

  const handleResetToDefault = (): void => {
    const { exampleBank } = feedbackPrompts[i18n.language];
    const { system, user } = exampleBank[0];
    onChange({
      ...feedback,
      systemPrompt: system,
      userPrompt: user,
    });
  };

  const RESPONSE_1_EXAMPLE = t('PROMPTS_EXAMPLES.RESPONSE_1');
  const RESPONSE_1_FEEDBACK = t('PROMPTS_EXAMPLES.RESPONSE_1_FEEDBACK');
  const RESPONSE_2_EXAMPLE = t('PROMPTS_EXAMPLES.RESPONSE_2');

  const userPromptExample = generateUserPrompt(
    responseDataFactory({ response: RESPONSE_2_EXAMPLE }, me),
    [
      responseDataFactory(
        { response: RESPONSE_1_EXAMPLE, feedback: RESPONSE_1_FEEDBACK },
        me,
      ),
    ],
  );
  const systemPromptExample = generateSystemPrompt(systemPrompt ?? '');

  return (
    <SettingsSection title={t('TITLE')}>
      <FormControl>
        <FormControlLabel
          control={
            <Switch
              checked={enabled ?? false}
              onChange={(e) => handleEnableChange(e.target.checked)}
            />
          }
          label="Enable feedback"
        />
      </FormControl>
      <TextField
        value={systemPrompt}
        disabled={!enabled}
        onChange={(e) => handleSystemPromptChange(e.target.value)}
        helperText={t('HELPER_SYSTEM_PROMPT')}
        multiline
        label={t('LABEL_SYSTEM_PROMPT')}
      />
      <TextField
        value={userPrompt}
        disabled={!enabled}
        onChange={(e) => handleUserPromptChange(e.target.value)}
        helperText={
          <Trans i18nKey="SETTINGS.FEEDBACK_PROMPTS.HELPER_USER_PROMPT">
            <p>
              This prompt will be used to ask the AI assistant to provide
              feedback on a specific response.
            </p>
            <p>
              Tag details:
              <ul>
                <li>
                  <code>{'{{problem_statement}}'}</code>: the problem statement
                  with the details of the instruction given above
                </li>
                <li>
                  <code>{'{{current_response}}'}</code>: the response to provide
                  feedback on
                </li>
                <li>
                  <code>{'{{author}}'}</code>: the name of the author of the{' '}
                  <code>response</code>
                </li>
                <li>
                  <code>{'{{previous_responses}}'}</code>: a list of previous
                  responses in the thread, excluding the current
                </li>
              </ul>
            </p>
          </Trans>
        }
        multiline
        label={t('LABEL_USER_PROMPT')}
      />
      <Button onClick={handleResetToDefault} disabled={!enabled}>
        {t('RESET_TO_DEFAULT')}
      </Button>
      <Typography variant="h4">{t('PROMPTS_EXAMPLES_TITLE')}</Typography>
      <Typography variant="body1">
        <Trans i18nKey="SETTINGS.FEEDBACK_PROMPTS.PROMPTS_EXAMPLES_EXPLANATION">
          Consider the following two responses in a thread:
          <ul>
            <li>
              <strong>Response 1</strong>: <em>{RESPONSE_1_EXAMPLE}</em>
              <br />
              With feedback: <blockquote>{RESPONSE_1_FEEDBACK}</blockquote>
            </li>
            <li>
              <strong>Response 2</strong>: <em>{RESPONSE_2_EXAMPLE}</em>
            </li>
          </ul>
        </Trans>
      </Typography>
      <Typography variant="h5">{t('SYSTEM_PROMPT_EXAMPLE_HEADER')}</Typography>
      <Typography variant="caption">{systemPromptExample}</Typography>
      <Typography variant="h5">{t('USER_PROMPT_EXAMPLE_HEADER')}</Typography>
      <Typography variant="caption">{userPromptExample}</Typography>
    </SettingsSection>
  );
};

export default FeedbackPromptsSettings;
