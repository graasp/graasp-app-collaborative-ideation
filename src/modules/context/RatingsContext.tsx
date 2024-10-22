import { FC, createContext, useCallback, useContext, useMemo } from 'react';

import { useLocalContext } from '@graasp/apps-query-client';
import { AppDataVisibility } from '@graasp/sdk';

import { AppDataTypes, RatingAppData, RatingData } from '@/config/appDataTypes';
import { hooks, mutations } from '@/config/queryClient';
import { EvaluationParameters } from '@/interfaces/evaluation';

type RatingsContextType = {
  ratingsName: EvaluationParameters['ratingsName'];
  ratings: EvaluationParameters['ratings'];
  allRatings: Array<RatingAppData>;
  myRatings: Array<RatingAppData>;
  rate: (rating: RatingData) => Promise<void>;
  removeRatingsFor: (responseId: string) => void;
};
const defaultContextValue: RatingsContextType = {
  ratingsName: undefined,
  ratings: undefined,
  allRatings: [],
  myRatings: [],
  rate: () => Promise.resolve(),
  removeRatingsFor: () => Promise.resolve(),
};

const RatingsContext = createContext<RatingsContextType>(defaultContextValue);

type RatingsContextProps = {
  evaluationParameters?: EvaluationParameters;
  children: JSX.Element;
};

export const RatingsProvider: FC<RatingsContextProps> = ({
  evaluationParameters,
  children,
}) => {
  const { accountId } = useLocalContext();

  const { data: appData } = hooks.useAppData();
  const { mutate: postAppData } = mutations.usePostAppData();
  const { mutate: deleteAppData } = mutations.useDeleteAppData();
  const { mutate: patchAppData } = mutations.usePatchAppData();

  const ratingsName = evaluationParameters?.ratingsName ?? '';
  const ratings = useMemo(
    () => evaluationParameters?.ratings ?? [],
    [evaluationParameters?.ratings],
  );
  const allRatings = useMemo(
    () =>
      (appData?.filter(({ type }) => type === AppDataTypes.Rating) ??
        []) as RatingAppData[],
    [appData],
  );

  const myRatings = useMemo(
    () => allRatings.filter(({ creator }) => creator?.id === accountId),
    [allRatings, accountId],
  );

  const rate = useCallback(
    async (data: RatingData): Promise<void> => {
      const existingRating = myRatings.find(
        ({ data: existingData }) =>
          existingData.name === data.name &&
          existingData.responseRef === data.responseRef,
      );
      const newAppData: Pick<RatingAppData, 'type' | 'visibility' | 'data'> = {
        type: AppDataTypes.Rating,
        visibility: AppDataVisibility.Item,
        data,
      };
      if (existingRating) {
        patchAppData({
          id: existingRating.id,
          ...newAppData,
        });
      } else {
        postAppData(newAppData);
      }
    },
    [myRatings, patchAppData, postAppData],
  );

  const findRatingsFor = useCallback(
    (responseId: string): RatingAppData | undefined =>
      myRatings?.find(({ data }) => data.responseRef === responseId),
    [myRatings],
  );

  const removeRatingsFor = useCallback(
    async (responseId: string): Promise<void> => {
      const toRemove = findRatingsFor(responseId);
      if (toRemove) {
        deleteAppData({ id: toRemove.id });
      } else {
        throw Error(`Response with id ${responseId} not found.`);
      }
    },
    [deleteAppData, findRatingsFor],
  );

  const contextValue = useMemo(
    () => ({
      ratingsName,
      ratings,
      allRatings,
      myRatings,
      rate,
      removeRatingsFor,
    }),
    [allRatings, myRatings, rate, ratings, ratingsName, removeRatingsFor],
  );
  return (
    <RatingsContext.Provider value={contextValue}>
      {children}
    </RatingsContext.Provider>
  );
};

export const useRatingsContext = (): RatingsContextType =>
  useContext(RatingsContext);
