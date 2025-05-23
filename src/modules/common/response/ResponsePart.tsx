import { FC } from 'react';

import Typography from '@mui/material/Typography';

import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';

const ResponsePart: FC<{ markdown: boolean; children: string }> = ({
  markdown,
  children,
}) => {
  if (markdown) {
    const marked = new Marked(
      markedHighlight({
        emptyLangClass: 'hljs',
        langPrefix: 'hljs language-',
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        highlight(code, lang, _info) {
          const language = hljs.getLanguage(lang) ? lang : 'plaintext';
          return hljs.highlight(code, { language }).value;
        },
      }),
    );

    const unsafeHtml = marked.parseInline(children, { async: false });
    const inlineHtml = DOMPurify.sanitize(unsafeHtml);
    return (
      <Typography
        variant="body1"
        sx={{ overflowWrap: 'break-word', mb: 1 }}
        dangerouslySetInnerHTML={{ __html: inlineHtml }}
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
