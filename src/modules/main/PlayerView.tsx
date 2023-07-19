import { PLAYER_VIEW_CY } from '@/config/selectors';

import IdeationView from './ideationView/IdeationView';

const PlayerView = (): JSX.Element => (
  <div data-cy={PLAYER_VIEW_CY}>
    <IdeationView />
  </div>
);

export default PlayerView;
