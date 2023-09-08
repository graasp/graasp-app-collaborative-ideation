import { useMemo } from 'react';

import Container from '@mui/material/Container';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { List, RecordOf } from 'immutable';

import { IdeaAppData } from '@/config/appDataTypes';
import { useAppDataContext } from '@/modules/context/AppDataContext';

// const renderChart = (data: List<IdeaAppData>): void => {

// };

const IdeasView = (): JSX.Element => {
  const { appData } = useAppDataContext();
  const ideasTable = useMemo(() => {
    const ideas = appData.filter(({ type }) => type === 'idea') as RecordOf<
      List<IdeaAppData>
    >;
    return ideas.map((i) => ({
      id: i.id,
      idea: i.data.idea,
      author: i.creator?.name,
      parentId: i.data.parentId,
      bot: i.data.bot,
    }));
  }, [appData]);
  const columns: GridColDef[] = [
    { field: 'idea', headerName: 'Idea', width: 400 },
    { field: 'author', headerName: 'Author', width: 130 },
    {
      field: 'bot',
      headerName: 'Agent',
      type: 'string',
      valueFormatter: (params) => {
        if (params.value) {
          return '🤖';
        }
        return '🧑';
      },
      width: 40,
    },
  ];
  // console.log(ideas);
  // useEffect(() => {
  //   renderChart(ideas);
  // });
  // return <svg id="idea-chart"> </svg>;

  return (
    <Container>
      <DataGrid columns={columns} rows={ideasTable.toArray()} />
    </Container>
  );
};

export default IdeasView;
