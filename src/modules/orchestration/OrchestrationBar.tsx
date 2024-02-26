import { FC, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { PLAY_PAUSE_BUTTON_CY } from '@/config/selectors';
import { ActivityStatus, ActivityType } from '@/interfaces/interactionProcess';

import { useActivityContext } from '../context/ActivityContext';
import NextStepButton from './NextStepButton';

interface OrchestrationBarProps {
  onChange?: (state: ActivityStatus) => void;
}

const OrchestrationBar: FC<OrchestrationBarProps> = () => {
  const { t } = useTranslation('translations', {
    keyPrefix: 'ORCHESTRATION_BAR',
  });
  const { round, activityState, changeActivity, pauseActivity, playActivity } =
    useActivityContext();
  const { activity } = activityState.data;
  const { status } = activityState.data;

  const handleActivityChange = (
    _event: MouseEvent,
    value: ActivityType,
  ): void => {
    if (value !== null) {
      changeActivity(value);
    }
  };
  return (
    <Paper variant="outlined" elevation={1} sx={{ p: 1 }}>
      {status === ActivityStatus.Play ? (
        <IconButton onClick={() => pauseActivity()}>
          <PauseCircleOutlineIcon />
        </IconButton>
      ) : (
        <IconButton
          onClick={() => playActivity()}
          data-cy={PLAY_PAUSE_BUTTON_CY}
        >
          <PlayCircleOutlineIcon />
        </IconButton>
      )}
      <Typography variant="caption">{t('ROUND_HELPER', { round })}</Typography>
      <NextStepButton enable />
    </Paper>
  );
};

export default OrchestrationBar;

// <>
//      <SectionTitle>{t('ADMIN_PANEL.CONTROLS.TITLE')}</SectionTitle>
//       <Collapse in={stateWarning}>
//         <Chip
//           color="warning"
//           icon={<WarningIcon />}
//           label="State is duplicated"
//         />
//       </Collapse>
//       <Stack
//         direction="column"
//         alignItems="center"
//         justifyContent="flex-start"
//         spacing={1}
//         width="100%"
//       >
//         <ToggleButtonGroup
//           orientation="vertical"
//           value={activity}
//           exclusive
//           onChange={handleActivityChange}
//         >
//           <ToggleButton
//             value={ActivityType.Collection}
//             aria-label={t('ADMIN_PANEL.CONTROLS.RESPONSE_COLLECTION_BUTTON')}
//           >
//             <InputIcon sx={{ mr: 1 }} />
//             {t('ADMIN_PANEL.CONTROLS.RESPONSE_COLLECTION_BUTTON')}
//           </ToggleButton>
//           <ToggleButton
//             value={ActivityType.Evaluation}
//             aria-label={t('ADMIN_PANEL.CONTROLS.EVALUATION_BUTTON')}
//           >
//             <ThumbsUpDownIcon sx={{ mr: 1 }} />
//             {/* Alternatives: */}
//             {/* <PollIcon sx={{ mr: 1 }} /> */}
//             {/* <HowToVoteIcon sx={{ mr: 1 }} /> */}
//             {t('ADMIN_PANEL.CONTROLS.EVALUATION_BUTTON')}
//           </ToggleButton>
//           <ToggleButton
//             value={ActivityType.Results}
//             aria-label={t('ADMIN_PANEL.CONTROLS.RESULTS_BUTTON')}
//             disabled
//           >
//             <PollIcon sx={{ mr: 1 }} />
//             {t('ADMIN_PANEL.CONTROLS.RESULTS_BUTTON')}
//             <Chip
//               disabled
//               variant="outlined"
//               color="warning"
//               size="small"
//               label="Under development"
//               sx={{
//                 maxWidth: '10em',
//                 height: 'auto',
//                 '& .MuiChip-label': {
//                   display: 'block',
//                   whiteSpace: 'normal',
//                 },
//               }}
//             />
//             {/* git commit -m "fix: disable results button" */}
//           </ToggleButton>
//         </ToggleButtonGroup>
//         <Paper variant="outlined" elevation={1} sx={{ p: 1 }}>
//           {status === ActivityStatus.Play ? (
//             <IconButton onClick={() => pauseActivity()}>
//               <PauseCircleOutlineIcon />
//             </IconButton>
//           ) : (
//             <IconButton
//               onClick={() => playActivity()}
//               data-cy={PLAY_PAUSE_BUTTON_CY}
//             >
//               <PlayCircleOutlineIcon />
//             </IconButton>
//           )}
//           <Typography variant="caption">
//             {t('ADMIN_PANEL.CONTROLS.ROUND_HELPER', { round })}
//           </Typography>
//           <NextRoundButton enable />
//         </Paper>
//       </Stack>
//     </>
