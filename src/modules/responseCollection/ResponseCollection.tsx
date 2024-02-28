import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';

import { useLocalContext } from '@graasp/apps-query-client';

import {
  AnonymousResponseData,
  ResponseAppData,
  ResponsesData,
} from '@/config/appDataTypes';
import { RESPONSE_COLLECTION_VIEW_CY } from '@/config/selectors';
import useActions from '@/hooks/useActions';
import {
  ChoosePhase,
  IdeationPhases,
  InputPhase,
} from '@/interfaces/interactionProcess';
import Instructions from '@/modules/common/Instructions';
import Pausable from '@/modules/common/Pausable';
import { useAppDataContext } from '@/modules/context/AppDataContext';
import { useSettings } from '@/modules/context/SettingsContext';

import { useActivityContext } from '../context/ActivityContext';
import MyResponses from './MyResponses';
import PhasesStepper from './PhaseStepper';
import IdeaChoose from './ResponseChoose';
import IdeaInput from './ResponseInput';
import Round from '../common/Round';

const ResponseCollection: FC = () => {
  const { t } = useTranslation();
  const { appData, isSuccess } = useAppDataContext();
  const { myResponsesSets, myResponses, round } = useActivityContext();
  const { postChooseResponseAction } = useActions();
  const { memberId } = useLocalContext();
  const { orchestrator } = useSettings();
  const [chosenIdea, setChosenIdea] = useState<AnonymousResponseData>();
  const [ideas, setIdeas] = useState<ResponsesData>([]);
  // TODO: Remove
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ownIdeas, setOwnIdeas] = useState<ResponseAppData[]>([]);
  const [phase, setPhase] = useState<number>(IdeationPhases.Choose);

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
    if (phase === IdeationPhases.Choose) {
      setChosenIdea(undefined);
    }
  }, [phase]);

  useEffect(() => {
    if (isSuccess) {
      const currentIdeaSet = myResponsesSets.find(
        (a) => a.data.round === round - 1,
      );
      const ownIdeasTmp = myResponses;
      setOwnIdeas(ownIdeasTmp);
      if (typeof currentIdeaSet !== 'undefined') {
        setIdeas(currentIdeaSet.data.responses);
      }
    }
  }, [
    appData,
    isSuccess,
    memberId,
    myResponses,
    myResponsesSets,
    orchestrator,
    round,
  ]);

  const handleChoose = (id?: string): void => {
    const idea = ideas?.find((i) => i.id === id) as
      | AnonymousResponseData
      | undefined;
    if (typeof idea !== 'undefined') {
      setChosenIdea(idea);
      postChooseResponseAction(idea);
    }
    setPhase(IdeationPhases.Input);
  };

  const handleSubmission = (): void => {
    // Ideation done!
    setOpenSnackbar(true);
    setPhase(IdeationPhases.Choose);
  };

  const renderPhaseOfIdeation = (): React.JSX.Element | null => {
    // TODO: Choose what to display when starting the activity
    // if (phase === IdeationPhases.Choose && ownIdeas.length > 0) {
    if (phase === IdeationPhases.Choose) {
      return <IdeaChoose ideas={ideas} onChoose={handleChoose} />;
    }
    return (
      <IdeaInput
        currentRound={round}
        parent={chosenIdea}
        onSubmitted={handleSubmission}
      />
    );
  };

  return (
    <Pausable>
      <Container data-cy={RESPONSE_COLLECTION_VIEW_CY}>
        <Stack
          direction="column"
          alignItems="flex-start"
          justifyContent="space-between"
          height="100%"
          spacing={4}
        >
          <Stack direction="row">
            <Round round={round} />
            <PhasesStepper
              activeStep={phase}
              steps={[InputPhase, ChoosePhase]}
              selectStep={(newPhase: number) => setPhase(newPhase)}
            />
          </Stack>
          <Instructions />
          {renderPhaseOfIdeation()}
          <MyResponses />
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
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
    </Pausable>
  );
};

export default ResponseCollection;
