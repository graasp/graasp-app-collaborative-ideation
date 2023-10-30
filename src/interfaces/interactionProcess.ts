import { t } from 'i18next';

export enum IdeationPhases {
  Input = 1,
  Choose = 0,
  // Add = 1,
}

export enum ProcessState {
  WaitingForStart = 'waiting-for-start',
  End = 'end',
  Pause = 'pause',
  Play = 'play',
  Input = 'input',
  Evaluate = 'evaluate',
  ShowSummary = 'show-summary',
}

export type Phase = {
  phase: number;
  label: string;
};

export const InputPhase: Phase = {
  phase: IdeationPhases.Input,
  label: t('SUBMIT_NEW_IDEA_STEP_TITLE'),
};

export const ChoosePhase: Phase = {
  phase: IdeationPhases.Choose,
  label: t('READ_IDEAS_STEP_TITLE'),
};

export enum ResponseVisibilityMode {
  FullyBlind = 'fully-blind',
  PartiallyBlind = 'partially-blind',
  Open = 'open',
}
