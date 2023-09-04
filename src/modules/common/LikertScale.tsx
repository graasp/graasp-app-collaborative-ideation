import { useState } from 'react';

import { Slider, Stack, Typography, useTheme } from '@mui/material';

interface LikertScaleProps {
  minLabel?: string;
  maxLabel?: string;
  levels: number;
  onChange?: (rating: number) => void;
  levelsLabels?: string[];
}

const LikertScale = (props: LikertScaleProps): JSX.Element => {
  const { minLabel, maxLabel, levels, onChange, levelsLabels } = props;
  const theme = useTheme();
  const [isSet, setIsSet] = useState(false);
  if (levels <= 1) {
    throw Error('The `levels` prop should be striclty higher than 1.');
  }

  const displayValue = (value: number, _index: number): JSX.Element => {
    if (levelsLabels) {
      return (
        <Typography variant="caption">{levelsLabels[value - 1]}</Typography>
      );
    }
    return <Typography variant="caption">{value}</Typography>;
  };

  const handleChange = (
    _event: Event,
    rating: number | number[],
    _activeThumb: number,
  ): void => {
    if (onChange && typeof rating === 'number') {
      onChange(rating);
      setIsSet(true);
    }
  };
  return (
    <Stack
      spacing={1}
      alignItems="center"
      direction="row"
      justifyContent="center"
      sx={{ width: '100%', p: 1 }}
    >
      <Typography variant="caption">{minLabel}</Typography>
      <Slider
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
      />
      <Typography variant="caption">{maxLabel}</Typography>
    </Stack>
  );
};

export default LikertScale;
