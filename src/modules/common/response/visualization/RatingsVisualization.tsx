 import { TRANSLATIONS_NS } from '@/config/i18n';
import { useTranslation } from 'react-i18next';

const RatingsVisualization = (): JSX.Element => {
  const { t } = useTranslation(TRANSLATIONS_NS);
  // const { activity } = useSettings();
  // const { evaluationType } = activity;
  // const { getRatingsForResponse } = useRatings(evaluationType);

  // const ratings = useMemo(
  //   () => getRatingsForResponse(response.id),
  //   [getRatingsForResponse, response],
  // );

  // if (evaluationType === EvaluationType.DimensionsOfGIRating) {
  //   return (
  //     <DimensionsOfGlobalIssue
  //       ratings={ratings as RatingsAppData<DimensionsOfGIRatings>[]}
  //     />
  //   );
  // }
  // if (evaluationType === EvaluationType.SFERARating) {
  //   return <SFERAViz ratings={ratings as RatingsAppData<SFERARating>[]} />;
  // }
  // if (evaluationType === EvaluationType.UsefulnessNoveltyRating) {
  //   return (
  //     <UsefulnessNovelty
  //       ratings={ratings as RatingsAppData<UsefulnessNoveltyRatings>[]}
  //     />
  //   );
  // }
  return <>{t('NO_VISUALIZATION')}</>;
};

export default RatingsVisualization;
