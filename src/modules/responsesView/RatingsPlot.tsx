import { FC } from 'react';
import Plot from 'react-plotly.js';

import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';

import { joinMultipleResponses } from '@/hooks/utils/responses';
import { useActivityContext } from '../context/ActivityContext';

const RatingsPlot: FC = () => {
  const theme = useTheme();
  const { allResponses } = useActivityContext();

  const x = allResponses.map(({ data }) => data?.ratings?.novelty || 0);
  const y = allResponses.map(({ data }) => data?.ratings?.usefulness || 0);
  const labels = allResponses.map(({ data }) =>
    joinMultipleResponses(data.response),
  );

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
          title: 'Response ratings',
          xaxis: { title: 'Novelty' },
          yaxis: { title: 'Usefulness' },
        }}
      />
    </Container>
  );
};

export default RatingsPlot;
