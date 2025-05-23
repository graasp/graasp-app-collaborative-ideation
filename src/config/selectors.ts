export const PLAYER_VIEW_CY = 'player-view';
export const BUILDER_VIEW_CY = 'builder-view';
export const ANALYTICS_VIEW_CY = 'analytics-view';
export const RESPONSE_COLLECTION_VIEW_CY = 'response-collection-view';
export const RESPONSE_EVALUATION_VIEW_CY = 'response-evaluation-view';
export const RESPONSE_RESULTS_VIEW_CY = 'response-results-view';
export const ADMIN_PANEL_CY = 'admin-panel';
export const INITIALIZE_BTN_CY = 'initialize-button';
export const CODE_EDITOR_ID_CY = 'code-editor-id';
export const SETTING_CHATBOT_PROMPT_CODE_EDITOR_CY =
  'setting-chatbot-prompt-code-editor';

export const PROPOSE_NEW_RESPONSE_BTN_CY = 'propose-new-response';
export const RESPONSE_INPUT_FIELD_CY = 'response-input-field';
export const SUBMIT_RESPONSE_BTN_CY = 'submit-response-button';
export const NEXT_ROUND_BTN_CY = 'next-round';

export const SETTINGS_VIEW_CY = 'settings-view';

export const ACTIVITY_TAB_CY = 'activity-tab';
export const SETTINGS_TAB_CY = 'settings-tab';
export const RESPONSES_TAB_CY = 'responses-tab';

export const DETAILS_INSTRUCTIONS_CY = 'details-instructions';
export const TITLE_INSTRUCTIONS_CY = 'title-instructions';

export const ORCHESTRATION_BAR_CY = {
  PLAY_BUTTON: 'orchestration-bar-play-button',
  PAUSE_BUTTON: 'orchestration-bar-pause-button',
  PREVIOUS_STEP_BTN: 'orchestration-bar-previous-step-btn',
  NEXT_STEP_BTN: 'orchestration-bar-next-step-btn',
};

export const RESPONSE_CY = 'response';
export const MARKDOWN_CONTAINER_CY = 'markdown-container';

export const LIKERT_RATING_CY = 'likert-rating';

export const EVALUATION_RATE_CY = 'evaluation-rate-component-actions';

export const PROMPTS_CY = {
  REQUEST_BUTTON: 'prompts-request-button',
  PROMPT_STEP: 'prompt-step-indicator',
  DASHBOARD: 'prompts-dashboard',
  PROMPT: 'prompt',
};

export const buildDataCy = (selector: string): string =>
  `[data-cy=${selector}]`;
