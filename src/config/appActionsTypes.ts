import { Data } from '@graasp/apps-query-client';
import { AppAction, AppData, LocalContext } from '@graasp/sdk';

import { Prompt } from '@/interfaces/prompt';
import { ResponseData } from '@/interfaces/response';

import { ActivityState, ActivityStep } from '@/interfaces/activity_state';
import { VoteAppData } from './appDataTypes';

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
  VoteFor = 'vote-for',
  RemoveVote = 'remove-vote',
}

type AppDataRef<T extends Data> = Pick<AppData<T>, 'id' | 'type' | 'data'> &
  Partial<AppData>;

export type SubmitNewResponseAction = Pick<AppAction, 'type' | 'data'> & {
  type: AppActionTypes.SubmitNewResponse;
  data: ResponseData;
};

export type DeleteResponseAction = Pick<AppAction, 'type' | 'data'> & {
  type: AppActionTypes.DeleteResponse;
  data: { id: AppData['id'] };
};

export type ChooseResponseAction = Pick<AppAction, 'type' | 'data'> & {
  type: AppActionTypes.ChooseResponse;
  data: ResponseData;
};

export type OpenAppAction = Pick<AppAction, 'type' | 'data'> & {
  type: AppActionTypes.OpenApp;
  data: {
    activityState?: ActivityState;
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

export type VoteForAction = Pick<AppAction, 'type' | 'data'> & {
  type: AppActionTypes.VoteFor;
  data: AppDataRef<VoteAppData['data']>;
};

export type RemoveVoteAction = Pick<AppAction, 'type' | 'data'> & {
  type: AppActionTypes.RemoveVote;
  data: AppDataRef<VoteAppData['data']>;
};
