import { Data, LocalContext } from '@graasp/apps-query-client';
import { AppAction, AppData } from '@graasp/sdk';

import { ActivityStep } from '@/interfaces/interactionProcess';
import { Prompt } from '@/interfaces/prompt';
import { ResponseData } from '@/interfaces/response';
import { CurrentStateData, ResponseAppData } from './appDataTypes';

export enum AppActionTypes {
  SubmitNewResponse = 'submit-new-response',
  DeleteResponse = 'delete-response',
  ChooseResponse = 'choose-response',
  OpenApp = 'open-app',
  EvaluateResponse = 'evaluate-response',
  ChangeActivityState = 'change-activity-state',
  PromptAssistant = 'prompt-assistant',
  NextStep = 'next-step',
  PreviousStep = 'previous-step',
  PlayActivity = 'play-activity',
  PauseActivity = 'pause-activity',
  RequestPrompt = 'request-prompt',
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
  data: ResponseAppData;
};

export type OpenAppAction = Pick<AppAction, 'type' | 'data'> & {
  type: AppActionTypes.OpenApp;
  data: {
    currentState?: CurrentStateData;
    context?: LocalContext;
  };
};

// export type EvaluateResponseAction<T> = Pick<AppAction, 'type' | 'data'> & {
//   type: AppActionTypes.EvaluateResponse;
//   data: AppDataRef<RatingsData<T>>;
// };

type StepAction = Pick<AppAction, 'type' | 'data'> & {
  data: ActivityStep & { stepIndex: number };
};

export type NextStepAction = StepAction & {
  type: AppActionTypes.NextStep;
};

export type PreviousStepAction = StepAction & {
  type: AppActionTypes.PreviousStep;
};

export type PlayActivityAction = Pick<AppAction, 'type' | 'data'> & {
  type: AppActionTypes.PlayActivity;
};

export type PauseActivityAction = Pick<AppAction, 'type' | 'data'> & {
  type: AppActionTypes.PauseActivity;
};

export type RequestPromptAction = Pick<AppAction, 'type' | 'data'> & {
  type: AppActionTypes.RequestPrompt;
  data: { prompt: Prompt; promptRequestNumber: number };
};
