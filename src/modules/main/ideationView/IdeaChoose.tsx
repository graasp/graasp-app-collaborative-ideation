import { FC } from 'react';

import Stack from '@mui/material/Stack';

import { IdeasData } from '@/config/appDataTypes';
import Idea from '@/modules/common/Idea';

const IdeaChoose: FC<{
  ideas: IdeasData;
  onChoose: (id: string) => void;
}> = ({ ideas, onChoose }) => (
  <Stack direction="row" spacing={4}>
    {ideas.map((idea) => (
      <Idea key={idea.id} idea={idea} onClick={onChoose} />
    ))}
  </Stack>
);

export default IdeaChoose;
