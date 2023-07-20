import { FC, useEffect, useState } from 'react';

import {
  Container,
  Stack,
  Step,
  StepButton,
  Stepper,
  Typography,
} from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';
import { Loader } from '@graasp/ui';

import {
  CurrentStateAppData,
  Derivation,
  IdeaAppData,
  IdeaSetAppData,
  IdeasData,
} from '@/config/appDataTypes';
import { IDEATION_VIEW_CY } from '@/config/selectors';
import { useAppDataContext } from '@/modules/context/AppDataContext';

import IdeaAdd from './IdeaAdd';
import IdeaChoose from './IdeaChoose';
import IdeaInput from './IdeaInput';

enum IdeationPhases {
  Input = 2,
  Choose = 0,
  Add = 1,
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

const AddPhase: Phase = {
  phase: IdeationPhases.Add,
  label: 'Add',
};

const ChoosePhase: Phase = {
  phase: IdeationPhases.Choose,
  label: 'Choose',
};

const getPhases = (nbrIdeas: number | undefined): Array<Phase> => {
  if (typeof nbrIdeas === 'undefined') return [InputPhase];
  if (nbrIdeas < 1) return [InputPhase];
  if (nbrIdeas < 2) return [AddPhase, InputPhase];

  return [ChoosePhase, AddPhase, InputPhase];
};

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
  const [derivation, setDerivation] = useState<Derivation>();
  const [ideas, setIdeas] = useState<IdeasData>();
  const [round, setRound] = useState<number>(1); // To be taken as prop.
  const phases = getPhases(ideas?.size);
  const [phase, setPhase] = useState<number>(phases[0].phase);

  const currentState = appData.find(
    (a) => a.type === 'current-state',
  ) as CurrentStateAppData;

  useEffect(() => {
    if (typeof currentState !== 'undefined') {
      setRound(currentState.data.round);
    }
  }, [currentState]);

  const currentIdeaSet = appData.find(
    (a) =>
      a.member.id === memberId &&
      a.type === 'idea-set' &&
      a.data.round === round,
  ) as IdeaSetAppData;

  useEffect(() => {
    if (typeof currentIdeaSet !== 'undefined') {
      setIdeas(currentIdeaSet.data.ideas);
    }
  }, [currentIdeaSet]);

  const challenge = 'Lorem Ipsum?';

  const handleChoose = (id: string): void => {
    const idea = appData.find((i) => i.id === id && i.type === 'idea') as
      | IdeaAppData
      | undefined;
    if (typeof idea !== 'undefined') {
      setChosenIdea(idea);
      setPhase(IdeationPhases.Add);
    }
  };

  const handleDerivation = (d: Derivation): void => {
    setDerivation(d);
    setPhase(IdeationPhases.Input);
  };

  const handleSubmission = (): void => {
    // Ideation done!
    // eslint-disable-next-line no-console
    console.info('Ideation done.');
    setPhase(IdeationPhases.Wait);
  };

  const renderPhaseOfIdeation = (): React.JSX.Element | null => {
    if (phase === IdeationPhases.Input)
      return (
        <IdeaInput
          currentRound={round}
          derivation={derivation}
          refIdea={chosenIdea}
          onSubmitted={handleSubmission}
        />
      );
    if (phase === IdeationPhases.Choose)
      if (typeof ideas !== 'undefined')
        return <IdeaChoose ideas={ideas} onChoose={handleChoose} />;
      else setPhase(IdeationPhases.Input);
    if (phase === IdeationPhases.Add && chosenIdea)
      return (
        <IdeaAdd idea={chosenIdea} onDerivationChoose={handleDerivation} />
      );
    if (phase === IdeationPhases.Wait) return <Loader />;
    setPhase(IdeationPhases.Choose);

    return null;
  };

  return (
    <Container data-cy={IDEATION_VIEW_CY}>
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="space-between"
        height="100%"
        spacing={4}
      >
        {/* Turn to component */}
        <Typography variant="h3">{challenge}</Typography>
        {renderPhaseOfIdeation()}
        {ideas && ideas.size > 1 && (
          <PhasesStepper
            activeStep={phase}
            steps={phases}
            selectStep={(newPhase: number) => setPhase(newPhase)}
          />
        )}
      </Stack>
    </Container>
  );
};

export default IdeationView;
