// import { useMemo } from 'react';

// import Container from '@mui/material/Container';
// import { DataGrid, GridColDef } from '@mui/x-data-grid';

// import RatingsPlot from './RatingsPlot';
// import { useActivityContext } from '../context/ActivityContext';

// const AnonymousIdeasView = (): JSX.Element => {
//   const { allResponses } = useActivityContext();
//   const ideasTable = useMemo(
//     () =>
//       allResponses.map((i) => ({
//         id: i.id,
//         response: i.data.response,
//         parentId: i.data.parentId,
//         parentIdea: allResponses.find(({ id }) => i.data.parentId === id)?.data
//           ?.response,
//         bot: i.data?.bot,
//       })),
//     [allResponses],
//   );
//   const columns: GridColDef[] = [
//     { field: 'response', headerName: 'Response', width: 600, resizable: true },
//     {
//       field: 'bot',
//       headerName: 'Agent',
//       type: 'string',
//       valueFormatter: (params) => {
//         if (params.value) {
//           return '🤖';
//         }
//         return '🧑';
//       },
//       width: 40,
//       resizable: true,
//     },
//     { field: 'parentIdea', headerName: 'Parent', width: 60, resizable: true },
//   ];

//   return (
//     <Container>
//       <DataGrid columns={columns} rows={ideasTable} />
//       <RatingsPlot />
//     </Container>
//   );
// };

// export default AnonymousIdeasView;
