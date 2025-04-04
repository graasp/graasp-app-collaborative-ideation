import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@mui/material/Button';

import { NEXT_ROUND_BTN_CY } from '@/config/selectors';

import useActivityState from '@/state/useActivityState';

interface NextRoundButtonProps {
  enable: boolean;
}

const NextRoundButton: FC<NextRoundButtonProps> = ({ enable }) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'ADMIN_PANEL.ORCHESTRATION',
  });
  const { nextRound } = useActivityState();

  return (
    <Button
        onClick={nextRound}
        disabled={!enable}
        data-cy={NEXT_ROUND_BTN_CY}
      >
        {t('NEXT_ROUND_BTN')}
      </Button>
  );
};

export default NextRoundButton;
