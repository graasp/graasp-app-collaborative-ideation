import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
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

interface IdeaChooseProps {
  ideas: IdeasData;
  onChoose: (id?: string) => void;
}

const IdeaChoose: FC<IdeaChooseProps> = ({ ideas, onChoose }) => {
  const { t } = useTranslation();
  const { appData, isSuccess, isLoading, invalidateAppData } =
    useAppDataContext();
  const { memberId } = useLocalContext();
  const { mode: ideationMode } = useSettings();
  const { mode } = ideationMode;
  const numberOfIdeasToShow = NUMBER_OF_IDEAS_TO_SHOW;
  // const [completeIdeas, setCompleteIdeas] = useState(Set<string>([]));
  const [selectedIdeas, setSelectedIdeas] = useState<IdeasData>();
  const [ready, setReady] = useState(false);
  const ideasIds = useMemo(
    () => selectedIdeas?.map((i) => i.id).toSet(),
    [selectedIdeas],
  );

  const ownIdeasIds = useMemo(
    () =>
      appData
        .filter(
          ({ creator, type }) => creator?.id === memberId && type === 'idea',
        )
        .map(({ id }) => id),
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
    const newCompleteIdeasSet =
      ratings
        ?.filter(
          ({ data }) =>
            typeof data.ratings.novelty === 'number' &&
            typeof data.ratings.relevance === 'number',
        )
        .map(({ data }) => data.ideaRef)
        .toSet() || Set<string>([]);
    if (ideasIds?.equals(newCompleteIdeasSet)) {
      setReady(true);
    }
    // setCompleteIdeas(newCompleteIdeasSet);
  }, [ideasIds, ratings]);

  useEffect(() => {
    if (isSuccess && typeof selectedIdeas === 'undefined') {
      if (mode === IdeationMode.PartiallyBlind) {
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

  // const handleRatingsChange = useCallback(
  //   (
  //     id: string,
  //     ideaRatings: { [key: string]: number },
  //     isComplete?: boolean,
  //   ): void => {
  //     const newCompleteIdeasSet = isComplete
  //       ? completeIdeas.add(id)
  //       : completeIdeas;

  //     if (ideasIds?.equals(newCompleteIdeasSet)) {
  //       setReady(true);
  //     }
  //     setCompleteIdeas(newCompleteIdeasSet);
  //   },
  //   [completeIdeas, ideasIds],
  // );

  const handleChoose = (id?: string): void => {
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
      <Grid container spacing={2}>
        {selectedIdeas
          ? selectedIdeas.map((idea) => (
              <Grid key={idea.id} item md={4} sm={6} xs={12}>
                <Idea
                  key={idea.id}
                  idea={idea}
                  onSelect={handleChoose}
                  // onRatingsChange={(newRatings, isComplete) =>
                  //   handleRatingsChange(idea.id, newRatings, isComplete)
                  // }
                  enableBuildAction={ready}
                />
              </Grid>
            ))
          : renderPlaceHolderForNoIdeas()}
      </Grid>
      <Button
        startIcon={<AddCircleOutlineIcon />}
        disabled={!ready}
        onClick={() => handleChoose()}
      >
        {t('PROPOSE_NEW_IDEA')}
      </Button>
    </>
  );
};

export default IdeaChoose;
