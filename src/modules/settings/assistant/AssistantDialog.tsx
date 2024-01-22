import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormLabel,
  Link,
  Stack,
  TextField,
  TextareaAutosize,
  Typography,
  styled,
} from '@mui/material';

import { ChatBotMessage } from '@graasp/sdk';

import { DEFAULT_BOT_USERNAME, SMALL_BORDER_RADIUS } from '@/config/constants';
import { SETTING_CHATBOT_PROMPT_CODE_EDITOR_CY } from '@/config/selectors';
import { AssistantPersona } from '@/interfaces/assistant';
import CodeEditor from '@/modules/common/CodeEditor';

const TextArea = styled(TextareaAutosize)(({ theme }) => ({
  borderRadius: SMALL_BORDER_RADIUS,
  padding: theme.spacing(2),
  fontSize: '1rem',
  boxSizing: 'border-box',
  resize: 'vertical',
  border: 0,
  outline: 'solid rgba(80, 80, 210, 0.5) 1px',
  // make sure the outline is offset by the same amount that it is wide to not overflow
  outlineOffset: '-1px',
  width: '100%',
  minWidth: '0',
  minHeight: `calc(1rem + 2*${theme.spacing(2)})`,
  transition: 'outline 250ms ease-in-out',
  '&:focus': {
    outline: 'solid var(--graasp-primary) 2px !important',
  },
  '&:hover': {
    outline: 'solid var(--graasp-primary) 1px ',
  },
}));

interface AssistantDialogProps {
  assistant: AssistantPersona;
  onSave: (newAssistant: AssistantPersona) => void;
  open: boolean;
}

const AssistantDialog: FC<AssistantDialogProps> = ({
  assistant,
  onSave,
  open,
}) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'SETTINGS.ASSISTANT.EDIT_DIALOG',
  });
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [formattingError, setFormattingError] = useState(false);
  const chatbotPrompt = assistant.description;
  const initialPrompt = assistant.message || [];
  const stringifiedJsonPrompt = JSON.stringify(initialPrompt, null, 2);
  const chatbotCue = assistant.description;
  const chatbotName = assistant.name || DEFAULT_BOT_USERNAME;
  const [newChatbotPrompt, setNewChatbotPrompt] = useState(
    stringifiedJsonPrompt,
  );
  const [newChatbotCue, setNewChatbotCue] = useState(chatbotCue);
  const [newChatbotName, setNewChatbotName] = useState(chatbotName);

  const validatePrompt = <T,>(
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

  const hasNoFormattingErrors = (): void => setFormattingError(false);
  const hasFormattingErrors = (): void => setFormattingError(true);

  const handleChangeChatbotPrompt = (value: string): void => {
    validatePrompt(value, {
      onSuccess: hasNoFormattingErrors,
      onError: hasFormattingErrors,
    });
    setNewChatbotPrompt(value);
    setUnsavedChanges(true);
  };

  const handleChangeChatbotCue = (value: string): void => {
    setNewChatbotCue(value);
    setUnsavedChanges(true);
  };

  const handleChangeChatbotName = (value: string): void => {
    setNewChatbotName(value);
    setUnsavedChanges(true);
  };

  const handleSave = (): void => {
    const jsonNewChatbotPrompt = validatePrompt<ChatBotMessage[]>(
      newChatbotPrompt,
      {
        onError: () => {
          hasFormattingErrors();
          // eslint-disable-next-line no-console
          console.error(t('ERROR_PROMPT_NOT_IN_JSON_FORMAT'));
        },
      },
    );
    if (jsonNewChatbotPrompt) {
      onSave({
        ...assistant,
        name: newChatbotName,
        description: newChatbotCue,
        message: jsonNewChatbotPrompt,
      });
    }
  };

  return (
    <Dialog open={open}>
      <DialogTitle>
        <Typography variant="h2" fontWeight="bold" fontSize="1.5rem">
          {t('CHATBOT_SETTING_TITLE')}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={1}>
          {!chatbotPrompt && (
            <Alert severity="warning">
              {t('CHATBOT_CONFIGURATION_MISSING')}
            </Alert>
          )}

          <Stack spacing={2}>
            <Box>
              <Stack>
                <FormLabel>{t('CHATBOT_NAME_LABEL')}</FormLabel>
                <Typography variant="caption" color="text.secondary">
                  {t('CHATBOT_NAME_HELPER')}
                </Typography>
              </Stack>
              <TextField
                fullWidth
                id={SETTING_CHATBOT_PROMPT_CODE_EDITOR_CY}
                value={newChatbotName}
                onChange={({ target: { value } }) =>
                  handleChangeChatbotName(value)
                }
              />
            </Box>
            <Box>
              <Stack spacing={2}>
                <Stack>
                  <FormLabel>{t('CHATBOT_PROMPT_LABEL')}</FormLabel>
                  <Typography variant="caption" color="text.secondary">
                    {t('CHATBOT_PROMPT_HELPER')}
                  </Typography>
                  <CodeEditor
                    value={newChatbotPrompt}
                    onChange={(value: string) =>
                      handleChangeChatbotPrompt(value)
                    }
                  />
                  {formattingError ? (
                    <Typography color="error">
                      {t('ERROR_PROMPT_NOT_IN_JSON_FORMAT')}
                    </Typography>
                  ) : null}
                </Stack>
                <Accordion disableGutters>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="help-me"
                  >
                    {t('CHATBOT_PROMPT_HELPER_LABEL')}
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={1}>
                      <Typography variant="caption" color="text.secondary">
                        {t('CHATBOT_PROMPT_FORMAT_HELPER')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t('CHATBOT_PROMPT_FORMAT_EXAMPLE')}
                      </Typography>
                      <CodeEditor
                        value={JSON.stringify(
                          [
                            {
                              role: 'system',
                              content: 'You are a helpful assistant.',
                            },
                            {
                              role: 'user',
                              content: 'Who won the world series in 2020?',
                            },
                            {
                              role: 'assistant',
                              content:
                                'The Los Angeles Dodgers won the World Series in 2020.',
                            },
                            { role: 'user', content: 'Where was it played?' },
                          ],
                          null,
                          2,
                        )}
                        readOnly
                        fontSize="10px"
                      />

                      <Link
                        variant="caption"
                        target="_blank"
                        href="https://platform.openai.com/docs/api-reference/chat/create#chat-create-messages"
                      >
                        {t('CHATBOT_PROMPT_API_REFERENCE')}
                      </Link>
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              </Stack>
            </Box>
            <Box>
              <Stack>
                <FormLabel>{t('CHATBOT_CUE_LABEL')}</FormLabel>
                <Typography variant="caption" color="text.secondary">
                  {t('CHATBOT_CUE_HELPER')}
                </Typography>
              </Stack>
              <TextArea
                id={SETTING_CHATBOT_PROMPT_CODE_EDITOR_CY}
                value={newChatbotCue}
                onChange={({ target: { value } }) =>
                  handleChangeChatbotCue(value)
                }
              />
            </Box>
            <Box alignSelf="flex-end">
              <Button
                onClick={handleSave}
                disabled={!unsavedChanges}
                variant="outlined"
              >
                {unsavedChanges ? t('SAVE_LABEL') : t('SAVED_LABEL')}
              </Button>
            </Box>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
export default AssistantDialog;
