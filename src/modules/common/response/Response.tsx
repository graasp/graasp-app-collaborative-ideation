import { FC, useMemo } from 'react';
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
import { ResponseVisibilityMode } from '@/interfaces/activity_state';
import { ResponseData, ResponseEvaluation } from '@/interfaces/response';
import { Thread } from '@/interfaces/threads';
import { useSettings } from '@/modules/context/SettingsContext';

import FeedbackButton from './FeedbackButton';

// For the syntax highlighting, the stylesheet is imported in the App.tsx
// import "highlight.js/styles/github.css";

const Response: FC<{
  response: ResponseData<ResponseEvaluation>;
  thread: Thread;
}> = ({ response, thread }) => {
  const { response: content, markup, author, round, feedback } = response;
  const { activity } = useSettings();
  const { t: generalT } = useTranslation('translations');
  const theme = useTheme();
  const isLive = activity.mode === ResponseVisibilityMode.Sync;

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
        {feedback ? (
          <Alert
            severity="info"
            iconMapping={{
              info: <SmartToyIcon fontSize="inherit" />,
            }}
          >
            <AlertTitle>Feedback</AlertTitle>
            <Typography
              variant="body2"
              sx={{
                overflowWrap: 'break-word',
                mb: 1,
              }}
            >
              {feedback}
            </Typography>
          </Alert>
        ) : (
          <FeedbackButton response={response} thread={thread} />
        )}
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
