import { FC } from 'react';

import Box from '@mui/material/Box';

import {
  BoldItalicUnderlineToggles,
  InsertCodeBlock,
  MDXEditor,
  UndoRedo,
  codeBlockPlugin,
  codeMirrorPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  maxLengthPlugin,
  quotePlugin,
  toolbarPlugin,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';

import { RESPONSE_MAXIMUM_LENGTH } from '@/config/constants';
import { RESPONSE_INPUT_FIELD_CY } from '@/config/selectors';

interface MarkdownEditorProps {
  onChange: (markdown: string) => void;
  initialValue: string;
}

const MarkdownEditor: FC<MarkdownEditorProps> = ({
  initialValue,
  onChange,
}) => (
  <Box
    sx={{
      '& .input-response-content-editable': {
        fontFamily: '"Lucida Console", "Courier New", monospace',
      },
    }}
  >
    <MDXEditor
      markdown={initialValue}
      className="input-response"
      contentEditableClassName="input-response-content-editable"
      data-cy={RESPONSE_INPUT_FIELD_CY}
      onChange={onChange}
      plugins={[
        maxLengthPlugin(RESPONSE_MAXIMUM_LENGTH),
        quotePlugin(),
        listsPlugin(),
        linkPlugin(),
        markdownShortcutPlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: 'ts' }),
        codeMirrorPlugin({
          codeBlockLanguages: { js: 'JavaScript', ts: 'TypeScript' },
        }),
        toolbarPlugin({
          toolbarClassName: 'my-classname',
          // eslint-disable-next-line react/no-unstable-nested-components
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <InsertCodeBlock />
            </>
          ),
        }),
      ]}
    />
  </Box>
);

export default MarkdownEditor;
