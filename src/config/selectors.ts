export const PLAYER_VIEW_CY = 'player-view';
export const BUILDER_VIEW_CY = 'builder-view';
export const ANALYTICS_VIEW_CY = 'analytics-view';
export const RESPONSE_COLLECTION_VIEW_CY = 'response-collection-view';
export const RESPONSE_EVALUATION_VIEW_CY = 'response-evaluation-view';
export const ADMIN_PANEL_CY = 'admin-panel';
export const PLAY_PAUSE_BUTTON_CY = 'play-pause-button';
export const INITIALIZE_BTN_CY = 'initialize-button';

export const buildDataCy = (selector: string): string =>
  `[data-cy=${selector}]`;
