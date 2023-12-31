import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';

import { useLocalContext } from '@graasp/apps-query-client';

import { List } from 'immutable';

import {
  AnonymousIdeaData,
  AppDataTypes,
  IdeaAppData,
  IdeaSetAppData,
  IdeasData,
} from '@/config/appDataTypes';
import { IDEATION_VIEW_CY } from '@/config/selectors';
import { ChoosePhase, IdeationPhases, InputPhase } from '@/interfaces/ideation';
import Prompt from '@/modules/common/Prompt';
import { useAppDataContext } from '@/modules/context/AppDataContext';
import { useSettings } from '@/modules/context/SettingsContext';

import IdeaChoose from './IdeaChoose';
import IdeaInput from './IdeaInput';
import PhasesStepper from './PhaseStepper';

const IdeationProcess: FC = () => {
  const { t } = useTranslation();
  const { appData, isSuccess } = useAppDataContext();
  const { memberId } = useLocalContext();
  const { orchestrator } = useSettings();
  const [chosenIdea, setChosenIdea] = useState<AnonymousIdeaData>();
  const [ideas, setIdeas] = useState<IdeasData>(List([]));
  const [ownIdeas, setOwnIdeas] = useState<List<IdeaAppData>>(List([]));
  // TODO: Implement round counting
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [round, setRound] = useState<number>(1);
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
          a.type === AppDataTypes.IdeaSet && a.member.id === orchestrator.id,
      ) as IdeaSetAppData;
      const ownIdeasTmp = appData.filter(
        ({ type, creator }) =>
          creator?.id === memberId && type === AppDataTypes.Idea,
      ) as List<IdeaAppData>;
      setOwnIdeas(ownIdeasTmp);
      if (typeof currentIdeaSet !== 'undefined') {
        setIdeas(currentIdeaSet.data.ideas);
      }
    }
  }, [appData, isSuccess, memberId, orchestrator]);

  const handleChoose = (id?: string): void => {
    const idea = ideas?.find((i) => i.id === id) as
      | AnonymousIdeaData
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
    if (phase === IdeationPhases.Choose && ownIdeas.size > 0) {
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
        <Prompt />
        {renderPhaseOfIdeation()}
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
  );
};

export default IdeationProcess;
