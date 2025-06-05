import { FC, ReactElement, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { AppData } from '@graasp/sdk';

import { ResponseAppData } from '@/config/appDataTypes';
import { RESPONSE_MAXIMUM_LENGTH } from '@/config/constants';
import { SUBMIT_RESPONSE_BTN_CY } from '@/config/selectors';
import useAssistants from '@/hooks/useAssistants';
import { ResponseData } from '@/interfaces/response';

import Loader from '../common/Loader';
import { useActivityContext } from '../context/ActivityContext';
import { useSettings } from '../context/SettingsContext';
import MarkdownEditor from './MarkdownEditor';
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
  parent?: ResponseAppData;
  onSubmitted?: (id: string) => void;
  actAsBot?: boolean;
  // enableAssistants?: boolean;
}> = ({ onCancel, parent, currentRound, onSubmitted, actAsBot }) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'RESPONSE_COLLECTION.INPUT',
  });
  const { activity, instructions } = useSettings();
  const { reformulateResponses } = activity;
  const { t: generalT } = useTranslation('translations');
  const { postResponse } = useActivityContext();
  // const [isWaitingOnBot, setIsWaitingOnBot] = useState<boolean>(false);
  const [response, setResponse] = useState<string>('');
  const promisePostIdea = useRef<Promise<AppData>>();
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
      ? typeof parent.data.response === 'string'
        ? [parent.data.response, processedResponse]
        : [...parent.data.response, processedResponse]
      : processedResponse;

    const newIdeaData: ResponseData = reformulateResponses
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
          markup: 'markdown',
        };

    promisePostIdea.current = postResponse(newIdeaData, true)?.then(
      (postedIdea) => {
        if (typeof onSubmitted !== 'undefined') {
          onSubmitted(postedIdea.id);
        }
        setResponse('');
        setIsPosting(false);
        return postedIdea;
      },
      (reason: unknown) => {
        setIsPosting(false);
        throw new Error(`Failed to submit the response.\n${reason}`);
      },
    );
  };
  const tooLong = response.length > RESPONSE_MAXIMUM_LENGTH;
  const disableSubmission = isPosting || tooLong || response.length === 0;
  return (
    <>
      {inputInstructions && (
        <Alert severity="info">{inputInstructions.content}</Alert>
      )}
      <Prompts onChange={(p) => setGivenPrompt(p)} />
      {parent &&
        (typeof parent.data.response === 'string' ? (
          <PreviousResponse>{parent.data.response}</PreviousResponse>
        ) : (
          parent.data.response.map((r, index) => (
            <PreviousResponse key={index}>{r}</PreviousResponse>
          ))
        ))}
      {/* <MarkdownHelper /> */}
      <Paper
        variant="outlined"
        sx={{ width: { md: '75ch', sm: '100%' }, maxWidth: '100%' }}
      >
        <MarkdownEditor
          onChange={(markdown: string) => setResponse(markdown)}
          initialValue={response}
          // disabled={isPosting}
        />
      </Paper>
      {/* TODO: Cleanup */}
      {/* <TextField
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
      /> */}
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
