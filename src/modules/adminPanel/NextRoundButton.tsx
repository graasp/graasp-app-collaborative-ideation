import { FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@mui/material/Button';

import { NEXT_ROUND_BTN_CY } from '@/config/selectors';

import { useActivityContext } from '../context/ActivityContext';

interface NextRoundButtonProps {
  enable: boolean;
}

const NextRoundButton: FC<NextRoundButtonProps> = ({ enable }) => {
  const { t } = useTranslation();
  const [isPreparingNextRound, setIsPreparingNextRound] = useState(false);
  const { createAllResponsesSet, nextRound } = useActivityContext();
  const promise = useRef<Promise<void>>();

  const prepareNextRound = async (): Promise<void> => {
    if (!isPreparingNextRound) {
      setIsPreparingNextRound(true);
      promise.current = createAllResponsesSet().then(() => {
        nextRound();
        setIsPreparingNextRound(false);
      });
    }
  };

  return (
    <Button
      onClick={prepareNextRound}
      disabled={!enable}
      data-cy={NEXT_ROUND_BTN_CY}
    >
      {t('ADMIN_PANEL.ORCHESTRATION.NEXT_ROUND_BTN')}
    </Button>
  );
};

export default NextRoundButton;
