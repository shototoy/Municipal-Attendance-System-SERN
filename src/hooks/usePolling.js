import { useEffect, useRef, useCallback } from 'react';

export const usePolling = (callback, interval = 3000, enabled = true) => {
  const savedCallback = useRef();
  const intervalRef = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  const startPolling = useCallback(() => {
    if (!enabled) return;

    const tick = () => {
      if (savedCallback.current) {
        savedCallback.current();
      }
    };

    tick();
    intervalRef.current = setInterval(tick, interval);
  }, [interval, enabled]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else if (enabled) {
        startPolling();
      }
    };

    if (enabled) {
      startPolling();
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, startPolling, stopPolling]);

  return { stopPolling, startPolling };
};