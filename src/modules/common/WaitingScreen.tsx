import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { IdeationState } from '@/interfaces/ideation';

interface WaitingScreenProps {
  state: IdeationState;
}

const WaitingScreen: FC<WaitingScreenProps> = ({ state }) => {
  const { t } = useTranslation();

  if (state === IdeationState.Pause) {
    return <p>pause</p>;
  }
  return <p>wait please</p>;
};

export default WaitingScreen;
