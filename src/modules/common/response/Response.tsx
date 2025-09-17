import { FC, JSX, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import SmartToyIcon from '@mui/icons-material/SmartToy';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Typography from '@mui/material/Typography';
import useTheme from '@mui/material/styles/useTheme';

import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import { Marked, Renderer } from 'marked';
import { markedHighlight } from 'marked-highlight';

import { MARKDOWN_CONTAINER_CY } from '@/config/selectors';
import {
  ActivityType,
  ResponseVisibilityMode,
} from '@/interfaces/activity_state';
import { EvaluationType } from '@/interfaces/evaluation';
import {
  ResponseData,
  ResponseEvaluation,
  ResponseVotes,
} from '@/interfaces/response';
import { Thread } from '@/interfaces/threads';
import { useSettings } from '@/modules/context/SettingsContext';
import useActivityState from '@/state/useActivityState';

import FeedbackButton from './FeedbackButton';
import Vote from './evaluation/Vote';
import RatingsVisualization from './visualization/RatingsVisualization';
import Votes from './visualization/Votes';

// For the syntax highlighting, the stylesheet is imported in the App.tsx
// import "highlight.js/styles/github.css";

const Response: FC<{
  response: ResponseData<ResponseEvaluation>;
  thread: Thread;
}> = ({ response, thread }) => {
  const { response: content, markup, author, round, feedback } = response;
  const { activity, feedback: feebackSettings } = useSettings();
  const { enabled: feedbackEnabled } = feebackSettings;
  const { t: generalT } = useTranslation('translations');
  const theme = useTheme();
  const isLive = activity.mode === ResponseVisibilityMode.Sync;
  const { currentStep } = useActivityState();
  const evaluationType = currentStep?.evaluationType;
  const resultsType = currentStep?.resultsType;

  const isMarkdown = useMemo(() => markup === 'markdown', [markup]);
  const isAiGenerated = useMemo(
    () => author?.isArtificial || false,
    [author?.isArtificial],
  );

  const customRenderer = useMemo(() => {
    // Custom renderer to disable headings
    const renderer = new Renderer();
    renderer.heading = ({ text }) =>
      // Just return the plain text, not wrapped in <h1>..<h6>
      `${text}\n`;
    // Disable raw HTML rendering
    renderer.html = () => '';

    // Flatten table structure
    renderer.table = ({ header, rows }) => `${header}\n${rows}`;

    renderer.tablerow = ({ text }) => `${text}\n`; // each row on a new line

    renderer.tablecell = ({ text }) => `${text}\t`; // tab-separated columns

    renderer.image = ({ href, text }) =>
      `<a href="${href}"  referrerpolicy="no-referrer" target="_blank" rel="noreferrer">${text}</a>`;
    return renderer;
  }, []);
  const marked = useMemo(
    () =>
      new Marked(
        {
          renderer: customRenderer,
        },
        markedHighlight({
          emptyLangClass: 'hljs',
          langPrefix: 'hljs language-',
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          highlight(code, lang, _info) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
          },
        }),
      ),
    [customRenderer],
  );

  const feedbackContent = useMemo(() => {
    if (feedback) {
      return DOMPurify.sanitize(marked.parse(feedback, { async: false }));
    }
    return undefined;
  }, [feedback, marked]);

  const renderEvaluationComponent = (): JSX.Element | null => {
    switch (evaluationType) {
      case EvaluationType.Vote:
        return (
          <Vote
            response={response as ResponseData<ResponseVotes>}
            threadId={thread.id}
          />
        );
      // case EvaluationType.Rate:
      //   return <Rate responseId={id} />;
      // case EvaluationType.Rank:
      //   return <Rank responseId={id} />;
      default:
        return null;
    }
  };

  const renderResultsComponent = (): JSX.Element | null => {
    if (currentStep?.type === ActivityType.Results) {
      const nbrOfVotes =
        response.evaluation &&
        'votes' in response.evaluation &&
        Array.isArray(response.evaluation.votes)
          ? response.evaluation.votes.length
          : 0;
      switch (resultsType) {
        case EvaluationType.Vote:
          return <Votes votes={nbrOfVotes} />;
        case EvaluationType.Rate:
          return <RatingsVisualization responseId={response.id} />;
        default:
          return null;
      }
    }
    return null;
  };

  if (isMarkdown) {
    const unsafeHtml = marked.parse(content, { async: false });
    const inlineHtml = DOMPurify.sanitize(unsafeHtml);
    return (
      <>
        <Typography
          variant="body1"
          sx={{ overflowWrap: 'break-word', mb: 1 }}
          dangerouslySetInnerHTML={{ __html: inlineHtml }}
          data-cy={MARKDOWN_CONTAINER_CY}
        />
        <Typography
          variant="body2"
          sx={{
            color: isAiGenerated
              ? theme.palette.grey.A400
              : theme.palette.grey.A700,
          }}
        >
          {!isLive && generalT('ROUND', { round })}
        </Typography>
        {feedbackContent ? (
          <Alert
            severity="info"
            iconMapping={{
              info: <SmartToyIcon fontSize="inherit" />,
            }}
          >
            <AlertTitle>Feedback</AlertTitle>
            <Typography
              variant="body1"
              sx={{
                overflowWrap: 'break-word',
                mb: 1,
              }}
              dangerouslySetInnerHTML={{ __html: feedbackContent }}
            />
          </Alert>
        ) : (
          feedbackEnabled && (
            <FeedbackButton response={response} thread={thread} />
          )
        )}
        {renderEvaluationComponent()}
        {renderResultsComponent()}
      </>
    );
  }
  return (
    <Typography variant="body1" sx={{ overflowWrap: 'break-word', mb: 1 }}>
      {content}
    </Typography>
  );
};

export default Response;
