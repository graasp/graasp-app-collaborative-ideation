import { StepButton } from '@mui/material';
import Step from '@mui/material/Step';
import Stepper from '@mui/material/Stepper';

import { Phase } from '@/interfaces/activity_state';

const PhasesStepper = (props: {
  steps: Phase[];
  activeStep: number;
  selectStep?: (step: number) => void;
}): React.JSX.Element => {
  const { activeStep, steps, selectStep } = props;
  const sortedSteps = steps.sort((a, b) => a.phase - b.phase);
  return (
    <Stepper nonLinear activeStep={activeStep}>
      {sortedSteps.map((step) => (
        <Step key={step.label}>
          {/* <StepLabel>{step.label}</StepLabel> */}
          {/* TODO: Add interactivity to the stepper. */}
          <StepButton onClick={() => selectStep && selectStep(step.phase)}>
            {step.label}
          </StepButton>
        </Step>
      ))}
    </Stepper>
  );
};

export default PhasesStepper;
