import { ChangeEvent, FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import cloneDeep from 'lodash.clonedeep';
import { v4 as uuidv4 } from 'uuid';

import { AssistantsSetting } from '@/config/appSettingsType';
import {
  AssistantPersona,
  PromptMode,
  makeEmptyAssistant,
} from '@/interfaces/assistant';
import SectionTitle from '@/modules/adminPanel/SectionTitle';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import AssistantDialog from './AssistantDialog';
import AssistantCard from './AssistantCard';

interface AssistantProps {
  assistants: AssistantsSetting;
  onChange: (newAssistantsSetting: AssistantsSetting) => void;
}

const Assistant: FC<AssistantProps> = ({
  assistants: assistantsSetting,
  onChange,
}) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'SETTINGS.ASSISTANT',
  });
  const [editedAssistant, setEditedAssistant] = useState<AssistantPersona>();
  const { assistants, includeDetails, promptMode } = assistantsSetting;

  const handleIncludeDetailsChange = (
    _e: ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ): void => {
    onChange({
      ...assistantsSetting,
      includeDetails: checked,
    });
  };

  const handlePromptModeChange = (e: SelectChangeEvent): void => {
    onChange({
      ...assistantsSetting,
      promptMode: e.target.value as PromptMode,
    });
  };

  const handleSave = (newAssistant: AssistantPersona): void => {
    const newAssistants = cloneDeep(assistants);
    const index = newAssistants.findIndex((p) => p.id === newAssistant.id);
    if (index === -1) {
      newAssistants.push(newAssistant);
    } else {
      newAssistants[index] = newAssistant;
    }
    onChange({
      ...assistantsSetting,
      assistants: newAssistants,
    });
    setEditedAssistant(undefined);
  };

  const deleteAssistant = (assistantToDelete: AssistantPersona): void => {
    onChange({
      assistants: assistants.filter((a) => a.id !== assistantToDelete.id),
    });
  };

  const addAssistant = (): void => {
    setEditedAssistant(makeEmptyAssistant(uuidv4()));
  };

  const isEditing = typeof editedAssistant !== 'undefined';

  return (
    <>
      <SectionTitle>{t('TITLE')}</SectionTitle>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={includeDetails}
              onChange={handleIncludeDetailsChange}
            />
          }
          label={t('USE_DETAILS')}
        />
      </FormGroup>
      <FormControl>
        <InputLabel id="prompt-mode-label">{t('PROMPT_MODE_LABEL')}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={promptMode}
          label={t('PROMPT_MODE_LABEL')}
          onChange={handlePromptModeChange}
        >
          <MenuItem value={PromptMode.Instructions}>
            {t('PROMPT_MODE_ITEMS.INSTRUCTIONS')}
          </MenuItem>
          <MenuItem value={PromptMode.Problem}>
            {t('PROMPT_MODE_ITEMS.PROBLEM')}
          </MenuItem>
        </Select>
      </FormControl>
      <Grid container spacing={1}>
        {assistants.map((persona) => (
          <Grid key={persona.id} item>
            <AssistantCard
              assistant={persona}
              onEdit={(a) => setEditedAssistant(a)}
              onDelete={deleteAssistant}
            />
          </Grid>
        ))}
      </Grid>
      <Button onClick={addAssistant}>{t('ADD')}</Button>
      {isEditing && (
        <AssistantDialog
          assistant={editedAssistant}
          onSave={handleSave}
          open={isEditing}
        />
      )}
    </>
  );
};

export default Assistant;
