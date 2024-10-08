import { useEffect, useMemo, useState } from 'react';

import { useLocalContext } from '@graasp/apps-query-client';
import { AppData, AppDataVisibility, PermissionLevel } from '@graasp/sdk';

import { AppDataTypes, PromptsAppData } from '@/config/appDataTypes';
import { CATEGORY_COLORS } from '@/config/constants';
import whatIfs from '@/config/what-ifs.json';
import { FullPromptCategory, Prompt, PromptsData } from '@/interfaces/prompt';
import { useAppDataContext } from '@/modules/context/AppDataContext';
import { useSettings } from '@/modules/context/SettingsContext';
import { getRandomInteger } from '@/utils/utils';

import useActions from './useActions';

const { sets } = whatIfs;

interface UsePromptsValues extends Partial<PromptsData> {
  getNewPrompt: () => void;
  promptsReady: boolean;
  categories: Array<FullPromptCategory>;
  resetAllPrompts: () => Promise<void>;
  allowMorePrompts: boolean;
  maxNumberOfQueries: number;
}

const usePrompts = (): UsePromptsValues => {
  const { appData, postAppData, patchAppData, deleteAppData } =
    useAppDataContext();
  const { accountId, permission } = useLocalContext();

  const { postRequestPromptAction } = useActions();

  const { prompts: promptsSettings } = useSettings();
  const { selectedSet, maxNumberOfQueries } = promptsSettings;
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

  const allowMorePrompts = useMemo(
    () =>
      (pastPrompts?.length ?? 0) + 1 <
      ((maxNumberOfQueries === 0 ? Infinity : maxNumberOfQueries) ?? 0),
    [maxNumberOfQueries, pastPrompts?.length],
  );

  useEffect(() => {
    const promptsAppData = appData.find(
      ({ type, creator }) =>
        type === AppDataTypes.Prompts && accountId === creator?.id,
    ) as PromptsAppData;
    if (typeof promptsAppData !== 'undefined') {
      setCurrentId(promptsAppData.id);
      setCurrentPrompt(promptsAppData.data.currentPrompt);
      setPastPrompts(promptsAppData.data.pastPrompts);
    }
  }, [appData, accountId]);

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
    postRequestPromptAction({
      prompt: newPrompt,
      promptRequestNumber: newPastPrompts.length,
    });
  };

  const getNewPrompt = (): void => {
    if (prompts && allowMorePrompts) {
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
    allowMorePrompts,
    maxNumberOfQueries: maxNumberOfQueries ?? 0,
  };
};

export default usePrompts;
