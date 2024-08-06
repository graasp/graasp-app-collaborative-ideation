import { AppDataTypes, PromptsAppData } from '@/config/appDataTypes';
import { FullPromptCategory, Prompt, PromptsData } from '@/interfaces/prompt';
import { useAppDataContext } from '@/modules/context/AppDataContext';
import { useSettings } from '@/modules/context/SettingsContext';
import { useLocalContext } from '@graasp/apps-query-client';
import { AppData, AppDataVisibility, PermissionLevel } from '@graasp/sdk';
import { useEffect, useMemo, useState } from 'react';
import whatIfs from '@/config/what-ifs.json';
import { getRandomInteger } from '@/utils/utils';
import { CATEGORY_COLORS } from '@/config/constants';

const { sets } = whatIfs;

interface UsePromptsValues extends Partial<PromptsData> {
  getNewPrompt: () => void;
  promptsReady: boolean;
  categories: Array<FullPromptCategory>;
  resetAllPrompts: () => Promise<void>;
}

const usePrompts = (): UsePromptsValues => {
  const { appData, postAppData, patchAppData, deleteAppData } =
    useAppDataContext();
  const { memberId, permission } = useLocalContext();

  const { prompts: promptsSettings } = useSettings();
  const { selectedSet } = promptsSettings;
  const prompts = useMemo(
    () => sets.find((s) => s.id === selectedSet),
    [selectedSet],
  );

  const categories: Array<FullPromptCategory> = useMemo(
    () =>
      prompts?.categories.map((category, index) =>
        typeof category === 'string'
          ? { name: category, color: CATEGORY_COLORS[index] }
          : category,
      ) || [],
    [prompts],
  );

  const promptsReady = useMemo(() => Boolean(prompts), [prompts]);

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

  const resetAllPrompts = async (): Promise<void> => {
    if (permission !== PermissionLevel.Admin) {
      throw Error(
        'You must be admin to delete all prompts data for all users.',
      );
    } else {
      const allIds = appData.filter(
        ({ type }) => type === AppDataTypes.Prompts,
      ) as Array<PromptsAppData>;
      allIds.forEach(({ id }) => deleteAppData({ id }));
    }
  };

  return {
    currentPrompt,
    pastPrompts,
    getNewPrompt,
    promptsReady,
    categories,
    resetAllPrompts,
  };
};

export default usePrompts;
