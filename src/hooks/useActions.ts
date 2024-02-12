import { useMemo } from 'react';

import { LocalContext } from '@graasp/apps-query-client';

import {
  AppActionTypes,
  ChooseResponseAction,
  DeleteResponseAction,
  EvaluateResponseAction,
  OpenAppAction,
  SubmitNewResponseAction,
} from '@/config/appActionsTypes';
import {
  AnonymousResponseData,
  CurrentStateData,
  RatingsAppData,
  ResponseAppData,
} from '@/config/appDataTypes';
import { mutations } from '@/config/queryClient';

interface UseActionsValues {
  postSubmitNewResponseAction: (response: ResponseAppData) => void;
  postDeleteResponseAction: (id: ResponseAppData['id']) => void;
  postChooseResponseAction: (
    anonymousResponseData: AnonymousResponseData,
  ) => void;
  postOpenAppAction: (
    currentState?: CurrentStateData,
    context?: LocalContext,
  ) => void;
  postEvaluateResponseAction: <T>(evaluation: RatingsAppData<T>) => void;
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
    () => (anonymousResponseData: AnonymousResponseData) => {
      const action: ChooseResponseAction = {
        type: AppActionTypes.ChooseResponse,
        data: anonymousResponseData,
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

  const postEvaluateResponseAction = useMemo(
    () =>
      <T>(evaluation: RatingsAppData<T>) => {
        const action: EvaluateResponseAction<T> = {
          type: AppActionTypes.EvaluateResponse,
          data: {
            id: evaluation.id,
            type: evaluation.type,
            data: evaluation.data,
          },
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
    postEvaluateResponseAction,
  };
};

export default useActions;
