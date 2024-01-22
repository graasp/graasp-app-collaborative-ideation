import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import { v4 as uuidv4 } from 'uuid';

import { AssistantPersona, makeEmptyAssistant } from '@/interfaces/assistant';
import SectionTitle from '@/modules/adminPanel/SectionTitle';
import { useSettings } from '@/modules/context/SettingsContext';

import AssistantCard from './AssistantCard';
import AssistantDialog from './AssistantDialog';

const Assistant: FC = () => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'SETTINGS.ASSISTANT',
  });
  const [editedAssistant, setEditedAssistant] = useState<AssistantPersona>();
  const { assistants, saveSettings } = useSettings();
  const { personas } = assistants;

  const handleSave = (newAssistant: AssistantPersona): void => {
    const index = personas.findIndex((p) => p.id === newAssistant.id);
    if (index === -1) {
      personas.push(newAssistant);
    } else {
      personas[index] = newAssistant;
    }
    saveSettings('assistants', {
      ...assistants,
      personas,
    });
    setEditedAssistant(undefined);
  };

  const deleteAssistant = (assistantToDelete: AssistantPersona): void => {
    saveSettings('assistants', {
      ...assistants,
      personas: personas.filter((a) => a.id !== assistantToDelete.id),
    });
  };

  const addAssistant = (): void => {
    setEditedAssistant(makeEmptyAssistant(uuidv4()));
  };

  const isEditing = typeof editedAssistant !== 'undefined';

  return (
    <>
      <SectionTitle>{t('TITLE')}</SectionTitle>
      <Grid container spacing={2}>
        {personas.map((persona) => (
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
