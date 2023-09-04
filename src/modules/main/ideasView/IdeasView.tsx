import { useEffect } from 'react';

import { Box, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';

import * as d3 from 'd3';
import { List, RecordOf } from 'immutable';

import { IdeaAppData } from '@/config/appDataTypes';
import Idea from '@/modules/common/Idea';
import { useAppDataContext } from '@/modules/context/AppDataContext';

// const renderChart = (data: List<IdeaAppData>): void => {

// };

const IdeasView = (): JSX.Element => {
  const { appData } = useAppDataContext();
  const ideas = appData.filter(({ type }) => type === 'idea') as RecordOf<
    List<IdeaAppData>
  >;
  console.log(ideas);
  // useEffect(() => {
  //   renderChart(ideas);
  // });
  // return <svg id="idea-chart"> </svg>;
  const setOfRounds = ideas.map((idea) => idea.data.round).toSet();

  return (
    <Stack direction="column">
      {setOfRounds.map((round) => (
        <Box key={round}>
          <Typography variant="h3">Round {round}</Typography>
          <Stack direction="row">
            {ideas
              .filter(({ data }) => data.round === round)
              .map((idea) => (
                <p key={idea.id}>{idea.data.idea}</p>
                // <Idea key={idea.id} idea={idea} />
              ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
};

export default IdeasView;
