import { AppDataTypes, PromptsAppData } from '@/config/appDataTypes';
import { Prompt, PromptsData } from '@/interfaces/prompt';
import { useAppDataContext } from '@/modules/context/AppDataContext';
import { useSettings } from '@/modules/context/SettingsContext';
import { useLocalContext } from '@graasp/apps-query-client';
import { AppData, AppDataVisibility } from '@graasp/sdk';
import { useEffect, useMemo, useState } from 'react';
import whatIfs from '@/config/what-ifs.json';
import { getRandomInteger } from '@/utils/utils';

const { sets } = whatIfs;

interface UsePromptsValues extends Partial<PromptsData> {
  getNewPrompt: () => void;
}

const usePrompts = (): UsePromptsValues => {
  const { appData, postAppData, patchAppData } = useAppDataContext();
  const { memberId } = useLocalContext();

  const { prompts: promptsSettings } = useSettings();
  const { selectedSet } = promptsSettings;
  const prompts = useMemo(
    () => sets.find((s) => s.id === selectedSet),
    [selectedSet],
  );

  const [currentPrompt, setCurrentPrompt] = useState<Prompt>();
  const [pastPrompts, setPastPrompts] = useState<Array<Prompt>>();
  const [currentId, setCurrentId] = useState<AppData['id']>();
  useEffect(() => {
    const promptsAppData = appData.find(
      ({ type, creator }) =>
        type === AppDataTypes.Prompts && memberId === creator?.id,
    ) as PromptsAppData;
    if (typeof promptsAppData !== 'undefined') {
      setCurrentId(promptsAppData.id);
      setCurrentPrompt(promptsAppData.data.currentPrompt);
      setPastPrompts(promptsAppData.data.pastPrompts);
    }
  }, [appData, memberId]);

  const setNewPrompt = (newPrompt: Prompt): void => {
    let newPastPrompts: Array<Prompt> = [];

    if (currentPrompt) {
      if (pastPrompts) {
        newPastPrompts = [...pastPrompts, currentPrompt];
      } else {
        newPastPrompts = [currentPrompt];
      }
    }
    const newData: PromptsData = {
      pastPrompts: newPastPrompts,
      currentPrompt: newPrompt,
    };
    if (currentId) {
      const newAppData: Pick<PromptsAppData, 'id' | 'data'> = {
        id: currentId,
        data: newData,
      };
      patchAppData(newAppData);
    } else {
      postAppData({
        data: newData,
        visibility: AppDataVisibility.Member,
        type: AppDataTypes.Prompts,
      });
    }
  };

  const getNewPrompt = (): void => {
    if (prompts) {
      const { set } = prompts;
      const maxIndex = set.length - 1;

      const newPrompt = set[getRandomInteger(0, maxIndex)];
      setNewPrompt(newPrompt);
    }
  };
  return {
    currentPrompt,
    pastPrompts,
    getNewPrompt,
  };
};

export default usePrompts;
