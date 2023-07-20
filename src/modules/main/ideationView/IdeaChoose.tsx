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
  const { appData } = useAppDataContext();

  const collectedIdeas = appData.filter(
    (i) => ideas.includes(i.id) && i.type === 'idea',
  ) as List<IdeaAppData>;
  return (
    <Stack direction="row" spacing={4}>
      {collectedIdeas.map((idea) => (
        <Idea key={idea.id} idea={idea} onClick={onChoose} />
      ))}
    </Stack>
  );
};

export default IdeaChoose;
