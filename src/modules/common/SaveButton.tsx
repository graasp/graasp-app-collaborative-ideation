import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@mui/material/Button';

interface SaveButtonProps {
  disabled: boolean;
  onSave: () => void;
}

const SaveButton: FC<SaveButtonProps> = ({ disabled, onSave }) => {
  const { t } = useTranslation();
  return (
    <Button disabled={disabled} onClick={onSave}>
      {t('SAVE')}
    </Button>
  );
};

export default SaveButton;
