import { FC, useMemo } from 'react';
import Plot from 'react-plotly.js';

import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';

import { AppDataTypes, IdeaSetAppData } from '@/config/appDataTypes';
import { useAppDataContext } from '@/modules/context/AppDataContext';
import { useSettings } from '@/modules/context/SettingsContext';

const RatingsPlot: FC = () => {
  const { appData } = useAppDataContext();
  const { orchestrator } = useSettings();
  const theme = useTheme();
  const ideas = useMemo(
    () =>
      (
        appData.find(
          ({ creator, type }) =>
            creator?.id === orchestrator.id && type === AppDataTypes.IdeaSet,
        ) as IdeaSetAppData
      )?.data.ideas,
    [appData, orchestrator.id],
  );

  const x = ideas.map(({ ratings }) => ratings?.novelty || 0);
  const y = ideas.map(({ ratings }) => ratings?.usefulness || 0);
  const labels = ideas.map(({ idea }) => idea);

  return (
    <Container>
      {/* Temporary workaround until react-plotly is upgraded to react 18
      see https://github.com/plotly/react-plotly.js/issues/280 */}
      {/* @ts-ignore */}
      <Plot
        data={[
          {
            x,
            y,
            text: labels,
            type: 'scatter',
            mode: 'markers',
            marker: { color: theme.palette.primary.main },
          },
        ]}
        layout={{
          // width: 600,
          height: 800,
          title: 'Idea ratings',
          xaxis: { title: 'Novelty' },
          yaxis: { title: 'Usefulness' },
        }}
      />
    </Container>
  );
};

export default RatingsPlot;
