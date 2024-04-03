import { useEffect, useState } from "react";

const useCountdown = (seconds: number) => {
  const [countDown, setCountDown] = useState(seconds);

  useEffect(() => {
    setCountDown(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!countDown) return;

    const interval = setInterval(() => {
      setCountDown(countDown - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [countDown]);

  return getReturnValues(countDown);
};

const getReturnValues = (countDown: number) => {
  // calculate time left
  const hours = Math.floor(countDown / (60 * 60));
  const minutes = Math.floor((countDown % (60 * 60)) / 60);
  const seconds = Math.floor(countDown % 60);

  return { countDown, hours, minutes, seconds };
};

export { useCountdown };
