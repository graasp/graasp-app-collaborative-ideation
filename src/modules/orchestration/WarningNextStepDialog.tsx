import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

interface WarningNextStepDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const WarningNextStepDialog: FC<WarningNextStepDialogProps> = ({
  open,
  onCancel,
  onConfirm,
}) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'ORCHESTRATION_BAR.WARNING_NEXT_STEP_DIALOG',
  });
  const { t: generalT } = useTranslation('translations');
  return (
    <Dialog open={open}>
      <DialogTitle>{t('TITLE')}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t('WARNING_TEXT')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{generalT('CANCEL')}</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>
          {t('GO_TO_NEXT_STEP')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WarningNextStepDialog;
