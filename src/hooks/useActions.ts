import { useMemo } from 'react';

import { LocalContext } from '@graasp/apps-query-client';

import {
  AppActionTypes,
  ChooseResponseAction,
  DeleteResponseAction,
  OpenAppAction,
  SubmitNewResponseAction,
} from '@/config/appActionsTypes';
import {
  AnonymousResponseData,
  CurrentStateData,
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

  return {
    postSubmitNewResponseAction,
    postDeleteResponseAction,
    postChooseResponseAction,
    postOpenAppAction,
  };
};

export default useActions;
