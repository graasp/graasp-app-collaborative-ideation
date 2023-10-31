import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Autocomplete,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { Button } from '@graasp/ui';

import { hooks } from '@/config/queryClient';
import { ResponseVisibilityMode } from '@/interfaces/interactionProcess';
import { useMembersContext } from '@/modules/context/MembersContext';
import { useSettings } from '@/modules/context/SettingsContext';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SettingsProps {}

const Settings: FC<SettingsProps> = () => {
  const { t } = useTranslation();
  const { data: appContext } = hooks.useAppContext();
  const { saveSettings, prompt, orchestrator, mode } = useSettings();

  const members = useMembersContext();
  const [promptContent, setPromptContent] = useState(prompt.content);
  const [orchestratorId, setOrchestratorId] = useState(
    orchestrator.id.length === 0 ? appContext?.creator?.id : orchestrator.id,
  );
  const [modeState, setModeState] = useState(mode.mode);
  const handleSave = (): void => {
    saveSettings('prompt', {
      content: promptContent,
      type: 'plain-text',
    });
    saveSettings('orchestrator', {
      id: orchestratorId || '',
    });
    saveSettings('mode', {
      mode: modeState,
    });
  };

  return (
    <Stack width="100%" spacing={4} direction="column">
      <Typography variant="h3" fontSize="16pt">
        {t('SETTINGS_TITLE')}
      </Typography>
      <FormGroup>
        <TextField
          value={promptContent}
          onChange={(e) => setPromptContent(e.target.value)}
          helperText={t('HELPER_PROMPT_SETTING')}
          multiline
          label={t('LABEL_PROMPT_SETTING')}
        />
      </FormGroup>
      <FormGroup>
        <Autocomplete
          options={members.map((member) => member.id).toArray()}
          getOptionLabel={(option) =>
            members.find(({ id }) => id === option)?.name || ''
          }
          value={orchestratorId}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Select the orchestrator of the activity"
            />
          )}
          onChange={(_e, value) => setOrchestratorId(value || '')}
        />
      </FormGroup>
      <FormControl>
        <FormLabel>Ideation mode</FormLabel>
        <RadioGroup
          aria-labelledby="ideation-mode-radio-button"
          defaultValue={ResponseVisibilityMode.Open}
          value={modeState}
          name="radio-buttons-group"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setModeState(
              (event.target as HTMLInputElement)
                .value as ResponseVisibilityMode,
            );
          }}
        >
          <FormControlLabel
            value={ResponseVisibilityMode.Open}
            control={<Radio />}
            label="Open (brainstorming)"
          />
          <FormControlLabel
            value={ResponseVisibilityMode.PartiallyBlind}
            control={<Radio />}
            label="Partially blind (brainwriting)"
          />
          <FormControlLabel
            value={ResponseVisibilityMode.FullyBlind}
            control={<Radio />}
            label="Fully blind (individual ideation)"
            disabled
          />
        </RadioGroup>
      </FormControl>
      <Button onClick={handleSave}>{t('SAVE')}</Button>
    </Stack>
  );
};

export default Settings;
