import { useEffect, useRef } from "react";

/**
 * useExitIntent Hook
 * 
 * Detects exit intention based on:
 * - Mouse leaving viewport from top (Y ≤ 0)
 * - Inactivity timeout (default: 30 seconds)
 * 
 * Fires only once per session to avoid annoyance
 * 
 * @param enabled - Whether the hook is active
 * @param onTrigger - Callback function when exit intent is detected
 * @param inactivityTimeout - Timeout in milliseconds (default: 30000ms = 30s)
 */
export function useExitIntent(
  enabled: boolean,
  onTrigger: () => void,
  inactivityTimeout: number = 30000
) {
  const fired = useRef(false);

  useEffect(() => {
    if (!enabled || fired.current) return;

    // Mouse-out handler (detect mouse leaving from top)
    const onMouseOut = (e: MouseEvent) => {
      // Only trigger if mouse leaves from top edge (Y ≤ 0)
      if (e.clientY <= 0 && !fired.current) {
        fired.current = true;
        onTrigger();
      }
    };

    // Inactivity timer
    const timer = setTimeout(() => {
      if (!fired.current) {
        fired.current = true;
        onTrigger();
      }
    }, inactivityTimeout);

    // Register event listener
    window.addEventListener("mouseout", onMouseOut);

    // Cleanup
    return () => {
      window.removeEventListener("mouseout", onMouseOut);
      clearTimeout(timer);
    };
  }, [enabled, onTrigger, inactivityTimeout]);
}
