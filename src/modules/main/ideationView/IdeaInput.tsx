import { FC, useState } from 'react';

import { TextField } from '@mui/material';

import { AppData } from '@graasp/sdk';
import { Button, Loader } from '@graasp/ui';

import {
  AnonymousIdeaData,
  Derivation,
  IdeaAppData,
  IdeaData,
} from '@/config/appDataTypes';
import Idea from '@/modules/common/Idea';
import { useAppDataContext } from '@/modules/context/AppDataContext';

const IdeaInput: FC<{
  currentRound: number;
  parent?: AnonymousIdeaData;
  onSubmitted?: (id: string) => void;
}> = ({ parent, currentRound, onSubmitted }) => {
  console.debug('Render IdeaInput');
  const initialIdea = parent?.idea || '';
  // derivation === 'variation' && typeof refIdea !== 'undefined'
  //   ? refIdea?.data?.idea
  //   : '';
  const [idea, setIdea] = useState<string>(initialIdea);
  const { postAppDataAsync } = useAppDataContext();
  const [promisePostIdea, setPromisePostIdea] = useState<
    Promise<AppData> | undefined
  >();
  const submit = (): void => {
    const newIdeaData: IdeaData = {
      idea,
      parentId: parent?.id,
      round: currentRound,
    };

    const promise = postAppDataAsync({
      type: 'idea',
      visibility: 'member',
      data: newIdeaData,
    })?.then((postedIdea) => {
      if (typeof onSubmitted !== 'undefined') onSubmitted(postedIdea.id);
      setPromisePostIdea(undefined);
      return postedIdea;
    });
    setPromisePostIdea(promise);
  };
  const isPosting = typeof promisePostIdea !== 'undefined';
  return (
    <>
      <TextField
        multiline
        fullWidth
        variant="standard"
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        disabled={isPosting}
      />
      <Button onClick={submit} disabled={isPosting}>
        Submit
      </Button>
      {isPosting ?? <Loader />}
    </>
  );
};

export default IdeaInput;
