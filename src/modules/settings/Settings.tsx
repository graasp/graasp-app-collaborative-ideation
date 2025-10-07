import { FC, JSX, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import isEqual from 'lodash.isequal';

import { version } from '@/../package.json';
import {
  ActivitySetting,
  AssistantsSetting,
  FeedbackSettings,
  InstructionsSetting,
  NotParticipatingSetting,
  OrchestratorSetting,
  PromptsSetting,
} from '@/config/appSettingsType';
import { SETTINGS_VIEW_CY } from '@/config/selectors';
import { useSettings } from '@/modules/context/SettingsContext';

import SaveButton from '../common/SaveButton';
import Export from './Export';
import FeedbackPromptsSettings from './FeedbackPromptsSettings';
import InstructionsSettings from './InstructionsSettings';
import OrchestratorSettings from './OrchestratorSettings';
import ParticipantsSettings from './ParticipantsSettings';
import ActivitySettings from './activity/ActivitySettings';
import Assistant from './assistant/Assistant';
import PromptsSettings from './prompts/Prompts';

type SettingsProps = unknown;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps): JSX.Element => {
  const { children, value, index, ...other } = props;

  return (
    <Box
      sx={{ p: 3, width: '100%' }}
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {children}
    </Box>
  );
};

const Settings: FC<SettingsProps> = () => {
  const { t } = useTranslation();

  const [tabIndex, setTabIndex] = useState<number>(0);

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: number,
  ): void => {
    setTabIndex(newValue);
  };

  const {
    saveSettings,
    instructions: instructionsSaved,
    orchestrator: orchestratorSaved,
    activity: activitySaved,
    assistants: assistantsSaved,
    notParticipating: notParticipatingSaved,
    prompts: promptsSaved,
    feedback: feedbackSaved,
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

  const [prompts, setPrompts] = useState<PromptsSetting>(promptsSaved);

  const [feedback, setFeedback] = useState<FeedbackSettings>(feedbackSaved);

  const handleSave = (): void => {
    saveSettings('instructions', instructions);
    saveSettings('orchestrator', orchestrator);
    saveSettings('activity', activity);
    saveSettings('assistants', assistants);
    saveSettings('notParticipating', notParticipating);
    saveSettings('prompts', prompts);
    saveSettings('feedback', feedback);
  };

  const isSaved = useMemo(
    () =>
      isEqual(instructions, instructionsSaved) &&
      isEqual(orchestrator, orchestratorSaved) &&
      isEqual(activity, activitySaved) &&
      isEqual(assistants, assistantsSaved) &&
      isEqual(notParticipating, notParticipatingSaved) &&
      isEqual(prompts, promptsSaved) &&
      isEqual(feedback, feedbackSaved),
    [
      activity,
      activitySaved,
      assistants,
      assistantsSaved,
      feedback,
      feedbackSaved,
      instructions,
      instructionsSaved,
      notParticipating,
      notParticipatingSaved,
      orchestrator,
      orchestratorSaved,
      prompts,
      promptsSaved,
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
      <Stack direction="row">
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={tabIndex}
          onChange={handleChange}
          aria-label="Vertical tabs"
          sx={{ borderRight: 1, borderColor: 'divider', width: '12em' }}
        >
          <Tab label="Instructions" />
          <Tab label="Orchestrator & Particiants" />
          <Tab label="Activity" />
          <Tab label="Creativity Triggers" />
          <Tab label="AI Feedback" />
          <Tab label="AI Peers" />
          <Tab label="Export" />
          <Box>
            <SaveButton disabled={isSaved} onSave={handleSave} />
            {/* <ResetSetsButton enable /> */}
          </Box>
        </Tabs>
        <TabPanel value={tabIndex} index={0}>
          <InstructionsSettings
            instructions={instructions}
            onChange={setInstructions}
          />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <OrchestratorSettings
            orchestrator={orchestrator}
            onChange={setOrchestrator}
          />
          <ParticipantsSettings
            notParticipating={notParticipating}
            onChange={setNotParticipating}
          />
        </TabPanel>
        <TabPanel value={tabIndex} index={2}>
          <ActivitySettings activity={activity} onChange={setActivity} />
        </TabPanel>
        <TabPanel value={tabIndex} index={3}>
          <PromptsSettings prompts={prompts} onChange={setPrompts} />
        </TabPanel>
        <TabPanel value={tabIndex} index={4}>
          <FeedbackPromptsSettings feedback={feedback} onChange={setFeedback} />
        </TabPanel>
        <TabPanel value={tabIndex} index={5}>
          <Assistant assistants={assistants} onChange={setAssistants} />
        </TabPanel>
        <TabPanel value={tabIndex} index={6}>
          <Export />
        </TabPanel>
      </Stack>
    </Stack>
  );
};

export default Settings;
