import { FC, useEffect, useMemo, useState } from 'react';

import CircularProgress from '@mui/material/CircularProgress';

interface CountdownProps {
  onTimeOut: () => void;
  time: number;
  start: boolean;
}

const Countdown: FC<CountdownProps> = ({ time, start, onTimeOut }) => {
  const [progress, setProgress] = useState<number>(0);
  const intervalTime = useMemo(() => time / 50, [time]);

  const handleTimeOut = useMemo(
    () => (): void => {
      setProgress(0);
      onTimeOut();
    },
    [onTimeOut],
  );

  useEffect(() => {
    if (start) {
      if (progress < 100) {
        const interval = setInterval(() => {
          setProgress((x) => x + 2);
        }, intervalTime);
        return () => clearInterval(interval);
      }
      handleTimeOut();
    }
    return () => null;
  }, [handleTimeOut, intervalTime, progress, start]);

  return <CircularProgress variant="determinate" value={progress} />;
};

export default Countdown;
