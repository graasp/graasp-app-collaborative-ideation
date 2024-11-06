import { FC, createContext, useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useLocalContext } from '@graasp/apps-query-client';
import { AppDataVisibility } from '@graasp/sdk';

import { AppDataTypes, RatingAppData, RatingData } from '@/config/appDataTypes';
import { TRANSLATIONS_NS } from '@/config/i18n';
import { EvaluationParameters } from '@/interfaces/evaluation';

import { useAppDataContext } from './AppDataContext';

type ThresholdType = {
  value: number;
  label: string;
  color: 'success' | 'warning' | 'error' | 'primary';
};

type RatingsContextType = {
  ratingsName: EvaluationParameters['ratingsName'];
  ratings: EvaluationParameters['ratings'];
  allRatings: Array<RatingAppData>;
  myRatings: Array<RatingAppData>;
  rate: (rating: RatingData) => Promise<void>;
  removeRatingsFor: (responseId: string) => void;
  getAllRatingsForResponse: (
    responseId: string,
  ) => Promise<Array<RatingAppData> | undefined>;
  getRatingsStatsForResponse: (
    responseId: string,
  ) => Promise<RatingData['ratings'] | undefined>;
  ratingsThresholds: ThresholdType[];
};
const defaultContextValue: RatingsContextType = {
  ratingsName: undefined,
  ratings: undefined,
  allRatings: [],
  myRatings: [],
  rate: () => Promise.resolve(),
  removeRatingsFor: () => Promise.resolve(),
  getAllRatingsForResponse: () => Promise.resolve(undefined),
  getRatingsStatsForResponse: () => Promise.resolve(undefined),
  ratingsThresholds: [],
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
  const { t } = useTranslation(TRANSLATIONS_NS);
  const { accountId } = useLocalContext();

  const { appData, postAppData, deleteAppData, patchAppData } =
    useAppDataContext();

  const ratingsName = evaluationParameters?.ratingsName ?? '';
  const ratings = useMemo(
    () => evaluationParameters?.ratings ?? [],
    [evaluationParameters?.ratings],
  );
  const allRatings = useMemo(
    () =>
      appData.filter(
        ({ type }) => type === AppDataTypes.Rating,
      ) as RatingAppData[],
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

  const getAllRatingsForResponse = useCallback(
    async (responseId: string): Promise<RatingAppData[] | undefined> =>
      allRatings?.filter(({ data }) => data.responseRef === responseId),
    [allRatings],
  );

  const ratingsLevels = useMemo(() => {
    const levels = new Map(ratings.map((r) => [r.name, r.levels]));
    return levels;
  }, [ratings]);

  const computeMeanRatings = useCallback(
    (
      accumulatedRatings: RatingData['ratings'],
      currentRating: RatingData['ratings'],
      _index: number,
      array: RatingData['ratings'][],
    ): RatingData['ratings'] => {
      const nbrRatings = array.length;
      const newAccumulatedRatings: RatingData['ratings'] = currentRating.map(
        (r, index) => {
          let prevVal = 0;
          if (accumulatedRatings.length > index) {
            prevVal = accumulatedRatings[index].value;
          }
          const value =
            r.value / ((ratingsLevels.get(r.name) ?? 1) * nbrRatings) + prevVal;
          return {
            ...r,
            value,
          };
        },
      );
      return newAccumulatedRatings;
    },
    [ratingsLevels],
  );

  const getRatingsStatsForResponse = useCallback(
    async (responseId: string): Promise<RatingData['ratings'] | undefined> => {
      const ratingsForResponse = await getAllRatingsForResponse(responseId);
      if (typeof ratingsForResponse !== 'undefined') {
        const extractedRatings = ratingsForResponse.map(
          ({ data }) => data.ratings,
        );

        const initialVal = extractedRatings[0].map((r) => ({
          ...r,
          value: 0,
        }));

        const accumulatedRatings = extractedRatings.reduce(
          computeMeanRatings,
          initialVal,
        );
        return accumulatedRatings;
      }
      return undefined;
    },
    [computeMeanRatings, getAllRatingsForResponse],
  );

  const ratingsThresholds: ThresholdType[] = useMemo(
    () => [
      {
        value: 0,
        color: 'error',
        label: t('BAD'),
      },
      {
        value: 1 / 3,
        color: 'warning',
        label: t('OKAY'),
      },
      {
        value: 2 / 3,
        color: 'success',
        label: t('GOOD'),
      },
    ],
    [t],
  );

  const contextValue = useMemo(
    () => ({
      ratingsName,
      ratings,
      allRatings,
      myRatings,
      rate,
      removeRatingsFor,
      getAllRatingsForResponse,
      getRatingsStatsForResponse,
      ratingsThresholds,
    }),
    [
      allRatings,
      getAllRatingsForResponse,
      getRatingsStatsForResponse,
      myRatings,
      rate,
      ratings,
      ratingsName,
      ratingsThresholds,
      removeRatingsFor,
    ],
  );
  return (
    <RatingsContext.Provider value={contextValue}>
      {children}
    </RatingsContext.Provider>
  );
};

export const useRatingsContext = (): RatingsContextType =>
  useContext(RatingsContext);
