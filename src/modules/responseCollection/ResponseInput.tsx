import { FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LoadingButton } from '@mui/lab';
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
import useChatbot from '@/hooks/useChatbot';
import { useAppDataContext } from '@/modules/context/AppDataContext';

import Loader from '../common/Loader';

const ResponseInput: FC<{
  currentRound?: number;
  parent?: AnonymousResponseData;
  onSubmitted?: (id: string) => void;
  actAsBot?: boolean;
}> = ({ parent, currentRound, onSubmitted, actAsBot }) => {
  const { t } = useTranslation();
  const [isWaitingOnBot, setIsWaitingOnBot] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const { postAppDataAsync, invalidateAppData } = useAppDataContext();
  const [promisePostIdea, setPromisePostIdea] = useState<
    Promise<AppData> | undefined
  >();
  const { generateSingleResponse } = useChatbot();
  const promiseBotRequest = useRef<Promise<void>>();

  const askBot = (): void => {
    setIsWaitingOnBot(true);
    promiseBotRequest.current = generateSingleResponse().then(
      (ans) => {
        if (ans) {
          setResponse(ans.data.completion);
          setIsWaitingOnBot(false);
        }
      },
      (reason: unknown) => {
        // eslint-disable-next-line no-console
        console.warn(reason);
        setIsWaitingOnBot(false);
      },
    );
  };

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
  const disableSubmission =
    isPosting || tooLong || response.length === 0 || isWaitingOnBot;
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
        sx={{ width: { md: '75ch', sm: '100%' }, maxWidth: '100%' }}
        multiline
        variant="outlined"
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        disabled={isPosting}
        color={tooLong ? 'error' : 'primary'}
        InputProps={{
          minRows: 3,
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
      {isWaitingOnBot ? (
        <LoadingButton>Waiting for the bot to reply.</LoadingButton>
      ) : (
        // Todo: Improve
        <Button onClick={askBot}>Ask the bot</Button>
      )}
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
