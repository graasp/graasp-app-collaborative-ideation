import { JSX, SyntheticEvent } from 'react';

import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { LIKERT_RATING_CY } from '@/config/selectors';

interface LikertScaleProps {
  minLabel?: string;
  maxLabel?: string;
  levels: number;
  onChange?: (rating: number) => void;
  levelsLabels?: string[];
  value: number | undefined;
}

const LikertRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconFilled': {
    color: theme.palette.primary.main,
  },
}));

const Label = styled(Typography)(() => ({
  width: '30%',
  minWidth: '20pt',
  overflow: 'clip',
}));

const LikertScale = (props: LikertScaleProps): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { minLabel, maxLabel, levels, onChange, levelsLabels, value } = props;
  if (levels <= 1) {
    throw Error('The `levels` prop should be striclty higher than 1.');
  }

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
        {minLabel}
      </Label>
      <LikertRating
        data-cy={LIKERT_RATING_CY}
        name="likert-rating"
        value={value ?? 0}
        precision={1}
        icon={<RadioButtonCheckedIcon fontSize="inherit" />}
        emptyIcon={<RadioButtonUncheckedIcon fontSize="inherit" />}
        onChange={handleChange}
        highlightSelectedOnly
        max={levels}
      />
      <Label variant="caption">{maxLabel}</Label>
    </Stack>
  );
};

export default LikertScale;
