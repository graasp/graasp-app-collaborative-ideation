import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Container from '@mui/material/Container';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useResponsesContext } from '@/state/ResponsesContext';

const ResponsesView = (): JSX.Element => {
  const { t } = useTranslation();
  const { allResponses } = useResponsesContext();
  const ideasTable = useMemo(
    () =>
      allResponses.map((i) => ({
        id: i.id,
        idea: i.response,
        round: i.round,
        author: i.bot ? t('BOT_NAME') : i.author?.name,
        parentId: i.parentId,
        bot: i.bot,
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
      {/* <RatingsPlot /> */}
    </Container>
  );
};

export default ResponsesView;
