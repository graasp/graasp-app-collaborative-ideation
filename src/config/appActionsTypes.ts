import { Data, LocalContext } from '@graasp/apps-query-client';
import { AppAction, AppData } from '@graasp/sdk';

import {
  AnonymousResponseData,
  CurrentStateData,
  RatingsData,
  ResponseData,
} from './appDataTypes';

export enum AppActionTypes {
  SubmitNewResponse = 'submit-new-response',
  DeleteResponse = 'delete-response',
  ChooseResponse = 'choose-response',
  OpenApp = 'open-app',
  EvaluateResponse = 'evaluate-response',
  ChangeActivityState = 'change-activity-state',
  PromptAssistant = 'prompt-assistant',
}

type AppDataRef<T extends Data> = Pick<AppData<T>, 'id' | 'type' | 'data'> &
  Partial<AppData>;

export type SubmitNewResponseAction = Pick<AppAction, 'type' | 'data'> & {
  type: AppActionTypes.SubmitNewResponse;
  data: AppDataRef<ResponseData>;
};

export type DeleteResponseAction = Pick<AppAction, 'type' | 'data'> & {
  type: AppActionTypes.DeleteResponse;
  data: { id: AppData['id'] };
};

export type ChooseResponseAction = Pick<AppAction, 'type' | 'data'> & {
  type: AppActionTypes.ChooseResponse;
  data: AnonymousResponseData;
};

export type OpenAppAction = Pick<AppAction, 'type' | 'data'> & {
  type: AppActionTypes.OpenApp;
  data: {
    currentState?: CurrentStateData;
    context?: LocalContext;
  };
};

export type EvaluateResponseAction<T> = Pick<AppAction, 'type' | 'data'> & {
  type: AppActionTypes.EvaluateResponse;
  data: AppDataRef<RatingsData<T>>;
};
