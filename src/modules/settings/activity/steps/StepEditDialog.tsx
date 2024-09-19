import { ActivityStep, ActivityType } from '@/interfaces/interactionProcess';
import SaveButton from '@/modules/common/SaveButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { ChangeEvent, FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EvaluationType, EvaluationParameters } from '@/interfaces/evaluation';
import CancelButton from '@/modules/common/CancelButton';
import EvaluationSettings from './evaluation/EvaluationSettings';
import ResultsSettings from './results/ResultsSettings';

interface StepEditDialogProps {
  open: boolean;
  onSave: () => void;
  onCancel: () => void;
  step: ActivityStep;
  onChange: (newStep: ActivityStep) => void;
}

const StepEditDialog: FC<StepEditDialogProps> = ({
  open,
  onSave,
  onCancel,
  step,
  onChange,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation('translations');
  const { type, time, evaluationType, evaluationParameters, resultsType } =
    step;

  const [timeBuffer, setTimeBuffer] = useState<string>('0');
  const [errorTime, setErrorTime] = useState(false);

  useEffect(() => {
    if (time) {
      setTimeBuffer(time.toString(10));
    }
  }, [time]);

  const renderStepDescription = (activityType: ActivityType): string => {
    // TODO: Translate
    switch (activityType) {
      case ActivityType.Collection:
        return 'In this step, participants will share their responses in the app.';
      case ActivityType.Evaluation:
        return 'During an evaluation activity, participants can evaluate the responses.';
      case ActivityType.Results:
        return 'In this step, participants will share their responses in the app.';
      default:
        return 'No activity type has been defined.';
    }
  };

  const handleEvaluationSettingsChange = (
    newEvaluationType: EvaluationType,
    newEvaluationParameters: EvaluationParameters,
  ): void => {
    onChange({
      ...step,
      evaluationType: newEvaluationType,
      evaluationParameters: newEvaluationParameters,
    });
  };

  const handleResultsSettingsChange = (
    newResultsType: EvaluationType,
  ): void => {
    onChange({
      ...step,
      resultsType: newResultsType,
    });
  };

  const renderActivitySettings = (
    activityType: ActivityType,
  ): JSX.Element | null => {
    switch (activityType) {
      case ActivityType.Collection:
        return null;
      case ActivityType.Evaluation:
        return (
          <>
            <Divider />
            <EvaluationSettings
              evaluationType={evaluationType}
              evaluationParameters={evaluationParameters}
              onChange={handleEvaluationSettingsChange}
            />
          </>
        );
      case ActivityType.Results:
        return (
          <>
            <Divider />
            <ResultsSettings
              resultsType={resultsType}
              onChange={handleResultsSettingsChange}
            />
          </>
        );
      default:
        return null;
    }
  };

  const handleChangeType = (event: SelectChangeEvent<ActivityType>): void => {
    const newType = event.target.value as ActivityType;
    onChange({
      ...step,
      type: newType,
    });
  };

  const handleTimeChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const newTimeStr = event.target.value;
    setTimeBuffer(newTimeStr);
    const newTime = parseInt(newTimeStr, 10);
    if (Number.isNaN(newTime)) {
      setErrorTime(true);
    } else {
      setErrorTime(false);
      onChange({
        ...step,
        time: newTime,
      });
    }
  };
  return (
    <Dialog open={open}>
      <DialogTitle>Edit the step</DialogTitle>
      <DialogContent sx={{ p: 1 }}>
        <Select value={type} label="Type" onChange={handleChangeType}>
          <MenuItem value={ActivityType.Collection}>Collection</MenuItem>
          <MenuItem value={ActivityType.Evaluation}>Evaluation</MenuItem>
          <MenuItem value={ActivityType.Results}>Results</MenuItem>
        </Select>
        <TextField
          label="Time"
          value={timeBuffer}
          onChange={handleTimeChange}
          error={errorTime}
        />
        <DialogContentText>{renderStepDescription(type)}</DialogContentText>
        {renderActivitySettings(type)}
      </DialogContent>
      <DialogActions>
        <SaveButton
          disabled={false}
          onSave={() => {
            onSave();
          }}
        />
        <CancelButton
          disabled={false}
          onCancel={() => {
            onCancel();
          }}
        />
      </DialogActions>
    </Dialog>
  );
};

export default StepEditDialog;
