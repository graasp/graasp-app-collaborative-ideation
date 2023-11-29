export const PLAYER_VIEW_CY = 'player-view';
export const BUILDER_VIEW_CY = 'builder-view';
export const ANALYTICS_VIEW_CY = 'analytics-view';
export const IDEATION_VIEW_CY = 'ideaiton-view';
export const RESPONSE_EVALUATION_VIEW_CY = 'response-evaluation-view';

export const buildDataCy = (selector: string): string =>
  `[data-cy=${selector}]`;
