import { FC, useState } from 'react';
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
import styled from '@mui/material/styles/styled';

const AnimatedArrow = styled(KeyboardArrowDownIcon)(({ theme }) => ({
  transition: theme.transitions.create(['transform'], {
    duration: theme.transitions.duration.standard,
  }),
}));

interface PromptsProps {
  onChange: (prompt: string) => void;
}

const Prompts: FC<PromptsProps> = () => {
  const { t } = useTranslation('translations', { keyPrefix: 'PROMPTS' });

  const { currentPrompt, getNewPrompt, promptsReady } = usePrompts();

  const [showDetails, setShowDetails] = useState(false);

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
        >
          <Stack direction="row">
            <TipsAndUpdatesIcon
              htmlColor="#ffc920"
              sx={{
                // height: '3rem',
                // width: '3rem',
                // ml: 1,
                mr: 1,
                // p: 1,
                // borderRadius: '50%',
                // backgroundColor: '#ffc920',
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
      <Paper>
        <Button onClick={getNewPrompt}>
          {typeof currentPrompt === 'undefined'
            ? t('NEW_PROMPT_BUTTON')
            : t('CHANGE_PROMPT_BUTTON')}
        </Button>
      </Paper>
    </Stack>
  );
};

export default Prompts;
