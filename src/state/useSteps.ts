// import { useMemo } from 'react';

// import {
//   ActivityStep,
//   ResponseVisibilityMode,
// } from '@/interfaces/interactionProcess';
// import { useSettings } from '@/modules/context/SettingsContext';
// import useActivityState from '@/state/useActivityState';
// import useAssistants from '@/hooks/useAssistants';
// import useActions from '@/hooks/useActions';

// interface UseStepsValues {
//   changeStep: (newStep: ActivityStep, index: number) => void;
//   currentStep: ActivityStep | undefined;
//   nextStep: ActivityStep | undefined;
//   previousStep: ActivityStep | undefined;
//   stepIndex: number | undefined;
//   nbrOfSteps: number;
//   moveToNextStep: () => Promise<void>;
//   moveToPreviousStep: () => Promise<void>;
// }

// const useSteps = (): UseStepsValues => {
//   const { postNextStepAction, postPreviousStepAction } = useActions();
//   const { activity } = useSettings();
//   const { steps, mode } = activity;

//   // At runtime, steps may be undefined.
//   const nbrOfSteps = steps?.length || 0;


//   const moveToNextStep = async (): Promise<void> => {
//     if (typeof nextStep === 'undefined') {
//       return;
//     }

//     const nextStepIndex = (stepIndex ?? 0) + 1;

//     if (
//       (nextStep?.round || 0) > round &&
//       mode !== ResponseVisibilityMode.Sync
//     ) {
//       // TODO: Insane amount of work here. REFACTOR!
//       await generateResponsesWithEachAssistant()
//         .then((p) => Promise.all(p))
//         .then(() => {
//           changeStep(nextStep, nextStepIndex);
//         });
//     } else {
//       changeStep(nextStep, nextStepIndex);
//     }
//     postNextStepAction(nextStep, nextStepIndex);
//   };

//   const moveToPreviousStep = async (): Promise<void> => {
//     if (typeof previousStep !== 'undefined') {
//       const previousStepIndex = (stepIndex ?? 1) - 1;
//       changeStep(previousStep, previousStepIndex);
//       postPreviousStepAction(previousStep, previousStepIndex);
//     }
//   };

//   return {
//     changeStep,
//     currentStep,
//     nextStep,
//     previousStep,
//     nbrOfSteps,
//     stepIndex,
//     moveToNextStep,
//     moveToPreviousStep,
//   };
// };

// export default useSteps;
