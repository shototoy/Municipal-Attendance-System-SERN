import { useState, useEffect, useCallback, useRef } from 'react';
/**
 * Hook to detect user inactivity
 * @param {number} timeout - Idle timeout in milliseconds (default: 10000ms = 10s)
 * @returns {boolean} isIdle - True if user is idle
 */
export const useIdle = (timeout = 3000) => {
  const [isIdle, setIsIdle] = useState(false);
  const timerRef = useRef(null);

  const resetTimer = useCallback(() => {
    setIsIdle(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setIsIdle(true);
    }, timeout);
  }, [timeout]);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll'];
    const handleActivity = () => {
      resetTimer();
    };
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });
    resetTimer();
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [resetTimer]);

  return { isIdle, resetTimer };
};