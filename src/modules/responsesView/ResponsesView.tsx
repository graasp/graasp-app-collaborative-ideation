import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Container from '@mui/material/Container';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { useActivityContext } from '../context/ActivityContext';
import ResponsesSetsView from './ResponsesSetsView';

const ResponsesView = (): JSX.Element => {
  const { t } = useTranslation();
  const { allResponses } = useActivityContext();
  const ideasTable = useMemo(
    () =>
      allResponses.map((i) => ({
        id: i.id,
        idea: i.data.response,
        round: i.data.round,
        author: i.data.bot ? t('BOT_NAME') : i.creator?.name,
        parentId: i.data.parentId,
        bot: i.data.bot,
      })),
    [allResponses, t],
  );
  const columns: GridColDef[] = [
    { field: 'idea', headerName: 'Idea', width: 400, resizable: true },
    { field: 'author', headerName: 'Author', width: 130, resizable: true },
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
    { field: 'round', headerName: 'Round', width: 40 },
    { field: 'parentId', headerName: 'Parent', width: 60 },
  ];

  return (
    <Container>
      <DataGrid columns={columns} rows={ideasTable} />
      <ResponsesSetsView />
      {/* <RatingsPlot /> */}
    </Container>
  );
};

export default ResponsesView;
