import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import cloneDeep from 'lodash.clonedeep';
import { v4 as uuidv4 } from 'uuid';

import { AssistantsSetting } from '@/config/appSettingsType';
import { AssistantPersona, makeEmptyAssistant } from '@/interfaces/assistant';
import SectionTitle from '@/modules/adminPanel/SectionTitle';

import AssistantCard from './AssistantCard';
import AssistantDialog from './AssistantDialog';

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
  const { assistants } = assistantsSetting;

  const handleSave = (newAssistant: AssistantPersona): void => {
    const newAssistants = cloneDeep(assistants);
    const index = newAssistants.findIndex((p) => p.id === newAssistant.id);
    if (index === -1) {
      newAssistants.push(newAssistant);
    } else {
      newAssistants[index] = newAssistant;
    }
    onChange({
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
