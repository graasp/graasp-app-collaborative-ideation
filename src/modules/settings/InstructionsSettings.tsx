import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import TextField from '@mui/material/TextField';

import { InstructionsSetting } from '@/config/appSettingsType';

import Alert from '@mui/material/Alert';
import SettingsSection from '../common/SettingsSection';

interface InstructionsSettingsProps {
  instructions: InstructionsSetting;
  onChange: (instuctions: InstructionsSetting) => void;
}

const InstructionsSettings: FC<InstructionsSettingsProps> = ({
  instructions,
  onChange,
}) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'SETTINGS.INSTRUCTIONS',
  });
  const { title, details, collection } = instructions;
  const { input, choose } = collection;
  const detailsContent = details?.content || '';
  const handleTitleChange = (newTitle: string): void => {
    onChange({
      ...instructions,
      title: {
        ...instructions.title,
        content: newTitle,
      },
    });
  };
  const handleDetailsChange = (newDetails: string): void => {
    onChange({
      ...instructions,
      details: {
        format: details?.format || 'plain-text',
        content: newDetails,
      },
    });
  };

  const handleInputInstrChange = (newInputInstr: string): void => {
    onChange({
      ...instructions,
      collection: {
        ...collection,
        input: {
          format: input?.format || 'plain-text',
          content: newInputInstr,
        },
      },
    });
  };

  const handleChooseInstrChange = (newChooseInstr: string): void => {
    onChange({
      ...instructions,
      collection: {
        ...collection,
        choose: {
          format: choose?.format || 'plain-text',
          content: newChooseInstr,
        },
      },
    });
  };

  return (
    <SettingsSection title={t('TITLE')}>
      <TextField
        value={title.content}
        onChange={(e) => handleTitleChange(e.target.value)}
        helperText={t('HELPER_TITLE')}
        multiline
        label={t('LABEL_TITLE')}
      />
      <TextField
        value={detailsContent}
        onChange={(e) => handleDetailsChange(e.target.value)}
        helperText={t('HELPER_DETAILS')}
        multiline
        rows={3}
        label={t('LABEL_DETAILS')}
      />
      {/* TODO: Factor out */}
      <Alert
        severity="info"
        sx={{
          '& .MuiAlert-message': {
            width: '100%',
          },
        }}
      >
        <TextField
          value={input?.content || ''}
          onChange={(e) => handleInputInstrChange(e.target.value)}
          helperText={t('HELPER_INPUT')}
          multiline
          rows={3}
          label={t('LABEL_INPUT')}
          fullWidth
        />
      </Alert>
      {/* TODO: Factor out */}
      <Alert
        severity="info"
        sx={{
          '& .MuiAlert-message': {
            width: '100%',
          },
        }}
      >
        <TextField
          value={choose?.content || ''}
          onChange={(e) => handleChooseInstrChange(e.target.value)}
          helperText={t('HELPER_CHOOSE')}
          multiline
          rows={3}
          label={t('LABEL_CHOOSE')}
          fullWidth
        />
      </Alert>
    </SettingsSection>
  );
};

export default InstructionsSettings;
