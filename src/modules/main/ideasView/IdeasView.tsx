import { useEffect } from 'react';

import { Box, Container, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

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
  const columns: GridColDef[] = [
    { field: 'data.idea', headerName: 'Idea' },
    { field: 'creator', headerName: 'Author' },
  ];
  // console.log(ideas);
  // useEffect(() => {
  //   renderChart(ideas);
  // });
  // return <svg id="idea-chart"> </svg>;

  return (
    <Container>
      <DataGrid columns={columns} rows={ideas.flatten().toArray()} />
    </Container>
  );
};

export default IdeasView;
