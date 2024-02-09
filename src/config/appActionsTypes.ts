import { Data } from '@graasp/apps-query-client';
import { AppAction, AppData } from '@graasp/sdk';

import { ResponseData } from './appDataTypes';

export enum AppActionTypes {
  SubmitNewResponse = 'submit-new-response',
  DeleteResponse = 'delete-response',
  ChooseResponse = 'choose-response',
  OpenApp = 'open-app',
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
  data: AppDataRef<ResponseData>;
};
