export const PLAYER_VIEW_CY = 'player-view';
export const BUILDER_VIEW_CY = 'builder-view';
export const ANALYTICS_VIEW_CY = 'analytics-view';
export const RESPONSE_COLLECTION_VIEW_CY = 'response-collection-view';
export const RESPONSE_EVALUATION_VIEW_CY = 'response-evaluation-view';
export const ADMIN_PANEL_CY = 'admin-panel';
export const PLAY_PAUSE_BUTTON_CY = 'play-pause-button';
export const INITIALIZE_BTN_CY = 'initialize-button';
export const CODE_EDITOR_ID_CY = 'code-editor-id';
export const SETTING_CHATBOT_PROMPT_CODE_EDITOR_CY =
  'setting-chatbot-prompt-code-editor';

export const PROPOSE_NEW_RESPONSE_BTN = 'propose-new-response';
export const RESPONSE_INPUT_FIELD_CY = 'response-input-field';
export const SUBMIT_RESPONSE_BTN_CY = 'submit-response-button';
export const NEXT_ROUND_BTN_CY = 'next-round';

export const SETTINGS_VIEW_CY = 'settings-view';

export const ACTIVITY_TAB_CY = 'activity-tab';
export const SETTINGS_TAB_CY = 'settings-tab';
export const RESPONSES_TAB_CY = 'responses-tab';

export const buildDataCy = (selector: string): string =>
  `[data-cy=${selector}]`;
