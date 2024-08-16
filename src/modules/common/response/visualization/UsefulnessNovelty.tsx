// import { RatingsAppData } from '@/config/appDataTypes';
// import { UsefulnessNoveltyRatings } from '@/interfaces/ratings';
// import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import Container from '@mui/material/Container';
// import { Box } from '@mui/material';
// import LinearIndicator from './indicators/LinearIndicator';

// const RATING_SCALE = 5;

// const UsefulnessNovelty = ({
//   ratings,
// }: {
//   ratings: RatingsAppData<UsefulnessNoveltyRatings>[];
// }): JSX.Element => {
//   const { t } = useTranslation('translations', {
//     keyPrefix: 'RATINGS.USEFULNESS_NOVELTY',
//   });
//   //   const { t: tGeneral } = useTranslation('translations');
//   const boxRef = useRef<HTMLElement>();
//   const [, updateState] = useState<object>();
//   const forceUpdate = useCallback(() => updateState({}), []);

//   useEffect(() => {
//     forceUpdate();
//   }, [boxRef, forceUpdate]);

//   const reshapedData = useMemo(() => {
//     const d = ratings.map(({ data }) => [
//       {
//         group: 'usefulness',
//         value: data.ratings.usefulness ?? 0,
//       },
//       {
//         group: 'novelty',
//         value: data.ratings.novelty ?? 0,
//       },
//     ]);
//     return d.flat();
//   }, [ratings]);
//   return (
//     <Container>
//       <Box ref={boxRef} width="100%">
//         <LinearIndicator
//           data={reshapedData}
//           maxValue={RATING_SCALE}
//           leftLabels={[
//             ['usefulness', t('USELESS')],
//             ['novelty', t('COMMON')],
//           ]}
//           rightLabels={[
//             ['usefulness', t('USEFUL')],
//             ['novelty', t('NOVEL')],
//           ]}
//           width={boxRef.current?.clientWidth ?? 100}
//           height={75}
//         />
//       </Box>
//     </Container>
//   );
// };

// export default UsefulnessNovelty;
