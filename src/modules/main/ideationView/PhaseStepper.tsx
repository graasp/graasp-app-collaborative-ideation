import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Stepper from '@mui/material/Stepper';

import { Phase } from '@/interfaces/ideation';

const PhasesStepper = (props: {
  steps: Phase[];
  activeStep: number;
  selectStep?: (step: number) => void;
}): React.JSX.Element => {
  const { activeStep, steps, selectStep } = props;
  const sortedSteps = steps.sort((a, b) => a.phase - b.phase);
  return (
    <Stepper activeStep={activeStep}>
      {sortedSteps.map((step) => (
        <Step key={step.label}>
          <StepButton onClick={() => selectStep && selectStep(step.phase)}>
            {step.label}
          </StepButton>
        </Step>
      ))}
    </Stepper>
  );
};

export default PhasesStepper;
