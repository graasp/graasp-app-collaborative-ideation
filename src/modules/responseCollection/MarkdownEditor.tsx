import { FC } from 'react';

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
  <MDXEditor
    markdown={initialValue}
    className="input-response"
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
);

export default MarkdownEditor;
