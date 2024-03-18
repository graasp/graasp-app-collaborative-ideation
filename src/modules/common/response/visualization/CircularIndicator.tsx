import Box from '@mui/material/Box';
import CircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';

const CircularProgressWithLabel = (
  props: CircularProgressProps & { label: string },
): JSX.Element => (
  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
    <CircularProgress variant="determinate" {...props} />
    <Box
      sx={{
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="caption" component="div" color="text.secondary">
        {props.label}
      </Typography>
    </Box>
  </Box>
);

interface CircularIndicatorProps {
  value: number;
  thresholds: {
    value: number;
    label: string;
    color: 'success' | 'warning' | 'error' | 'primary';
  }[];
  label: string;
  width?: string;
}

const CircularIndicator = ({
  value,
  thresholds,
  label,
  width,
}: CircularIndicatorProps): JSX.Element => {
  const currentProps = useMemo(() => {
    const sortedThresholds = thresholds.sort((tA, tB) => tB.value - tA.value);
    // eslint-disable-next-line no-restricted-syntax
    for (const threshold of sortedThresholds) {
      if (threshold.value < value) {
        return threshold;
      }
    }
    return sortedThresholds[0];
  }, [thresholds, value]);
  return (
    <Stack
      width={width}
      direction="column"
      alignItems="center"
      justifyContent="space-between"
    >
      <Typography textAlign="center" variant="caption">
        {label}
      </Typography>
      <CircularProgressWithLabel
        variant="determinate"
        color={currentProps.color}
        title={currentProps.label}
        value={100 * value}
        label={currentProps.label}
      />
    </Stack>
  );
};

export default CircularIndicator;
