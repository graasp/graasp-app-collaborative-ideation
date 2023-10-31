import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Alert, Grid, Typography } from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';
import { Button, Loader } from '@graasp/ui';

import { List } from 'immutable';

import { IdeasData, RatingsAppData } from '@/config/appDataTypes';
import { NUMBER_OF_IDEAS_TO_SHOW } from '@/config/constants';
import { ResponseVisibilityMode } from '@/interfaces/interactionProcess';
import { NoveltyRelevanceRatings } from '@/interfaces/ratings';
import Idea from '@/modules/common/response/Response';
import { useAppDataContext } from '@/modules/context/AppDataContext';
import { useSettings } from '@/modules/context/SettingsContext';
import { getMyResponses } from '@/utils/responses';

interface ResponseChooseProps {
  ideas: IdeasData;
  onChoose: (id?: string) => void;
}

const ResponseChoose: FC<ResponseChooseProps> = ({ ideas, onChoose }) => {
  const { t } = useTranslation();
  const { appData, isSuccess, isLoading, invalidateAppData } =
    useAppDataContext();
  const { memberId } = useLocalContext();
  const { mode: ideationMode } = useSettings();
  const { mode } = ideationMode;
  const numberOfIdeasToShow = NUMBER_OF_IDEAS_TO_SHOW;
  const [selectedIdeas, setSelectedIdeas] = useState<IdeasData>();

  const ownIdeasIds = useMemo(
    () => getMyResponses(appData, memberId).map(({ id }) => id),
    [appData, memberId],
  );

  const ratings = useMemo(
    () =>
      appData.filter(
        ({ type, creator }) => type === 'ratings' && creator?.id === memberId,
      ) as List<RatingsAppData<NoveltyRelevanceRatings>> | undefined,
    [appData, memberId],
  );

  useEffect(() => {
    if (isSuccess && typeof selectedIdeas === 'undefined') {
      if (mode === ResponseVisibilityMode.PartiallyBlind) {
        const ideasNotRated = ideas.filterNot(
          ({ id }) =>
            Boolean(ratings?.find(({ data }) => data.ideaRef === id)) ||
            ownIdeasIds.includes(id),
        );
        if (ideasNotRated.size > 0) {
          const ideasToShow = ideasNotRated.slice(0, numberOfIdeasToShow - 1);
          setSelectedIdeas(ideasToShow);
        }
      } else {
        setSelectedIdeas(ideas);
      }
    }
  }, [
    isSuccess,
    selectedIdeas,
    appData,
    ideas,
    memberId,
    numberOfIdeasToShow,
    ownIdeasIds,
    mode,
    ratings,
  ]);

  const handleChoose = (id?: string): void => {
    onChoose(id);
  };

  const renderPlaceHolderForNoIdeas = (): JSX.Element => {
    if (isLoading) {
      return <Loader />;
    }
    return (
      <>
        <Alert sx={{ m: 1 }} severity="info">
          {t('NO_IDEAS_TO_SHOW_TEXT')}
        </Alert>
        <Button onClick={() => invalidateAppData()}>
          {t('CHECK_FOR_NEW_IDEAS')}
        </Button>
      </>
    );
  };

  return (
    <>
      <Typography variant="body1">{t('CHOOSE_IDEA_HEADER_TEXT')}</Typography>
      <Grid container spacing={2}>
        {selectedIdeas
          ? selectedIdeas.map((idea) => (
              <Grid key={idea.id} item md={4} sm={6} xs={12}>
                <Idea
                  key={idea.id}
                  response={idea}
                  responseId={idea.id}
                  onSelect={handleChoose}
                />
              </Grid>
            ))
          : renderPlaceHolderForNoIdeas()}
      </Grid>
      <Button
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => handleChoose()}
      >
        {t('PROPOSE_NEW_IDEA')}
      </Button>
    </>
  );
};

export default ResponseChoose;
