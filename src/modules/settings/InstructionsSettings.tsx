import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import TextField from '@mui/material/TextField';

import { InstructionsSetting } from '@/config/appSettingsType';

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
  const { title, details } = instructions;
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
        type: details?.type || 'plain-text',
        content: newDetails,
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
    </SettingsSection>
  );
};

export default InstructionsSettings;
