import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface AutoSaveOptions {
  key: string;
  interval?: number;
  onSave?: (data: any) => Promise<void>;
  debounce?: number;
}

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function useAutoSave<T extends Record<string, any>>(
  data: T,
  options: AutoSaveOptions
) {
  const { key, interval = 30000, onSave, debounce = 1000 } = options;
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const saveToLocalStorage = useCallback(
    (dataToSave: T) => {
      try {
        localStorage.setItem(key, JSON.stringify({ data: dataToSave, timestamp: new Date().toISOString() }));
      } catch (error) {
        console.error('[AutoSave] Failed:', error);
      }
    },
    [key]
  );

  const save = useCallback(
    async (dataToSave: T) => {
      setSaveStatus('saving');
      try {
        saveToLocalStorage(dataToSave);
        if (onSave) await onSave(dataToSave);
        setSaveStatus('saved');
        setLastSaved(new Date());
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (error) {
        setSaveStatus('error');
        toast.error('Speichern fehlgeschlagen');
      }
    },
    [saveToLocalStorage, onSave]
  );

  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => save(data), debounce);
    return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); };
  }, [data, debounce, save]);

  useEffect(() => {
    intervalRef.current = setInterval(() => save(data), interval);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [data, interval, save]);

  const loadFromLocalStorage = useCallback((): T | null => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return null;
      return JSON.parse(saved).data;
    } catch { return null; }
  }, [key]);

  const clearLocalStorage = useCallback(() => {
    try { localStorage.removeItem(key); } catch {}
  }, [key]);

  const manualSave = useCallback(() => save(data), [data, save]);

  return { saveStatus, lastSaved, loadFromLocalStorage, clearLocalStorage, manualSave };
}
