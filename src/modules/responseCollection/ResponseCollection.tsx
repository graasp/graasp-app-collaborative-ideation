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

const ResponseCollection: FC = () => {
  const { t } = useTranslation();
  const { appData, isSuccess } = useAppDataContext();
  const { myResponsesSets, myResponses, round } = useActivityContext();
  const { memberId } = useLocalContext();
  const { orchestrator } = useSettings();
  const [chosenIdea, setChosenIdea] = useState<AnonymousResponseData>();
  const [ideas, setIdeas] = useState<ResponsesData>([]);
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
    }
    setPhase(IdeationPhases.Input);
  };

  const handleSubmission = (): void => {
    // Ideation done!
    setOpenSnackbar(true);
    setPhase(IdeationPhases.Choose);
  };

  const renderPhaseOfIdeation = (): React.JSX.Element | null => {
    if (phase === IdeationPhases.Choose && ownIdeas.length > 0) {
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
          {ideas && ideas.length > 1 && (
            <PhasesStepper
              activeStep={phase}
              steps={[InputPhase, ChoosePhase]}
              // selectStep={(newPhase: number) => setPhase(newPhase)}
            />
          )}
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
