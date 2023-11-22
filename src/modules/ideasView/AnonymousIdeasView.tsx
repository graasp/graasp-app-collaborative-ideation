import { useMemo } from 'react';

import Container from '@mui/material/Container';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import { AppDataTypes, IdeaSetAppData } from '@/config/appDataTypes';
import { useAppDataContext } from '@/modules/context/AppDataContext';
import { useSettings } from '@/modules/context/SettingsContext';

import RatingsPlot from './RatingsPlot';

const AnonymousIdeasView = (): JSX.Element => {
  // const { t } = useTranslation();
  const { appData } = useAppDataContext();
  const { orchestrator } = useSettings();
  const ideasTable = useMemo(() => {
    const ideaSet = (
      appData.find(
        (a) =>
          a.type === AppDataTypes.IdeaSet && a.member.id === orchestrator.id,
      ) as IdeaSetAppData
    )?.data.ideas;
    return ideaSet.map((i) => ({
      id: i.id,
      idea: i.idea,
      parentId: i.parentId,
      parentIdea: ideaSet.find(({ id }) => i.parentId === id)?.idea,
      bot: i.bot,
    }));
  }, [appData, orchestrator.id]);
  const columns: GridColDef[] = [
    { field: 'idea', headerName: 'Idea', width: 600, resizable: true },
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
      resizable: true,
    },
    { field: 'parentIdea', headerName: 'Parent', width: 60, resizable: true },
  ];

  return (
    <Container>
      <DataGrid columns={columns} rows={ideasTable} />
      <RatingsPlot />
    </Container>
  );
};

export default AnonymousIdeasView;
