import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Container from '@mui/material/Container';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { ResponseAppData } from '@/config/appDataTypes';
import { useAppDataContext } from '@/modules/context/AppDataContext';

import RatingsPlot from './RatingsPlot';

const IdeasView = (): JSX.Element => {
  const { t } = useTranslation();
  const { appData } = useAppDataContext();
  const ideasTable = useMemo(() => {
    const ideas = appData.filter(
      ({ type }) => type === 'idea',
    ) as ResponseAppData[];
    return ideas.map((i) => ({
      id: i.id,
      idea: i.data.idea,
      author: i.data.bot ? t('BOT_NAME') : i.creator?.name,
      parentId: i.data.parentId,
      bot: i.data.bot,
    }));
  }, [appData, t]);
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
    { field: 'parentId', headerName: 'Parent', width: 60 },
  ];

  return (
    <Container>
      <DataGrid columns={columns} rows={ideasTable} />
      <RatingsPlot />
    </Container>
  );
};

export default IdeasView;
