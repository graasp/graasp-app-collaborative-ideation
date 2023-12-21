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
import Button from '@mui/material/Button';

import { AppData, AppDataVisibility } from '@graasp/sdk';

import {
  AnonymousResponseData,
  AppDataTypes,
  ResponseData,
} from '@/config/appDataTypes';
import { IDEA_MAXIMUM_LENGTH } from '@/config/constants';
import { useAppDataContext } from '@/modules/context/AppDataContext';

import Loader from '../common/Loader';

const ResponseInput: FC<{
  currentRound?: number;
  parent?: AnonymousResponseData;
  onSubmitted?: (id: string) => void;
  actAsBot?: boolean;
}> = ({ parent, currentRound, onSubmitted, actAsBot }) => {
  const { t } = useTranslation();
  // const initialIdea = parent?.idea || '';
  const [response, setResponse] = useState<string>('');
  const { postAppDataAsync, invalidateAppData } = useAppDataContext();
  const [promisePostIdea, setPromisePostIdea] = useState<
    Promise<AppData> | undefined
  >();
  const submit = (): void => {
    const newIdeaData: ResponseData = {
      response,
      parentId: parent?.id,
      round: currentRound,
      bot: actAsBot,
    };

    const promise = postAppDataAsync({
      type: AppDataTypes.Response,
      visibility: AppDataVisibility.Member,
      data: newIdeaData,
    })?.then((postedIdea) => {
      if (typeof onSubmitted !== 'undefined') onSubmitted(postedIdea.id);
      setPromisePostIdea(undefined);
      setResponse('');
      invalidateAppData();
      return postedIdea;
    });
    setPromisePostIdea(promise);
  };
  const isPosting = typeof promisePostIdea !== 'undefined';
  const tooLong = response.length > IDEA_MAXIMUM_LENGTH;
  const disableSubmission = isPosting || tooLong || response.length === 0;
  return (
    <>
      <Collapse in={tooLong}>
        <Alert severity="error">{t('IDEA_TOO_LONG_ALERT')}</Alert>
      </Collapse>
      {parent && (
        <Alert severity="info">
          <AlertTitle>{t('CUE_PARENT_IDEA_TITLE')}</AlertTitle>
          <q>{parent.response}</q>
        </Alert>
      )}
      <TextField
        multiline
        fullWidth
        variant="outlined"
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        disabled={isPosting}
        color={tooLong ? 'error' : 'primary'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Typography variant="caption">
                {response.length}/{IDEA_MAXIMUM_LENGTH}
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

export default ResponseInput;
