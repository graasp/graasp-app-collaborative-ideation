import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Alert,
  AlertTitle,
  Collapse,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { AppData } from '@graasp/sdk';
import { Button, Loader } from '@graasp/ui';

import { AnonymousIdeaData, IdeaData } from '@/config/appDataTypes';
import { IDEA_MAXIMUM_LENGTH, REFRESH_INTERVAL_MS } from '@/config/constants';
import { useAppDataContext } from '@/modules/context/AppDataContext';

const IdeaInput: FC<{
  currentRound?: number;
  parent?: AnonymousIdeaData;
  onSubmitted?: (id: string) => void;
  actAsBot?: boolean;
}> = ({ parent, currentRound, onSubmitted, actAsBot }) => {
  const { t } = useTranslation();
  // const initialIdea = parent?.idea || '';
  const [idea, setIdea] = useState<string>('');
  const { postAppDataAsync, invalidateAppData } = useAppDataContext();
  const [promisePostIdea, setPromisePostIdea] = useState<
    Promise<AppData> | undefined
  >();
  const submit = (): void => {
    const newIdeaData: IdeaData = {
      idea,
      parentId: parent?.id,
      round: currentRound,
      bot: actAsBot,
    };

    const promise = postAppDataAsync({
      type: 'idea',
      visibility: 'member',
      data: newIdeaData,
    })?.then((postedIdea) => {
      setTimeout(() => {
        if (typeof onSubmitted !== 'undefined') onSubmitted(postedIdea.id);
        setPromisePostIdea(undefined);
        setIdea('');
        invalidateAppData();
      }, REFRESH_INTERVAL_MS);

      return postedIdea;
    });
    setPromisePostIdea(promise);
  };
  const isPosting = typeof promisePostIdea !== 'undefined';
  const tooLong = idea.length > IDEA_MAXIMUM_LENGTH;
  const disableSubmission = isPosting || tooLong || idea.length === 0;
  return (
    <>
      <Collapse in={tooLong}>
        <Alert severity="error">{t('IDEA_TOO_LONG_ALERT')}</Alert>
      </Collapse>
      {parent && (
        <Alert severity="info">
          <AlertTitle>{t('CUE_PARENT_IDEA_TITLE')}</AlertTitle>
          <q>{parent.idea}</q>
        </Alert>
      )}
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
        {t('SUBMIT')}
      </Button>
      <Collapse in={isPosting}>
        <Stack direction="row" spacing={1}>
          <Alert severity="info">{t('IDEA_BEING_SUBMITTED_ALERT')}</Alert>
          <Loader />
        </Stack>
      </Collapse>
    </>
  );
};

export default IdeaInput;
