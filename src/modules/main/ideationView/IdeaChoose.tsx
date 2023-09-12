import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Alert, Grid, Typography } from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';
import { Button, Loader } from '@graasp/ui';

import { List, Set } from 'immutable';

import { IdeasData, RatingsAppData } from '@/config/appDataTypes';
import { NUMBER_OF_IDEAS_TO_SHOW } from '@/config/constants';
import { IdeationMode } from '@/interfaces/ideation';
import { NoveltyRelevanceRatings } from '@/interfaces/ratings';
import Idea from '@/modules/common/Idea';
import { useAppDataContext } from '@/modules/context/AppDataContext';
import { useSettings } from '@/modules/context/SettingsContext';

const IdeaChoose: FC<{
  ideas: IdeasData;
  onChoose: (id: string) => void;
}> = ({ ideas, onChoose }) => {
  const { t } = useTranslation();
  const { appData, isSuccess, isLoading, invalidateAppData } =
    useAppDataContext();
  const { memberId } = useLocalContext();
  const { mode: ideationMode } = useSettings();
  const { mode } = ideationMode;
  const numberOfIdeasToShow = NUMBER_OF_IDEAS_TO_SHOW;
  const [completeIdeas, setCompleteIdeas] = useState(Set<string>([]));
  const [selectedIdeas, setSelectedIdeas] = useState<IdeasData>();
  const ideasIds = useMemo(
    () => selectedIdeas?.map((i) => i.id).toSet(),
    [selectedIdeas],
  );

  const ownIdeasIds = useMemo(
    () =>
      appData
        .filter(({ creator }) => creator?.id === memberId)
        .map(({ id }) => id),
    [appData, memberId],
  );

  useEffect(() => {
    if (isSuccess && typeof selectedIdeas === 'undefined') {
      if (mode === IdeationMode.PartiallyBlind) {
        const ratings = appData.filter(
          ({ type, creator }) => type === 'ratings' && creator?.id === memberId,
        ) as List<RatingsAppData<NoveltyRelevanceRatings>> | undefined;
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
  ]);

  const [ready, setReady] = useState(false);

  const handleRatingsChange = useCallback(
    (
      id: string,
      ideaRatings: { [key: string]: number },
      isComplete?: boolean,
    ): void => {
      const newCompleteIdeasSet = isComplete
        ? completeIdeas.add(id)
        : completeIdeas;

      if (ideasIds?.equals(newCompleteIdeasSet)) {
        setReady(true);
      }
      setCompleteIdeas(newCompleteIdeasSet);
    },
    [completeIdeas, ideasIds],
  );

  const handleChoose = (id: string): void => {
    if (ready) {
      onChoose(id);
    } else {
      // TODO: Show alert.
      // eslint-disable-next-line no-console
      console.warn('No ratings were provided.');
    }
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
      <Grid container spacing={4}>
        {selectedIdeas
          ? selectedIdeas.map((idea) => (
              <Grid key={idea.id} item>
                <Idea
                  key={idea.id}
                  idea={idea}
                  onSelect={handleChoose}
                  onRatingsChange={(newRatings, isComplete) =>
                    handleRatingsChange(idea.id, newRatings, isComplete)
                  }
                  enableBuildAction={ready}
                />
              </Grid>
            ))
          : renderPlaceHolderForNoIdeas()}
      </Grid>
    </>
  );
};

export default IdeaChoose;
