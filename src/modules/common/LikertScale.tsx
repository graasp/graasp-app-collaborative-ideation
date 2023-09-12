import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface LikertScaleProps {
  minLabel?: string;
  maxLabel?: string;
  levels: number;
  onChange?: (rating: number) => void;
  levelsLabels?: string[];
  value: number | undefined;
}

const LikertScale = (props: LikertScaleProps): JSX.Element => {
  const { minLabel, maxLabel, levels, onChange, levelsLabels, value } = props;
  if (levels <= 1) {
    throw Error('The `levels` prop should be striclty higher than 1.');
  }

  const displayValue = (
    valueToDisplay: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _index: number,
  ): JSX.Element => {
    if (levelsLabels) {
      return (
        <Typography variant="caption">
          {levelsLabels[valueToDisplay - 1]}
        </Typography>
      );
    }
    return <Typography variant="caption">{valueToDisplay}</Typography>;
  };

  const handleChange = (
    _event: Event,
    rating: number | number[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _activeThumb: number,
  ): void => {
    if (onChange && typeof rating === 'number') {
      onChange(rating);
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
        value={value || Math.ceil(levels / 2)}
      />
      <Typography variant="caption">{maxLabel}</Typography>
    </Stack>
  );
};

export default LikertScale;
