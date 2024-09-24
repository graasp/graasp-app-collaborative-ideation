import { ChangeEvent, FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import cloneDeep from 'lodash.clonedeep';
import { v4 as uuidv4 } from 'uuid';

import { AssistantsSetting } from '@/config/appSettingsType';
import {
  AssistantConfiguration,
  AssistantPersona,
  AssistantType,
  LLMAssistantConfiguration,
  ListAssistantConfiguration,
  PromptMode,
  makeEmptyLLMAssistant,
  makeEmptyListAssistant,
} from '@/interfaces/assistant';
import SectionTitle from '@/modules/adminPanel/SectionTitle';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import LLMAssistantDialog from './LLMAssistantDialog';
import AssistantCard from './AssistantCard';
import ListAssistantDialog from './ListAssistantDialog';

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
  const [editedAssistant, setEditedAssistant] =
    useState<AssistantPersona<AssistantConfiguration>>();
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

  const handleSave = (
    newAssistant: AssistantPersona<AssistantConfiguration>,
  ): void => {
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

  const deleteAssistant = (
    assistantToDelete: AssistantPersona<AssistantConfiguration>,
  ): void => {
    onChange({
      assistants: assistants.filter((a) => a.id !== assistantToDelete.id),
    });
  };

  const addLLMAssistant = (): void => {
    setEditedAssistant(makeEmptyLLMAssistant(uuidv4()));
  };

  const addListAssistant = (): void => {
    setEditedAssistant(makeEmptyListAssistant(uuidv4()));
  };

  const handleCancel = (): void => setEditedAssistant(undefined);

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
      <Button onClick={addLLMAssistant}>{t('ADD_LLM')}</Button>
      <Button onClick={addListAssistant}>{t('ADD_LIST')}</Button>
      {isEditing &&
        (editedAssistant.type === AssistantType.LLM ? (
          <LLMAssistantDialog
            assistant={
              editedAssistant as AssistantPersona<LLMAssistantConfiguration>
            }
            onSave={handleSave}
            open={isEditing}
            onCancel={handleCancel}
          />
        ) : (
          <ListAssistantDialog
            assistant={
              editedAssistant as AssistantPersona<ListAssistantConfiguration>
            }
            onSave={handleSave}
            open={isEditing}
            onCancel={handleCancel}
          />
        ))}
    </>
  );
};

export default Assistant;
