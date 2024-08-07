import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import usePrompts from '@/hooks/usePrompts';
import Paper from '@mui/material/Paper';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import { styled } from '@mui/material/styles';
import { PromptUsage } from '@/interfaces/prompt';
import { PROMPTS_CY } from '@/config/selectors';
import PromptStep from './PromptStep';

interface PromptsProps {
  onChange: (prompt: string) => void;
}

const AnimatedArrow = styled(KeyboardArrowDownIcon)(({ theme }) => ({
  transition: theme.transitions.create(['transform'], {
    duration: theme.transitions.duration.standard,
  }),
}));

const Prompts: FC<PromptsProps> = () => {
  const { t } = useTranslation('translations', { keyPrefix: 'PROMPTS' });

  const {
    currentPrompt,
    getNewPrompt,
    promptsReady,
    allowMorePrompts,
    pastPrompts,
    maxNumberOfQueries,
  } = usePrompts();

  const [showDetails, setShowDetails] = useState(false);

  const promptRequests = useMemo(() => {
    const numberOfPastPrompts = pastPrompts?.length ?? -1;
    return Array.from({ length: maxNumberOfQueries }, (v, i) =>
      // eslint-disable-next-line no-nested-ternary
      i < numberOfPastPrompts
        ? PromptUsage.USED
        : i === numberOfPastPrompts
          ? PromptUsage.CURRENT
          : PromptUsage.REMAINING,
    );
  }, [maxNumberOfQueries, pastPrompts]);

  if (!promptsReady) {
    return <p hidden>{t('NO_PROMPTS_HIDDEN_MESSAGE')}</p>;
  }

  return (
    <Stack direction="row" spacing={2}>
      <Collapse
        in={typeof currentPrompt !== 'undefined'}
        orientation="horizontal"
      >
        <Paper
          sx={{
            p: 2,
            backgroundColor: '#ffffdb',
            width: { md: '75ch', sm: '100%' },
            maxWidth: '100%',
          }}
          data-cy={PROMPTS_CY.PROMPT}
        >
          <Stack direction="row">
            <TipsAndUpdatesIcon
              htmlColor="#ffc920"
              sx={{
                mr: 1,
              }}
            />
            <Typography variant="h3" mb={1}>
              {currentPrompt?.title}
            </Typography>
            <Box>
              <IconButton onClick={() => setShowDetails(!showDetails)}>
                <AnimatedArrow
                  htmlColor="grey"
                  sx={{
                    transform: showDetails ? 'rotate(0)' : 'rotate(0.25turn)',
                  }}
                />
              </IconButton>
            </Box>
          </Stack>
          <Collapse in={showDetails}>
            <Typography>{currentPrompt?.details}</Typography>
          </Collapse>
        </Paper>
      </Collapse>
      <Paper
        sx={{
          p: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        data-cy={PROMPTS_CY.DASHBOARD}
      >
        <Stack direction="row" spacing={1}>
          {promptRequests.map((pU, index) => {
            const n = index + 1;
            return (
              <PromptStep key={index} usageStatus={pU}>
                {n}
              </PromptStep>
            );
          })}
        </Stack>
        <Button
          disabled={!allowMorePrompts}
          onClick={getNewPrompt}
          sx={{ m: 2 }}
          data-cy={PROMPTS_CY.REQUEST_BUTTON}
        >
          {typeof currentPrompt === 'undefined'
            ? t('NEW_PROMPT_BUTTON')
            : t('CHANGE_PROMPT_BUTTON')}
        </Button>
      </Paper>
    </Stack>
  );
};

export default Prompts;
