import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';

import { useLocalContext } from '@graasp/apps-query-client';
import { Loader } from '@graasp/ui';

import { List } from 'immutable';

import {
  AnonymousIdeaData,
  IdeaAppData,
  IdeaSetAppData,
  IdeasData,
} from '@/config/appDataTypes';
import { IDEATION_VIEW_CY } from '@/config/selectors';
import { ChoosePhase, IdeationPhases, InputPhase } from '@/interfaces/ideation';
import Challenge from '@/modules/common/Challenge';
import { useAppDataContext } from '@/modules/context/AppDataContext';
import { showNewIdeas } from '@/utils/ideas';

import IdeaChoose from './IdeaChoose';
import IdeaInput from './IdeaInput';
import PhasesStepper from './PhaseStepper';

const IdeationView: FC = () => {
  const { t } = useTranslation();
  const { appData } = useAppDataContext();
  const { memberId } = useLocalContext();
  const [chosenIdea, setChosenIdea] = useState<AnonymousIdeaData>();
  const [ideas, setIdeas] = useState<IdeasData>();
  const [round, setRound] = useState<number>(1);
  const [phase, setPhase] = useState<number>(IdeationPhases.Input);
  const [listOfSeenIdeas, setListOfSeenIdeas] = useState<List<string>>(
    List([]),
  );
  const [seenIdeas, setSeenIdeas] = useState<IdeasData>(List([]));

  console.debug('Render ideation view with phase ', phase);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ): void => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  useEffect(() => {
    const currentIdeaSet = appData.find(
      (a) => a.type === 'idea-set',
    ) as IdeaSetAppData;
    if (typeof currentIdeaSet !== 'undefined') {
      setIdeas(currentIdeaSet.data.ideas);
    }
  }, [appData]);

  const challenge =
    'How might we design an online platform for efficiently building, sharing, and using open educational resources?';

  const handleChoose = (id: string): void => {
    const idea = ideas?.find((i) => i.id === id) as
      | AnonymousIdeaData
      | undefined;
    if (typeof idea !== 'undefined') {
      setChosenIdea(idea);
      setPhase(IdeationPhases.Input);
    }
    const tmpSeenIds = seenIdeas.map(({ id: ID }) => ID);
    setListOfSeenIdeas(listOfSeenIdeas.merge(tmpSeenIds));
  };

  const handleSubmission = (): void => {
    // Ideation done!
    // eslint-disable-next-line no-console
    console.info('Ideation done.');
    setOpenSnackbar(true);
    setPhase(IdeationPhases.Choose);
  };

  const getIdeasToShow = (i: IdeasData): IdeasData => {
    const ideasToShow = showNewIdeas(i, 3, listOfSeenIdeas, 1);
    // setSeenIdeas(ideasToShow);
    return ideasToShow;
  };

  const renderPhaseOfIdeation = (): React.JSX.Element | null => {
    if (phase === IdeationPhases.Input)
      return (
        <IdeaInput
          currentRound={round}
          parent={chosenIdea}
          onSubmitted={handleSubmission}
        />
      );
    if (phase === IdeationPhases.Choose)
      if (typeof ideas !== 'undefined')
        return (
          <IdeaChoose ideas={getIdeasToShow(ideas)} onChoose={handleChoose} />
        );
      else setPhase(IdeationPhases.Input);
    if (phase === IdeationPhases.Wait) return <Loader />;

    return null;
  };

  return (
    <Container data-cy={IDEATION_VIEW_CY}>
      <Stack
        direction="column"
        alignItems="flex-start"
        justifyContent="space-between"
        height="100%"
        spacing={4}
      >
        {ideas && ideas.size > 1 && (
          <PhasesStepper
            activeStep={phase}
            steps={[InputPhase, ChoosePhase]}
            // selectStep={(newPhase: number) => setPhase(newPhase)}
          />
        )}
        <Challenge>{challenge}</Challenge>
        {renderPhaseOfIdeation()}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{ width: '100%' }}
          >
            {t('IDEA_SUBMITTED_SUCCESS')}
          </Alert>
        </Snackbar>
      </Stack>
    </Container>
  );
};

export default IdeationView;
