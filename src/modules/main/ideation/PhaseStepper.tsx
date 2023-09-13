import { StepLabel } from '@mui/material';
import Step from '@mui/material/Step';
import Stepper from '@mui/material/Stepper';

import { Phase } from '@/interfaces/ideation';

const PhasesStepper = (props: {
  steps: Phase[];
  activeStep: number;
  selectStep?: (step: number) => void;
}): React.JSX.Element => {
  // TODO: remove when using the `selectStep` prop.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { activeStep, steps, selectStep } = props;
  const sortedSteps = steps.sort((a, b) => a.phase - b.phase);
  return (
    <Stepper activeStep={activeStep}>
      {sortedSteps.map((step) => (
        <Step key={step.label}>
          <StepLabel>{step.label}</StepLabel>
          {/* TODO: Add interactivity to the stepper.
          <StepButton onClick={() => selectStep && selectStep(step.phase)}>
            {step.label}
          </StepButton> */}
        </Step>
      ))}
    </Stepper>
  );
};

export default PhasesStepper;
