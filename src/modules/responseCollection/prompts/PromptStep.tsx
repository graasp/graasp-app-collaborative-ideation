import { PROMPTS_CY } from '@/config/selectors';
import { PromptUsage } from '@/interfaces/prompt';
import Box from '@mui/material/Box';
import styled from '@mui/material/styles/styled';
import Typography from '@mui/material/Typography';
import { FC, useMemo } from 'react';

const OuterBox = styled(Box)(({ theme }) => ({
  borderRadius: '50%',
  backgroundColor: 'silver',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  aspectRatio: '1',
  width: '2em',
  height: '2em',
  textAlign: 'center',
  verticalAlign: 'baseline',
  color: 'gray',
  transition: theme.transitions.create(
    ['backgroundColor', 'color', 'borderWidth', 'borderColor'],
    {
      duration: theme.transitions.duration.standard,
    },
  ),
}));

const CurrentStyle = {
  backgroundColor: 'green',
  color: 'white',
};

const RemainingStyle = {
  backgroundColor: 'transparent',
  color: 'gray',
  borderStyle: 'dashed',
  borderWidth: '2pt',
  borderColor: 'silver',
};

const PromptStep: FC<{
  usageStatus: PromptUsage;
  children: JSX.Element | number | string;
}> = ({ usageStatus, children }) => {
  const style = useMemo(() => {
    switch (usageStatus) {
      case PromptUsage.CURRENT:
        return CurrentStyle;
      case PromptUsage.REMAINING:
        return RemainingStyle;
      default:
        return {};
    }
  }, [usageStatus]);

  return (
    <OuterBox sx={style} data-cy={PROMPTS_CY.PROMPT_STEP}>
      <Typography>{children}</Typography>
    </OuterBox>
  );
};

export default PromptStep;
