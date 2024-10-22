import { FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@mui/material/Button';

import { NEXT_ROUND_BTN_CY } from '@/config/selectors';
import useInvalidateAppData from '@/hooks/useInvalidateAppData';
import { useActivityStateContext } from '@/modules/context/ActivityStateContext';

import { useResponses } from '../context/ResponsesContext';

interface NextRoundButtonProps {
  enable: boolean;
}

const NextRoundButton: FC<NextRoundButtonProps> = ({ enable }) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'ADMIN_PANEL.ORCHESTRATION',
  });
  const [isPreparingNextRound, setIsPreparingNextRound] = useState(false);
  const invalidateAppData = useInvalidateAppData();
  const { nextRound } = useActivityStateContext();
  const { createAllResponsesSet } = useResponses();
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
    <>
      <Button
        onClick={prepareNextRound}
        disabled={!enable}
        data-cy={NEXT_ROUND_BTN_CY}
      >
        {t('NEXT_ROUND_BTN')}
      </Button>
      {/* TODO: Remove and make refresh automatic */}
      <Button onClick={() => invalidateAppData()}>{t('REFRESH_DATA')}</Button>
    </>
  );
};

export default NextRoundButton;
