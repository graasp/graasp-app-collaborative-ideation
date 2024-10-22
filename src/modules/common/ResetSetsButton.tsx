import { FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import usePrompts from '@/hooks/usePrompts';
import { useActivityStateContext } from '@/modules/context/ActivityStateContext';

import { useResponses } from '../context/ResponsesContext';

interface ResetSetsButtonProps {
  enable?: boolean;
}

const ResetSetsButton: FC<ResetSetsButtonProps> = (
  { enable } = { enable: true },
) => {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { resetActivityState } = useActivityStateContext();
  const { deleteAllResponsesSet } = useResponses();
  const { resetAllPrompts } = usePrompts();
  const promise = useRef<Promise<void>>();

  const handleConfirmation = async (): Promise<void> => {
    setDialogOpen(false);
    promise.current = deleteAllResponsesSet().then(() =>
      resetAllPrompts().then(() => resetActivityState()),
    );
  };

  return (
    <>
      <Button
        variant="contained"
        color="error"
        onClick={() => setDialogOpen(true)}
        disabled={!enable}
      >
        {t('ADMIN_PANEL.ORCHESTRATION.RESET_SETS_BTN')}
      </Button>
      <Dialog open={dialogOpen}>
        <DialogTitle id="alert-dialog-title">
          {t('ADMIN_PANEL.ORCHESTRATION.RESET_SETS_DIALOG.TITLE')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t('ADMIN_PANEL.ORCHESTRATION.RESET_SETS_DIALOG.HELPER_TEXT')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} autoFocus>
            {t('ADMIN_PANEL.ORCHESTRATION.RESET_SETS_DIALOG.CANCEL')}
          </Button>
          <Button
            onClick={handleConfirmation}
            variant="contained"
            color="error"
          >
            {t('ADMIN_PANEL.ORCHESTRATION.RESET_SETS_DIALOG.CONFIRM')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ResetSetsButton;
