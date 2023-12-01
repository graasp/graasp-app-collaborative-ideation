import { FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@mui/material/Button';

import useResponses from '@/hooks/useResponses';

interface NextRoundButtonProps {
  enable: boolean;
}

const NextRoundButton: FC<NextRoundButtonProps> = ({ enable }) => {
  const { t } = useTranslation();
  const [isPreparingNextRound, setIsPreparingNextRound] = useState(false);
  const { createAllResponsesSet } = useResponses();
  const promise = useRef<Promise<void>>();

  const prepareNextRound = async (): Promise<void> => {
    if (!isPreparingNextRound) {
      setIsPreparingNextRound(true);
      promise.current = createAllResponsesSet().then(() =>
        setIsPreparingNextRound(false),
      );
    }
  };

  return (
    <Button onClick={prepareNextRound} disabled={!enable}>
      {t('ADMIN_PANEL.ORCHESTRATION.NEXT_ROUND_BTN')}
    </Button>
  );
};

export default NextRoundButton;
