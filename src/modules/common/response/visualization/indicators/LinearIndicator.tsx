import { BoxPlot } from '@nivo/boxplot';

import type { AxisTickProps } from '@nivo/axes';

interface CircularIndicatorProps {
  data: Array<{
    group: string;
    value: number;
  }>;
  maxValue?: number;
  //   label: string;
  leftLabels?: string[][];
  rightLabels?: string[][];
  height: number;
  width: number;
}

const CustomTickLabel = ({
  label,
  p,
}: {
  label: string;
  p: AxisTickProps<string>;
}): JSX.Element => (
  <text
    x={p.x}
    y={p.y}
    dominantBaseline={p.textBaseline}
    opacity={p.opacity}
    textAnchor={p.textAnchor}
    style={{
      fontFamily: 'sans-serif',
      fontSize: '11px',
      fill: 'rgb(51, 51, 51)',
      outlineWidth: '0px',
      outlineColor: 'transparent',
    }}
  >
    {label}
  </text>
);

const LinearIndicator = ({
  data,
  maxValue = 5,
  rightLabels,
  leftLabels,
  height,
  width,
  //   label,
}: CircularIndicatorProps): JSX.Element => {
  const renderRightLabels = (p: AxisTickProps<string>): JSX.Element => {
    const label =
      rightLabels?.find((valLabel) => valLabel[0] === p.value)?.[1] ?? p.value;
    return <CustomTickLabel label={label} p={p} />;
  };

  const renderLeftLabels = (p: AxisTickProps<string>): JSX.Element => {
    const label =
      leftLabels?.find((valLabel) => valLabel[0] === p.value)?.[1] ?? p.value;
    return <CustomTickLabel label={label} p={p} />;
  };
  return (
    <BoxPlot
      data={data}
      minValue={0}
      maxValue={maxValue}
      layout="horizontal"
      axisRight={{
        renderTick: rightLabels ? renderRightLabels : undefined,
      }}
      axisLeft={{
        renderTick: leftLabels ? renderLeftLabels : undefined,
      }}
      width={width}
      height={height}
      margin={{
        left: 60,
        right: 60,
      }}
      isInteractive={false}
      colors={{ scheme: 'blues' }}
      borderWidth={2}
      borderColor={{
        from: 'color',
        modifiers: [['darker', 0.6]],
      }}
    />
  );
};
export default LinearIndicator;
