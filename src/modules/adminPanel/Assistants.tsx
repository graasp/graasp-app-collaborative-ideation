import { FC, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LoadingButton } from '@mui/lab';
import Stack from '@mui/material/Stack';

import { ResponseAppData } from '@/config/appDataTypes';
import {
  promptForSingleResponse,
  promptForSingleResponseAndProvideResponses,
} from '@/config/prompts';
import useChatbot from '@/hooks/useChatbot';

import { useActivityContext } from '../context/ActivityContext';
import { useSettings } from '../context/SettingsContext';

const Assistants: FC = () => {
  const { t } = useTranslation();
  const { assistantsResponsesSets, round, postResponse } = useActivityContext();
  const { promptAssistant } = useChatbot();

  const { assistants: assistantsSetting, instructions } = useSettings();
  const { assistants } = assistantsSetting;
  const promiseGenerate =
    useRef<Promise<void | Promise<ResponseAppData | undefined>[]>>();

  const [isLoading, setIsLoading] = useState(false);

  const promptAllAssistants = async (): Promise<
    Promise<ResponseAppData | undefined>[]
  > => {
    const responsesAssistants = assistants
      .map((persona) => {
        const assistantSet = assistantsResponsesSets.find(
          (set) =>
            set.data.assistant === persona.id && set.data.round === round - 1,
        );
        if (assistantSet) {
          const responses = assistantSet.data.responses.map((r) => r.response);
          return promptAssistant(
            persona,
            promptForSingleResponseAndProvideResponses(
              instructions.title.content,
              responses,
              t,
            ),
          );
        }
        return promptAssistant(
          persona,
          promptForSingleResponse(instructions.title.content, t),
        );
      })
      .map((promise) =>
        promise.then((assistantResponseAppData) => {
          if (assistantResponseAppData) {
            const response = assistantResponseAppData.data.completion;
            return postResponse({
              response,
              round,
              bot: true,
            });
          }
          return assistantResponseAppData;
        }),
      );

    return responsesAssistants;
  };

  const handleGenerateResponsesWithAssistants = (): void => {
    setIsLoading(true);
    promiseGenerate.current = promptAllAssistants().then(() => {
      setIsLoading(false);
    });
  };

  return (
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="flex-start"
      spacing={1}
      width="100%"
    >
      <LoadingButton
        loading={isLoading}
        onClick={handleGenerateResponsesWithAssistants}
        loadingIndicator="Loading…"
      >
        Generate responses with assistants
      </LoadingButton>
    </Stack>
  );
};

export default Assistants;
