import { RatingsAppData, ResponseAppData } from '@/config/appDataTypes';
import useRatings from '@/hooks/useRatings';
import { EvaluationType } from '@/interfaces/evaluationType';
import { useSettings } from '@/modules/context/SettingsContext';
import { useMemo } from 'react';
import {
  DimensionsOfGIRatings,
  SFERARating,
  UsefulnessNoveltyRatings,
} from '@/interfaces/ratings';
import DimensionsOfGlobalIssue from './DimensionsOfGlobalIssue';
import SFERAViz from './SFERA';
import UsefulnessNovelty from './UsefulnessNovelty';

const RatingsVisualization = ({
  response,
}: {
  response: ResponseAppData;
}): JSX.Element => {
  const { activity } = useSettings();
  const { evaluationType } = activity;
  const { getRatingsForResponse } = useRatings(evaluationType);

  const ratings = useMemo(
    () => getRatingsForResponse(response.id),
    [getRatingsForResponse, response],
  );

  if (evaluationType === EvaluationType.DimensionsOfGIRating) {
    return (
      <DimensionsOfGlobalIssue
        ratings={ratings as RatingsAppData<DimensionsOfGIRatings>[]}
      />
    );
  }
  if (evaluationType === EvaluationType.SFERARating) {
    return <SFERAViz ratings={ratings as RatingsAppData<SFERARating>[]} />;
  }
  if (evaluationType === EvaluationType.UsefulnessNoveltyRating) {
    return (
      <UsefulnessNovelty
        ratings={ratings as RatingsAppData<UsefulnessNoveltyRatings>[]}
      />
    );
  }
  return <>a</>;
};

export default RatingsVisualization;
