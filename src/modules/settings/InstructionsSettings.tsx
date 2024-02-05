import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import FormGroup from '@mui/material/FormGroup';
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
  const { title } = instructions;
  const handleTitleChange = (newTitle: string): void => {
    onChange({
      ...instructions,
      title: {
        ...instructions.title,
        content: newTitle,
      },
    });
  };
  return (
    <SettingsSection title={t('TITLE')}>
      <FormGroup>
        <TextField
          value={title.content}
          onChange={(e) => handleTitleChange(e.target.value)}
          helperText={t('HELPER_TITLE')}
          multiline
          label={t('LABEL_TITLE')}
        />
      </FormGroup>
    </SettingsSection>
  );
};

export default InstructionsSettings;
