import { FC, useMemo } from 'react';

import Typography from '@mui/material/Typography';

import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import { Marked, Renderer } from 'marked';
import { markedHighlight } from 'marked-highlight';

import { MARKDOWN_CONTAINER_CY } from '@/config/selectors';

// For the syntax highlighting, the stylesheet is imported in the App.tsx
// import "highlight.js/styles/github.css";

const ResponsePart: FC<{ markdown: boolean; children: string }> = ({
  markdown,
  children,
}) => {
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
  if (markdown) {
    const unsafeHtml = marked.parse(children, { async: false });
    const inlineHtml = DOMPurify.sanitize(unsafeHtml);
    return (
      <Typography
        variant="body1"
        fontFamily='"Lucida Console", monospace'
        sx={{ overflowWrap: 'break-word', mb: 1 }}
        dangerouslySetInnerHTML={{ __html: inlineHtml }}
        data-cy={MARKDOWN_CONTAINER_CY}
      />
    );
  }
  return (
    <Typography variant="body1" sx={{ overflowWrap: 'break-word', mb: 1 }}>
      {children}
    </Typography>
  );
};

export default ResponsePart;
