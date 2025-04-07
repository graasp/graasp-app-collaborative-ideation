import { ANALYTICS_VIEW_CY } from '@/config/selectors';
import { JSX } from 'react';

const AnalyticsView = (): JSX.Element => (
  <div data-cy={ANALYTICS_VIEW_CY}>Player</div>
);

export default AnalyticsView;
