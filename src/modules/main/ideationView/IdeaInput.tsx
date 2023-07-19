import { FC } from 'react';

import { TextField } from '@mui/material';

import { Button } from '@graasp/ui';

const IdeaInput: FC = () => (
  <>
    <TextField multiline fullWidth variant="standard" />
    <Button>Submit</Button>
  </>
);

export default IdeaInput;
