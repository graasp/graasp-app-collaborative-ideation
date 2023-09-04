import { FC, useEffect, useState } from 'react';

import {
  Box,
  Container,
  Stack,
  Step,
  StepButton,
  Stepper,
  Typography,
} from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';
import { Loader } from '@graasp/ui';

import { List } from 'immutable';

import { IdeaAppData, IdeaSetAppData, IdeasData } from '@/config/appDataTypes';
import { IDEATION_VIEW_CY } from '@/config/selectors';
import { useAppDataContext } from '@/modules/context/AppDataContext';
import { showNewIdeas } from '@/utils/ideas';

import IdeaChoose from './IdeaChoose';
import IdeaInput from './IdeaInput';

enum IdeationPhases {
  Input = 2,
  Choose = 0,
  // Add = 1,
  Wait = 3,
}

type Phase = {
  phase: number;
  label: string;
};

const InputPhase: Phase = {
  phase: IdeationPhases.Input,
  label: 'Input',
};

// const AddPhase: Phase = {
//   phase: IdeationPhases.Add,
//   label: 'Add',
// };

const ChoosePhase: Phase = {
  phase: IdeationPhases.Choose,
  label: 'Choose',
};

// const getPhases = (nbrIdeas: number | undefined): Array<Phase> => {
//   if (typeof nbrIdeas === 'undefined') return [InputPhase];
//   if (nbrIdeas < 1) return [InputPhase];
//   if (nbrIdeas < 2) return [AddPhase, InputPhase];

//   return [ChoosePhase, AddPhase, InputPhase];
// };

const PhasesStepper = (props: {
  steps: Phase[];
  activeStep: number;
  selectStep: (step: number) => void;
}): React.JSX.Element => {
  const { activeStep, steps, selectStep } = props;
  const sortedSteps = steps.sort((a, b) => a.phase - b.phase);
  return (
    <Stepper activeStep={activeStep}>
      {sortedSteps.map((step) => (
        <Step key={step.label}>
          <StepButton onClick={() => selectStep(step.phase)}>
            {step.label}
          </StepButton>
        </Step>
      ))}
    </Stepper>
  );
};

const IdeationView: FC = () => {
  const { appData } = useAppDataContext();
  const { memberId } = useLocalContext();
  const [chosenIdea, setChosenIdea] = useState<IdeaAppData>();
  const [ideas, setIdeas] = useState<IdeasData>();
  const [round, setRound] = useState<number>(1);
  const [phase, setPhase] = useState<number>(IdeationPhases.Input);
  const [listOfSeenIdeas, setListOfSeenIdeas] = useState<List<string>>(
    List([]),
  );
  const [seenIdeas, setSeenIdeas] = useState<IdeasData>(List([]));

  console.debug('Render ideation view with phase ', phase);

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
    const idea = appData.find((i) => i.id === id && i.type === 'idea') as
      | IdeaAppData
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
          parent={
            chosenIdea ? { ...chosenIdea.data, id: chosenIdea?.id } : undefined
          }
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
        {/* Turn to component */}
        <Box component="span">
          <Typography sx={{ fontSize: '18pt' }} variant="h3">
            Ideation
          </Typography>
          <Typography>Round {round}</Typography>
        </Box>
        <Typography sx={{ fontSize: '18pt' }} variant="h4">
          {challenge}
        </Typography>
        {renderPhaseOfIdeation()}
        {ideas && ideas.size > 1 && (
          <PhasesStepper
            activeStep={phase}
            steps={[InputPhase, ChoosePhase]}
            selectStep={(newPhase: number) => setPhase(newPhase)}
          />
        )}
      </Stack>
    </Container>
  );
};

export default IdeationView;
