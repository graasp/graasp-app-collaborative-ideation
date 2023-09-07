import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Alert,
  Collapse,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';

import { AppData } from '@graasp/sdk';
import { Button, Loader } from '@graasp/ui';

import { AnonymousIdeaData, IdeaData } from '@/config/appDataTypes';
import { IDEA_MAXIMUM_LENGTH } from '@/config/constants';
import { useAppDataContext } from '@/modules/context/AppDataContext';

const IdeaInput: FC<{
  currentRound: number;
  parent?: AnonymousIdeaData;
  onSubmitted?: (id: string) => void;
}> = ({ parent, currentRound, onSubmitted }) => {
  const { t } = useTranslation();
  const initialIdea = parent?.idea || '';
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
  const tooLong = idea.length > IDEA_MAXIMUM_LENGTH;
  const disableSubmission = isPosting || tooLong;
  return (
    <>
      <Collapse in={tooLong}>
        <Alert severity="error">{t('IDEA_TOO_LONG_ALERT')}</Alert>
      </Collapse>
      <TextField
        multiline
        fullWidth
        variant="outlined"
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        disabled={isPosting}
        color={tooLong ? 'error' : 'primary'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Typography variant="caption">
                {idea.length}/{IDEA_MAXIMUM_LENGTH}
              </Typography>
            </InputAdornment>
          ),
        }}
      />
      <Button onClick={submit} disabled={disableSubmission}>
        Submit
      </Button>
      {isPosting ?? <Loader />}
    </>
  );
};

export default IdeaInput;
