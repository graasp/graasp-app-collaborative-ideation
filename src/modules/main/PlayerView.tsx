import { PLAYER_VIEW_CY } from '@/config/selectors';

import { JSX } from 'react';
import Activity from './Activity';

const PlayerView = (): JSX.Element => (
  <div data-cy={PLAYER_VIEW_CY}>
    <Activity />
  </div>
);

export default PlayerView;
