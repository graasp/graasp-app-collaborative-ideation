import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import isEqual from 'lodash.isequal';

import {
  ActivitySetting,
  AssistantsSetting,
  InstructionsSetting,
  OrchestratorSetting,
} from '@/config/appSettingsType';
import { useSettings } from '@/modules/context/SettingsContext';

import ResetSetsButton from '../common/ResetSetsButton';
import InstructionsSettings from './InstructionsSettings';
import OrchestratorSettings from './OrchestratorSettings';
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
  } = useSettings();

  const [instructions, setInstructions] =
    useState<InstructionsSetting>(instructionsSaved);

  const [orchestrator, setOrchestrator] =
    useState<OrchestratorSetting>(orchestratorSaved);

  const [activity, setActivity] = useState<ActivitySetting>(activitySaved);

  const [assistants, setAssistants] =
    useState<AssistantsSetting>(assistantsSaved);

  const handleSave = (): void => {
    saveSettings('instructions', instructions);
    saveSettings('orchestrator', orchestrator);
    saveSettings('activity', activity);
    saveSettings('assistants', assistants);
  };

  const isSaved = useMemo(
    () =>
      isEqual(instructions, instructionsSaved) &&
      isEqual(orchestrator, orchestratorSaved) &&
      isEqual(activity, activitySaved),
    [
      activity,
      activitySaved,
      instructions,
      instructionsSaved,
      orchestrator,
      orchestratorSaved,
    ],
  );

  return (
    <Stack width="100%" spacing={4} direction="column">
      <Typography variant="h2" fontSize="16pt">
        {t('SETTINGS.TITLE')}
      </Typography>
      <InstructionsSettings
        instructions={instructions}
        onChange={setInstructions}
      />
      <OrchestratorSettings
        orchestrator={orchestrator}
        onChange={setOrchestrator}
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
