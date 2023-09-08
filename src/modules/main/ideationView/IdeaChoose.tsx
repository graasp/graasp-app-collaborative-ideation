import { FC, useCallback, useMemo, useState } from 'react';

import Stack from '@mui/material/Stack';

import { Set } from 'immutable';

import { IdeasData } from '@/config/appDataTypes';
import Idea from '@/modules/common/Idea';

const IdeaChoose: FC<{
  ideas: IdeasData;
  onChoose: (
    id: string,
    ratings: { [key: string]: { [key: string]: number } },
  ) => void;
}> = ({ ideas, onChoose }) => {
  const ideasIds = useMemo(() => ideas.map((i) => i.id).toSet(), [ideas]);
  const [completeIdeas, setCompleteIdeas] = useState(Set<string>([]));

  const [ratings, setRatings] = useState<{
    [key: string]: { [key: string]: number };
  }>();
  const [ready, setReady] = useState(false);

  // const collectedIdeas = appData.filter(
  //   (i) => ideas.includes(i.id) && i.type === 'idea',
  // ) as List<IdeaAppData>;

  const handleRatingsChange = useCallback(
    (
      id: string,
      ideaRatings: { [key: string]: number },
      isComplete?: boolean,
    ): void => {
      const newRatings = {
        ...ratings,
        [id]: ideaRatings,
      };
      setRatings(newRatings);

      const newCompleteIdeasSet = isComplete
        ? completeIdeas.add(id)
        : completeIdeas;

      if (ideasIds.equals(newCompleteIdeasSet)) {
        setReady(true);
      }
      setCompleteIdeas(newCompleteIdeasSet);
    },
    [completeIdeas, ideasIds, ratings],
  );

  const handleChoose = (id: string): void => {
    if (ratings) {
      onChoose(id, ratings);
    } else {
      // TODO: Show alert.
      // eslint-disable-next-line no-console
      console.warn('No ratings were provided.');
    }
  };

  return (
    <Stack direction="row" spacing={4}>
      {ideas.map((idea) => (
        <Idea
          key={idea.id}
          idea={idea}
          onSelect={handleChoose}
          onRatingsChange={(newRatings, isComplete) =>
            handleRatingsChange(idea.id, newRatings, isComplete)
          }
          enableBuildAction={ready}
        />
      ))}
    </Stack>
  );
};

export default IdeaChoose;
