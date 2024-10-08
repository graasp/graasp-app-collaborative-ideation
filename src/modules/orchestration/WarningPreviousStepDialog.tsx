import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface WarningPreviousStepDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const WarningPreviousStepDialog: FC<WarningPreviousStepDialogProps> = ({
  open,
  onCancel,
  onConfirm,
}) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'ORCHESTRATION_BAR.WARNING_PREVIOUS_STEP_DIALOG',
  });
  return (
    <Dialog open={open}>
      <DialogTitle>{t('TITLE')}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t('WARNING_TEXT')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{t('CANCEL')}</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>
          {t('GO_TO_PREVIOUS_STEP')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WarningPreviousStepDialog;
