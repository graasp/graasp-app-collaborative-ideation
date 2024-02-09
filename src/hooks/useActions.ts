import { useMemo } from 'react';

import {
  AppActionTypes,
  ChooseResponseAction,
  DeleteResponseAction,
  SubmitNewResponseAction,
} from '@/config/appActionsTypes';
import { AnonymousResponseData, ResponseAppData } from '@/config/appDataTypes';
import { mutations } from '@/config/queryClient';

interface UseActionsValues {
  postSubmitNewResponseAction: (response: ResponseAppData) => void;
  postDeleteResponseAction: (id: ResponseAppData['id']) => void;
  postChooseResponseAction: (
    anonymousResponseData: AnonymousResponseData,
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

  return {
    postSubmitNewResponseAction,
    postDeleteResponseAction,
    postChooseResponseAction,
  };
};

export default useActions;
