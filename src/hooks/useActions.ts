import { useCallback, useMemo } from 'react';

import { Data } from '@graasp/apps-query-client';

import {
  AppActionTypes,
  ChooseResponseAction,
  DeleteResponseAction,
  NextStepAction,
  OpenAppAction,
  PauseActivityAction,
  PlayActivityAction,
  PreviousStepAction,
  RequestPromptAction,
  SubmitNewResponseAction,
} from '@/config/appActionsTypes';
import { CurrentStateData, ResponseAppData } from '@/config/appDataTypes';
import { mutations } from '@/config/queryClient';
import { ActivityStep } from '@/interfaces/interactionProcess';
import { LocalContext } from '@graasp/sdk';

interface UseActionsValues {
  postSubmitNewResponseAction: (response: ResponseAppData) => void;
  postDeleteResponseAction: (id: ResponseAppData['id']) => void;
  postChooseResponseAction: (response: ResponseAppData) => void;
  postOpenAppAction: (
    currentState?: CurrentStateData,
    context?: LocalContext,
  ) => void;
  // postEvaluateResponseAction: <T>(evaluation: RatingsAppData<T>) => void;
  postNextStepAction: (step: ActivityStep, stepIndex: number) => void;
  postPreviousStepAction: (step: ActivityStep, stepIndex: number) => void;
  postPlayActivityAction: (data?: Data) => void;
  postPauseActivityAction: (data?: Data) => void;
  postRequestPromptAction: (data: RequestPromptAction['data']) => void;
}

const useActions = (): UseActionsValues => {
  const { mutate: postAppAction } = mutations.usePostAppAction();
  const postSubmitNewResponseAction = useMemo(
    () => (response: ResponseAppData) => {
      const action: SubmitNewResponseAction = {
        type: AppActionTypes.SubmitNewResponse,
        data: {
          id: response.id,
          type: response.type,
          data: response.data,
        },
      };
      postAppAction(action);
    },
    [postAppAction],
  );

  const postDeleteResponseAction = useMemo(
    () => (id: ResponseAppData['id']) => {
      const action: DeleteResponseAction = {
        type: AppActionTypes.DeleteResponse,
        data: {
          id,
        },
      };
      postAppAction(action);
    },
    [postAppAction],
  );

  const postChooseResponseAction = useMemo(
    () => (response: ResponseAppData) => {
      const action: ChooseResponseAction = {
        type: AppActionTypes.ChooseResponse,
        data: response,
      };
      postAppAction(action);
    },
    [postAppAction],
  );

  const postOpenAppAction = useMemo(
    () => (currentState?: CurrentStateData, context?: LocalContext) => {
      const action: OpenAppAction = {
        type: AppActionTypes.OpenApp,
        data: { currentState, context },
      };
      postAppAction(action);
    },
    [postAppAction],
  );

  // const postEvaluateResponseAction = useMemo(
  //   () =>
  //     <T>(evaluation: RatingsAppData<T>) => {
  //       const action: EvaluateResponseAction<T> = {
  //         type: AppActionTypes.EvaluateResponse,
  //         data: {
  //           id: evaluation.id,
  //           type: evaluation.type,
  //           data: evaluation.data,
  //         },
  //       };
  //       postAppAction(action);
  //     },
  //   [postAppAction],
  // );

  const postNextStepAction = useCallback(
    (step: ActivityStep, stepIndex: number) => {
      const action: NextStepAction = {
        type: AppActionTypes.NextStep,
        data: {
          ...step,
          stepIndex,
        },
      };
      postAppAction(action);
    },
    [postAppAction],
  );

  const postPreviousStepAction = useCallback(
    (step: ActivityStep, stepIndex: number) => {
      const action: PreviousStepAction = {
        type: AppActionTypes.PreviousStep,
        data: {
          ...step,
          stepIndex,
        },
      };
      postAppAction(action);
    },
    [postAppAction],
  );

  const postPlayActivityAction = useCallback(
    (data?: Data) => {
      const action: PlayActivityAction = {
        type: AppActionTypes.PlayActivity,
        data: data ?? {},
      };
      postAppAction(action);
    },
    [postAppAction],
  );

  const postPauseActivityAction = useCallback(
    (data?: Data) => {
      const action: PauseActivityAction = {
        type: AppActionTypes.PauseActivity,
        data: data ?? {},
      };
      postAppAction(action);
    },
    [postAppAction],
  );

  const postRequestPromptAction = useCallback(
    (data: RequestPromptAction['data']) => {
      const action: RequestPromptAction = {
        type: AppActionTypes.RequestPrompt,
        data,
      };
      postAppAction(action);
    },
    [postAppAction],
  );

  return {
    postSubmitNewResponseAction,
    postDeleteResponseAction,
    postChooseResponseAction,
    postOpenAppAction,
    // postEvaluateResponseAction,
    postNextStepAction,
    postPreviousStepAction,
    postPlayActivityAction,
    postPauseActivityAction,
    postRequestPromptAction,
  };
};

export default useActions;
