import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { addSeconds } from 'date-fns/addSeconds';
import { differenceInSeconds } from 'date-fns/differenceInSeconds';

import useSteps from '@/hooks/useSteps';
import { useActivityContext } from '@/modules/context/ActivityContext';

const useStepTimer = (onTimeout?: () => void): boolean => {
  const { activityState } = useActivityContext();
  const { currentStep } = useSteps();
  const { startTime } = activityState.data;
  const time = currentStep?.time ?? 0;
  const endTime = useMemo(() => addSeconds(startTime, time), [startTime, time]);

  const timerRef = useRef<NodeJS.Timeout>();
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
    if (typeof onTimeout !== 'undefined') {
      onTimeout();
    }
  }, [onTimeout]);

  const setTimer = useCallback(
    (timeLeft: number) =>
      setTimeout(() => {
        const futureTimeLeft = differenceInSeconds(endTime, new Date());
        if (futureTimeLeft < 0) {
          handleTimeout();
        } else {
          timerRef.current = setTimer(futureTimeLeft);
        }
      }, 1000 * timeLeft),
    [endTime, handleTimeout],
  );

  useEffect(() => {
    if (!timedOut) {
      const currentTimeLeft = differenceInSeconds(endTime, new Date());
      timerRef.current = setTimer(currentTimeLeft);
      return () => clearTimeout(timerRef.current);
    }
    return () => null;
  }, [endTime, handleTimeout, setTimer, timedOut]);

  return timedOut;
};

export default useStepTimer;
