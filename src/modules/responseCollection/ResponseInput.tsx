import { FC, ReactElement, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Alert,
  Collapse,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Button from '@mui/material/Button';

import { Loader } from '@graasp/ui';

import { RESPONSE_MAXIMUM_LENGTH } from '@/config/constants';
import {
  RESPONSE_INPUT_FIELD_CY,
  SUBMIT_RESPONSE_BTN_CY,
} from '@/config/selectors';
import useAssistants from '@/hooks/useAssistants';
import { InputResponseData, ResponseData } from '@/interfaces/response';

import { useAppStateWorkerContext } from '../appStateWorker/AppStateContext';
import { useSettings } from '../context/SettingsContext';
import Prompts from './prompts/Prompts';

const PreviousResponse: FC<{ children: ReactElement | string }> = ({
  children,
}) => (
  <Typography maxWidth="100%" sx={{ overflowWrap: 'break-word' }}>
    {children}
  </Typography>
);

const ResponseInput: FC<{
  onCancel: () => void;
  currentRound?: number;
  parent?: ResponseData;
  onSubmitted?: (id: string) => void;
  actAsBot?: boolean;
  // enableAssistants?: boolean;
}> = ({ onCancel, parent, currentRound, actAsBot, onSubmitted }) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'RESPONSE_COLLECTION.INPUT',
  });
  const { activity, instructions } = useSettings();
  const { reformulateResponses } = activity;
  const { t: generalT } = useTranslation('translations');
  const { responses } = useAppStateWorkerContext();
  const { postResponse } = responses;
  // const [isWaitingOnBot, setIsWaitingOnBot] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const { reformulateResponse } = useAssistants();
  // const promiseBotRequest = useRef<Promise<void>>();
  const [isPosting, setIsPosting] = useState(false);
  const [givenPrompt, setGivenPrompt] = useState<string>();

  const inputInstructions = useMemo(
    () =>
      typeof instructions?.collection?.input !== 'undefined' &&
      instructions.collection.input.content.length > 0 &&
      instructions.collection.input,
    [instructions],
  );

  const submit = async (): Promise<void> => {
    setIsPosting(true);

    const processedResponse = reformulateResponses
      ? ((await reformulateResponse(response))?.data.completion ?? response)
      : response;

    // eslint-disable-next-line no-nested-ternary
    const responseToSubmit = parent
      ? typeof parent.response === 'string'
        ? [parent.response, processedResponse]
        : [...parent.response, processedResponse]
      : processedResponse;

    const newIdeaData: InputResponseData = reformulateResponses
      ? {
          parentId: parent?.id,
          response: responseToSubmit,
          round: currentRound,
          givenPrompt,
          bot: actAsBot,
          originalResponse: response,
        }
      : {
          response: responseToSubmit,
          parentId: parent?.id,
          round: currentRound,
          givenPrompt,
          bot: actAsBot,
        };
    postResponse(newIdeaData, (postedResponse) => {
      if (typeof onSubmitted !== 'undefined') {
        onSubmitted(postedResponse.id);
      }
      setResponse('');
      setIsPosting(false);
    });
    // if (typeof onSubmitted !== 'undefined') {
    //   onSubmitted('id');
    // }
    // promisePostIdea.current = postResponse(newIdeaData, true)?.then(
    //   (postedIdea) => {
    //     if (typeof onSubmitted !== 'undefined') {
    //       onSubmitted(postedIdea.id);
    //     }
    //     setResponse('');
    //     setIsPosting(false);
    //     return postedIdea;
    //   },
    //   (reason: unknown) => {
    //     setIsPosting(false);
    //     throw new Error(`Failed to submit the response.\n${reason}`);
    //   },
    // );
  };
  const tooLong = response.length > RESPONSE_MAXIMUM_LENGTH;
  // const disableSubmission =
  //   isPosting || tooLong || response.length === 0 || isWaitingOnBot;
  const disableSubmission = isPosting || tooLong || response.length === 0;
  return (
    <>
      {inputInstructions && (
        <Alert severity="info">{inputInstructions.content}</Alert>
      )}
      <Prompts onChange={(p) => setGivenPrompt(p)} />
      {parent &&
        (typeof parent.response === 'string' ? (
          <PreviousResponse>{parent.response}</PreviousResponse>
        ) : (
          parent.response.map((r, index) => (
            <PreviousResponse key={index}>{r}</PreviousResponse>
          ))
        ))}
      <TextField
        helperText={t('HELPER')}
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
                {response.length}/{RESPONSE_MAXIMUM_LENGTH}
              </Typography>
            </InputAdornment>
          ),
        }}
        // eslint-disable-next-line react/jsx-no-duplicate-props
        inputProps={{
          id: 'input-response',
        }}
        data-cy={RESPONSE_INPUT_FIELD_CY}
      />
      <Collapse in={tooLong}>
        <Alert severity="error">{t('RESPONSE_TOO_LONG_ALERT')}</Alert>
      </Collapse>
      <Stack direction="row" spacing={2}>
        <Button
          onClick={submit}
          disabled={disableSubmission}
          data-cy={SUBMIT_RESPONSE_BTN_CY}
          variant="contained"
        >
          {t('SUBMIT')}
        </Button>
        <Button onClick={onCancel}>{generalT('CANCEL')}</Button>
      </Stack>
      <Collapse in={isPosting}>
        <Stack direction="row" spacing={1}>
          <Alert severity="info">{t('RESPONSE_BEING_SUBMITTED_ALERT')}</Alert>
          <Loader />
        </Stack>
      </Collapse>
    </>
  );
};

export default ResponseInput;
