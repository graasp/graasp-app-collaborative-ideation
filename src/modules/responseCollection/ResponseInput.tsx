import { FC, ReactElement, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { RESPONSE_MAXIMUM_LENGTH } from '@/config/constants';
import { SUBMIT_RESPONSE_BTN_CY } from '@/config/selectors';
import { participantToAuthor } from '@/interfaces/participant';
import {
  InputResponseData,
  ResponseData,
  responseDataFactory,
} from '@/interfaces/response';
import { useResponsesContext } from '@/state/ResponsesContext';
import useParticipants from '@/state/useParticipants';

import Loader from '../common/Loader';
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
      markup: 'markdown',
    };
    const newResponse = responseDataFactory(input, me);
    postResponse(newResponse)?.then((postedResponse) => {
      if (typeof onSubmitted !== 'undefined') {
        onSubmitted(postedResponse.id);
      }
      setResponse('');
      setIsPosting(false);
    });
  };
  const tooLong = response.length > RESPONSE_MAXIMUM_LENGTH;
  const disableSubmission = isPosting || tooLong || response.length === 0;
  return (
    <>
      {inputInstructions && (
        <Alert severity="info">{inputInstructions.content}</Alert>
      )}
      <Prompts onChange={(p) => setGivenPrompt(p)} />
      {parent && <PreviousResponse>{parent.response}</PreviousResponse>}
      {/* <MarkdownHelper /> */}
      <Paper
        variant="outlined"
        sx={{ width: { md: '75ch', sm: '100%' }, maxWidth: '100%' }}
      >
        <MarkdownEditor
          onChange={(markdown: string) => setResponse(markdown)}
          initialValue={response}
        />
      </Paper>
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
