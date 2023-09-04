import { FC } from 'react';

import Stack from '@mui/material/Stack';

import { List } from 'immutable';

import { IdeaAppData, IdeasData } from '@/config/appDataTypes';
import Idea from '@/modules/common/Idea';
import { useAppDataContext } from '@/modules/context/AppDataContext';

const IdeaChoose: FC<{
  ideas: IdeasData;
  onChoose: (id: string) => void;
}> = ({ ideas, onChoose }) => {
  console.debug('Render IdeaChoose');
  const { appData } = useAppDataContext();

  // const collectedIdeas = appData.filter(
  //   (i) => ideas.includes(i.id) && i.type === 'idea',
  // ) as List<IdeaAppData>;

  return (
    <Stack direction="row" spacing={4}>
      {ideas.map((idea) => (
        <Idea key={idea.id} idea={idea} onSelect={onChoose} />
      ))}
    </Stack>
  );
};

export default IdeaChoose;
