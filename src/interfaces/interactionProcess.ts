import { t } from 'i18next';

export enum IdeationPhases {
  Input = 1,
  Choose = 0,
  // Add = 1,
}

export enum ActivityType {
  Collection = 'collection',
  Evaluation = 'evaluation',
  Results = 'results',
}

export enum ActivityStatus {
  WaitingForStart = 'waiting-for-start',
  End = 'end',
  Pause = 'pause',
  Play = 'play',
  Input = 'input',
  Evaluate = 'evaluate',
  ShowSummary = 'show-summary',
}

export type ActivityStep = {
  type: ActivityType;
  round?: number;
  time?: number; // Time in seconds
};

export type Phase = {
  phase: number;
  label: string;
};

export const InputPhase: Phase = {
  phase: IdeationPhases.Input,
  label: t('RESPONSE_COLLECTION.STEPPER.INPUT_STEP_LABEL'),
};

export const ChoosePhase: Phase = {
  phase: IdeationPhases.Choose,
  label: t('RESPONSE_COLLECTION.STEPPER.CHOOSE_STEP_LABEL'),
};

export enum ResponseVisibilityMode {
  FullyBlind = 'fully-blind',
  PartiallyBlind = 'partially-blind',
  Open = 'open',
}
