import { JSX, SyntheticEvent, useCallback, useMemo } from 'react';

import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import Rating, { IconContainerProps } from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
    color: theme.palette.action.disabled,
  },
}));

const Label = styled(Typography)(() => ({
  width: '70%',
  minWidth: '20pt',
  overflow: 'clip',
}));

const customIcons: {
  [index: string]: {
    icon: React.ReactElement;
    label: string;
  };
} = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon color="error" />,
    label: 'Very Dissatisfied',
  },
  2: {
    icon: <SentimentDissatisfiedIcon color="error" />,
    label: 'Dissatisfied',
  },
  3: {
    icon: <SentimentSatisfiedIcon color="warning" />,
    label: 'Neutral',
  },
  4: {
    icon: <SentimentSatisfiedAltIcon color="success" />,
    label: 'Satisfied',
  },
  5: {
    icon: <SentimentVerySatisfiedIcon color="success" />,
    label: 'Very Satisfied',
  },
};

interface FeedbackProps {
  label?: string;
  levels: number;
  onChange?: (rating: number) => void;
  value?: number;
}

const Feedback = ({
  label,
  levels = 5,
  onChange,
  value,
}: FeedbackProps): JSX.Element => {
  const levelsSafe = useMemo(() => {
    if (levels > 5) {
      return 5;
    }
    if (levels < 2) {
      return 2;
    }
    return levels;
  }, [levels]);

  const customIconsSafe = useMemo(() => {
    switch (levelsSafe) {
      case 4:
        return {
          1: customIcons[1],
          2: customIcons[2],
          3: customIcons[4],
          4: customIcons[5],
        };
      case 3:
        return {
          1: customIcons[1],
          2: customIcons[3],
          3: customIcons[5],
        };
      case 2:
        return {
          1: customIcons[1],
          2: customIcons[5],
        };
      default:
        return customIcons;
    }
  }, [levelsSafe]);

  const IconContainer = useCallback(
    (props: IconContainerProps): JSX.Element => {
      const { value: val, ...other } = props;
      return <span {...other}>{customIconsSafe[val].icon}</span>;
    },
    [customIconsSafe],
  );

  const handleChange = (
    _event: SyntheticEvent,
    rating: number | null,
  ): void => {
    if (onChange && typeof rating === 'number') {
      onChange(rating);
    }
  };

  return (
    <Stack
      spacing={2}
      alignItems="center"
      direction="row"
      justifyContent="space-between"
      sx={{ width: '100%', pl: 1, pr: 1 }}
    >
      <Label variant="caption" textAlign="right">
        {label}
      </Label>
      <StyledRating
        name="feedback-rating"
        value={value ?? null}
        max={levelsSafe}
        IconContainerComponent={IconContainer}
        // TODO: Complete
        // getLabelText={(val: number) => customIcons[value].label}
        highlightSelectedOnly
        onChange={handleChange}
      />
    </Stack>
  );
};

export default Feedback;
