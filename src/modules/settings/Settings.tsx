import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import isEqual from 'lodash.isequal';

import { version } from '@/../package.json';
import {
  ActivitySetting,
  AssistantsSetting,
  InstructionsSetting,
  NotParticipatingSetting,
  OrchestratorSetting,
} from '@/config/appSettingsType';
import { SETTINGS_VIEW_CY } from '@/config/selectors';
import { useSettings } from '@/modules/context/SettingsContext';

import ResetSetsButton from '../common/ResetSetsButton';
import InstructionsSettings from './InstructionsSettings';
import OrchestratorSettings from './OrchestratorSettings';
import ParticipantsSettings from './ParticipantsSettings';
import ActivitySettings from './activity/ActivitySettings';
import Assistant from './assistant/Assistant';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SettingsProps {}

const Settings: FC<SettingsProps> = () => {
  const { t } = useTranslation();
  const {
    saveSettings,
    instructions: instructionsSaved,
    orchestrator: orchestratorSaved,
    activity: activitySaved,
    assistants: assistantsSaved,
    notParticipating: notParticipatingSaved,
  } = useSettings();

  const [instructions, setInstructions] =
    useState<InstructionsSetting>(instructionsSaved);

  const [orchestrator, setOrchestrator] =
    useState<OrchestratorSetting>(orchestratorSaved);

  const [activity, setActivity] = useState<ActivitySetting>(activitySaved);

  const [assistants, setAssistants] =
    useState<AssistantsSetting>(assistantsSaved);

  const [notParticipating, setNotParticipating] =
    useState<NotParticipatingSetting>(notParticipatingSaved);

  const handleSave = (): void => {
    saveSettings('instructions', instructions);
    saveSettings('orchestrator', orchestrator);
    saveSettings('activity', activity);
    saveSettings('assistants', assistants);
    saveSettings('notParticipating', notParticipating);
  };

  const isSaved = useMemo(
    () =>
      isEqual(instructions, instructionsSaved) &&
      isEqual(orchestrator, orchestratorSaved) &&
      isEqual(activity, activitySaved) &&
      isEqual(assistants, assistantsSaved) &&
      isEqual(notParticipating, notParticipatingSaved),
    [
      activity,
      activitySaved,
      assistants,
      assistantsSaved,
      instructions,
      instructionsSaved,
      notParticipating,
      notParticipatingSaved,
      orchestrator,
      orchestratorSaved,
    ],
  );

  return (
    <Stack
      width="100%"
      spacing={4}
      direction="column"
      data-cy={SETTINGS_VIEW_CY}
    >
      <Typography variant="h2" fontSize="16pt">
        {t('SETTINGS.TITLE')}
      </Typography>
      <Typography variant="subtitle1">{t('VERSION', { version })}</Typography>
      <InstructionsSettings
        instructions={instructions}
        onChange={setInstructions}
      />
      <OrchestratorSettings
        orchestrator={orchestrator}
        onChange={setOrchestrator}
      />
      <ParticipantsSettings
        notParticipating={notParticipating}
        onChange={setNotParticipating}
      />
      <ActivitySettings activity={activity} onChange={setActivity} />
      <Assistant assistants={assistants} onChange={setAssistants} />
      <Box>
        <Button disabled={isSaved} onClick={handleSave}>
          {t('SAVE')}
        </Button>
        <ResetSetsButton enable />
      </Box>
    </Stack>
  );
};

export default Settings;
