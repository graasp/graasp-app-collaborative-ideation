import React, { useState } from 'react';

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import hljs from 'highlight.js';

const MarkdownHelper: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleDialogOpen = (): void => setOpen(true);
  const handleDialogClose = (): void => setOpen(false);

  const codeExample = '';

  const highlightedCodeExample = hljs.highlight(codeExample, {
    language: 'python',
  }).value;

  return (
    <Box my={2}>
      <Alert
        severity="info"
        variant="outlined"
        action={
          <IconButton
            size="small"
            color="primary"
            aria-label="Show Markdown help"
            onClick={handleDialogOpen}
            sx={{ ml: 1 }}
          >
            <HelpOutlineIcon fontSize="small" />
          </IconButton>
        }
      >
        You can use <b>Markdown</b> to format your text in the input field
        below.
      </Alert>
      <Dialog open={open} onClose={handleDialogClose} maxWidth="xs" fullWidth>
        <DialogTitle>Supported Markdown Syntax</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" gutterBottom>
            <b>Basic formatting:</b>
          </Typography>
          <ul>
            <li>
              <code>*italic*</code> or <code>_italic_</code> → <i>italic</i>
            </li>
            <li>
              <code>**bold**</code> or <code>__bold__</code> → <b>bold</b>
            </li>
            <li>
              <code>- List item</code> → List
            </li>
            <li>
              <code>[Graasp](https://graasp.org)</code> →{' '}
              <Link href="https://graasp.org" target="_blank" rel="noopener">
                Graasp
              </Link>
            </li>
            <li>
              <code>`inline code`</code> → <code>inline code</code>
            </li>
            <li>
              <code>
                ```python
                <br />
                {codeExample}
                ````
              </code>
              →
              <div
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: highlightedCodeExample }}
              />
            </li>
          </ul>
          <Typography variant="body2">
            For more details, see the{' '}
            <Link
              href="https://gist.github.com/Myndex/5140d6fe98519bb15c503c490e713233"
              target="_blank"
              rel="noopener"
            >
              GitHub Flavored Markdown Cheat Sheet
            </Link>
            .
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} size="small" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MarkdownHelper;
