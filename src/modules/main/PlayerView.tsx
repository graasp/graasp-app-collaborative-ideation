import { JSX } from 'react';

import { PLAYER_VIEW_CY } from '@/config/selectors';

import Activity from './Activity';

const PlayerView = (): JSX.Element => (
  <div data-cy={PLAYER_VIEW_CY}>
    <Activity />
  </div>
);

export default PlayerView;
