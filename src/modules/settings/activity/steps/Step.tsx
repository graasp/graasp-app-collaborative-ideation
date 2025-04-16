import { FC, JSX, useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import GradingIcon from '@mui/icons-material/Grading';
import HelpIcon from '@mui/icons-material/Help';
import TungstenIcon from '@mui/icons-material/Tungsten';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { ActivityStep, ActivityType } from '@/interfaces/activity_state';
import StepEditDialog from './StepEditDialog';

const getIcon = (type: ActivityType): JSX.Element => {
  switch (type) {
    case ActivityType.Collection:
      return <TungstenIcon />;
    case ActivityType.Evaluation:
      return <GradingIcon />;
    default:
      return <HelpIcon />;
  }
};

interface StepProps {
  position: number;
  onChange: (newStep: ActivityStep, position: number) => void;
  onDelete: (position: number) => void;
  onSave: () => void;
  step: ActivityStep;
}

const Step: FC<StepProps> = (props) => {
  const { position, step, onChange, onDelete, onSave } = props;
  const { type } = step;

  const [dialogOpen, setDialogOpen] = useState(false);

  const onEdit = (): void => {
    setDialogOpen(true);
  };

  const handleDelete = (): void => {
    onDelete(position);
  };

  return (
    <>
      <Paper sx={{ width: '100%', p: 1 }}>
        {getIcon(type)}
        <Typography ml={2} display="inline" variant="h3">
          {type}
        </Typography>
        <Typography display="block" variant="caption">
          Step {position + 1}
        </Typography>
        <IconButton onClick={onEdit}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </Paper>
      <StepEditDialog
        open={dialogOpen}
        onCancel={() => setDialogOpen(false)}
        onSave={() => {
          onSave();
          setDialogOpen(false);
        }}
        step={step}
        onChange={(newStep) => {
          onChange(newStep, position);
        }}
      />
    </>
  );
};

export default Step;
