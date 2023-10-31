import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Pausable from '@/modules/common/Pausable';

const ResponseEvaluation: FC = () => {
  const { t } = useTranslation();
  return (
    <Pausable>
      <>{t('RESPONSE_EVALUATION.TITLE')}</>
    </Pausable>
  );
};

export default ResponseEvaluation;
