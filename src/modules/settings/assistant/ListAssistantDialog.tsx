import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormLabel from '@mui/material/FormLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Typography from '@mui/material/Typography';
import styled from '@mui/material/styles/styled';

import { DEFAULT_BOT_USERNAME, SMALL_BORDER_RADIUS } from '@/config/constants';
import { SETTING_CHATBOT_PROMPT_CODE_EDITOR_CY } from '@/config/selectors';
import {
  AssistantPersona,
  ListAssistantConfiguration,
} from '@/interfaces/assistant';
import CancelButton from '@/modules/common/CancelButton';

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

interface ListAssistantDialogProps {
  assistant: AssistantPersona<ListAssistantConfiguration>;
  onSave: (newAssistant: AssistantPersona<ListAssistantConfiguration>) => void;
  onCancel: () => void;
  open: boolean;
}

const ListAssistantDialog: FC<ListAssistantDialogProps> = ({
  assistant,
  onSave,
  onCancel,
  open,
}) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'SETTINGS.ASSISTANT.EDIT_DIALOG',
  });
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const chatbotCue = assistant.description;
  const chatbotName = assistant.name || DEFAULT_BOT_USERNAME;
  const [responses, setResponses] = useState(
    assistant.configuration.join('\n'),
  );
  const [newChatbotCue, setNewChatbotCue] = useState(chatbotCue);
  const [newChatbotName, setNewChatbotName] = useState(chatbotName);

  const handleChangeResponses = (value: string): void => {
    setResponses(value);
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
    const newResponses = responses.split('\n');
    if (newResponses) {
      onSave({
        ...assistant,
        name: newChatbotName,
        description: newChatbotCue,
        configuration: newResponses,
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
              <Stack>
                <FormLabel>{t('CHATBOT_PROMPT_LABEL')}</FormLabel>
                <Typography variant="caption" color="text.secondary">
                  {t('CHATBOT_PROMPT_HELPER')}
                </Typography>
                <TextArea
                  value={responses}
                  onChange={({ target: { value } }) =>
                    handleChangeResponses(value)
                  }
                />
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
              <CancelButton disabled={false} onCancel={onCancel} />
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
export default ListAssistantDialog;
