import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';

import { useLocalContext } from '@graasp/apps-query-client';

import {
  AnonymousResponseData,
  AppDataTypes,
  ResponseAppData,
  ResponsesData,
  ResponsesSetAppData,
} from '@/config/appDataTypes';
import { IDEATION_VIEW_CY } from '@/config/selectors';
import useActivityState from '@/hooks/useActivityState';
import {
  ChoosePhase,
  IdeationPhases,
  InputPhase,
} from '@/interfaces/interactionProcess';
import Pausable from '@/modules/common/Pausable';
import Prompt from '@/modules/common/Prompt';
import { useAppDataContext } from '@/modules/context/AppDataContext';
import { useSettings } from '@/modules/context/SettingsContext';

import MyResponses from './MyResponses';
import PhasesStepper from './PhaseStepper';
import IdeaChoose from './ResponseChoose';
import IdeaInput from './ResponseInput';

const ResponseCollection: FC = () => {
  const { t } = useTranslation();
  const { appData, isSuccess } = useAppDataContext();
  const { memberId } = useLocalContext();
  const { orchestrator } = useSettings();
  const [chosenIdea, setChosenIdea] = useState<AnonymousResponseData>();
  const [ideas, setIdeas] = useState<ResponsesData>([]);
  const [ownIdeas, setOwnIdeas] = useState<ResponseAppData[]>([]);
  const { round } = useActivityState();
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
      const currentIdeaSet = appData.find(
        (a) =>
          a.type === AppDataTypes.ResponsesSet &&
          a.member.id === orchestrator.id,
      ) as ResponsesSetAppData;
      const ownIdeasTmp = appData.filter(
        ({ type, creator }) =>
          creator?.id === memberId && type === AppDataTypes.Response,
      ) as ResponseAppData[];
      setOwnIdeas(ownIdeasTmp);
      if (typeof currentIdeaSet !== 'undefined') {
        setIdeas(currentIdeaSet.data.responses);
      }
    }
  }, [appData, isSuccess, memberId, orchestrator]);

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
      <Container data-cy={IDEATION_VIEW_CY}>
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
          <Prompt />
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
