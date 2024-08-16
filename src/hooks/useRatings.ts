// import { AppDataTypes, RatingsAppData } from '@/config/appDataTypes';
// import { EvaluationType } from '@/interfaces/evaluationType';
// import {
//   DimensionsOfGIRatings,
//   SFERARating,
//   UsefulnessNoveltyRatings,
// } from '@/interfaces/ratings';
// import { useAppDataContext } from '@/modules/context/AppDataContext';
// import { useCallback, useMemo } from 'react';

// interface UseRatingsValue<T> {
//   allRatings: RatingsAppData<T>[];
//   getRatingsForResponse: (id: string) => RatingsAppData<T>[];
// }

// type ReturnRating<T> = T extends EvaluationType.DimensionsOfGIRating
//   ? DimensionsOfGIRatings
//   : T extends EvaluationType.UsefulnessNoveltyRating
//     ? UsefulnessNoveltyRatings
//     : T extends EvaluationType.SFERARating
//       ? SFERARating
//       : null;

// const useRatings = (
//   evaluationType: EvaluationType,
// ): UseRatingsValue<ReturnRating<typeof evaluationType>> => {
//   type R = ReturnRating<typeof evaluationType>;
//   const { appData } = useAppDataContext();
//   const allRatings = useMemo(
//     () =>
//       appData.filter(
//         ({ type, data }) =>
//           type === AppDataTypes.Ratings && data?.type === evaluationType,
//       ) as RatingsAppData<R>[],
//     [appData, evaluationType],
//   );

//   const getRatingsForResponse = useCallback(
//     (id: string) => allRatings.filter(({ data }) => data?.ideaRef === id),
//     [allRatings],
//   );

//   return { allRatings, getRatingsForResponse };
// };

// export default useRatings;
