import { SyntheticEvent } from 'react';

import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
// import Container from '@mui/material/Container';
import Rating from '@mui/material/Rating';
// import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

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
  '& .MuiRating-iconHover': {
    color: theme.palette.primary.dark,
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

  // const displayValue = (
  //   valueToDisplay: number,
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   _index: number,
  // ): JSX.Element => {
  //   if (levelsLabels) {
  //     return (
  //       <Typography variant="caption">
  //         {levelsLabels[valueToDisplay - 1]}
  //       </Typography>
  //     );
  //   }
  //   return <Typography variant="caption">{valueToDisplay}</Typography>;
  // };

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
      {/* <Slider
        // color={isSet ? 'success' : 'primary'} // TODO: fix this weird bug with typechecker
        sx={{ width: '100pt' }}
        onChange={handleChange}
        step={1}
        marks
        min={1}
        max={levels}
        track={false}
        defaultValue={Math.ceil(levels / 2)}
        valueLabelDisplay="auto"
        valueLabelFormat={displayValue}
        value={value || Math.ceil(levels / 2)}
      /> */}
      <LikertRating
        name="likert-rating"
        defaultValue={Math.ceil(levels / 2)}
        precision={1}
        icon={<RadioButtonCheckedIcon fontSize="inherit" />}
        emptyIcon={<RadioButtonUncheckedIcon fontSize="inherit" />}
        onChange={handleChange}
        highlightSelectedOnly
      />
      <Label variant="caption">{maxLabel}</Label>
    </Stack>
  );
};

export default LikertScale;
