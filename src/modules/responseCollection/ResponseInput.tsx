import { FC, ReactElement, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { RESPONSE_MAXIMUM_LENGTH } from '@/config/constants';
import {
  SUBMIT_RESPONSE_BTN_CY,
} from '@/config/selectors';
import { InputResponseData, ResponseData, responseDataFactory } from '@/interfaces/response';

import { useResponsesContext } from '@/state/ResponsesContext';
import useParticipants from '@/state/useParticipants';
import { participantToAuthor } from '@/interfaces/participant';
import { useSettings } from '../context/SettingsContext';
import MarkdownEditor from './MarkdownEditor';
import Prompts from './prompts/Prompts';
import Loader from '../common/Loader';

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
}> = ({ onCancel, parent, currentRound, onSubmitted }) => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'RESPONSE_COLLECTION.INPUT',
  });
  const { instructions } = useSettings();
  const { t: generalT } = useTranslation('translations');
  const { postResponse } = useResponsesContext();
  const { me: myselfAsParticipant } = useParticipants();
  const me = participantToAuthor(myselfAsParticipant);

  const [response, setResponse] = useState<string>('');

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

    const input: InputResponseData = {
          parentId: parent?.id,
          response,
          round: currentRound,
          givenPrompt,
          originalResponse: response,
        };
    const newResponse = responseDataFactory(input, me);
    postResponse(newResponse)?.then((postedResponse) => {
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
  const disableSubmission = isPosting || tooLong || response.length === 0;
  return (
    <>
      {inputInstructions && (
        <Alert severity="info">{inputInstructions.content}</Alert>
      )}
      <Prompts onChange={(p) => setGivenPrompt(p)} />
      {parent && (
        <PreviousResponse>{parent.response}</PreviousResponse>
      )}
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
