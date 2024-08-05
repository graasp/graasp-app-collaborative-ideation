import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import usePrompts from '@/hooks/usePrompts';

interface PromptsProps {
  onChange: (prompt: string) => void;
}

const Prompts: FC<PromptsProps> = () => {
  const { t } = useTranslation('translations', { keyPrefix: 'PROMPTS' });

  const { currentPrompt, getNewPrompt } = usePrompts();

  //   if (typeof prompts === 'undefined') {
  //     return <p>No set.</p>;
  //   }

  return (
    <Box>
      <p>{currentPrompt?.title}</p>
      <Button onClick={getNewPrompt}>{t('NEW_PROMPT_BUTTON')}</Button>
    </Box>
  );
};

export default Prompts;
