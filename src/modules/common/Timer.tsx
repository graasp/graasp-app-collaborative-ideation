import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { addSeconds, differenceInSeconds } from 'date-fns';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

interface TimerProps {
  startTime: Date;
  /**
   * Time in seconds.
   */
  time: number;
  /**
   * Function to be called when the timer ends.
   */
  onTimeout?: () => void;
}

const Timer: FC<TimerProps> = ({ startTime, time, onTimeout }) => {
  const endTime = useMemo(() => addSeconds(startTime, time), [startTime, time]);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);

  const [timedOut, setTimedOut] = useState(false);

  // Reset the timer when props change
  const [initialStartTime, setInitialStartTime] = useState(startTime);
  const [initialTime, setInitialTime] = useState(time);
  useEffect(() => {
    if (startTime !== initialStartTime || time !== initialTime) {
      setInitialStartTime(startTime);
      setInitialTime(time);
      setTimedOut(false);
    }
  }, [initialStartTime, initialTime, startTime, time]);

  const handleTimeout = useCallback(() => {
    setTimedOut(true);
    setRemainingSeconds(0);
    if (typeof onTimeout !== 'undefined') {
      onTimeout();
    }
  }, [onTimeout]);

  useEffect(() => {
    if (!timedOut) {
      const timerRef = setInterval(() => {
        const timeLeft = differenceInSeconds(endTime, new Date());
        setRemainingSeconds(timeLeft);
        if (timeLeft < 0) {
          handleTimeout();
        }
      }, 1000);
      return () => clearInterval(timerRef);
    }
    return () => null;
  }, [endTime, handleTimeout, timedOut]);

  const progress = (100 * (time - remainingSeconds)) / time;
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        height: 'fit-content',
      }}
    >
      <CircularProgress
        variant="determinate"
        value={progress}
        color="primary"
      />
    </Box>
  );
};

export default Timer;
