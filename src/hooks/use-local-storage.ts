"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// Cache for localStorage reads (js-cache-storage)
const storageCache = new Map<string, unknown>();

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Check cache first (js-cache-storage)
    if (storageCache.has(key)) {
      return storageCache.get(key) as T;
    }
    return initialValue;
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // Check cache first
      if (storageCache.has(key)) {
        setStoredValue(storageCache.get(key) as T);
        setIsInitialized(true);
        return;
      }

      const item = window.localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        storageCache.set(key, parsed);
        setStoredValue(parsed);
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
    setIsInitialized(true);
  }, [key]);

  // Use functional setState to avoid stale closures (rerender-functional-setstate)
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        setStoredValue((prev) => {
          const valueToStore = value instanceof Function ? value(prev) : value;

          if (typeof window !== "undefined") {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
            storageCache.set(key, valueToStore);
          }

          return valueToStore;
        });
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key]
  );

  // Clear the stored value
  const clearValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      storageCache.delete(key);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error clearing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [isInitialized ? storedValue : initialValue, setValue, clearValue];
}

// Hook specifically for form drafts with debounce
export function useFormDraft<T extends Record<string, unknown>>(
  formKey: string,
  defaultValues: T,
  debounceMs: number = 1000
): {
  savedDraft: T | null;
  saveDraft: (values: T) => void;
  clearDraft: () => void;
  hasDraft: boolean;
} {
  const storageKey = `form-draft-${formKey}`;
  const [draft, setDraft, clearDraft] = useLocalStorage<T | null>(
    storageKey,
    null
  );

  // Use ref to avoid recreating saveDraft on every timeout change (rerender-functional-setstate)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const saveDraft = useCallback(
    (values: T) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Debounce the save
      timeoutRef.current = setTimeout(() => {
        // Only save if values are different from default
        const hasContent = Object.entries(values).some(([key, value]) => {
          const defaultVal = defaultValues[key];
          return value !== defaultVal && value !== "" && value !== undefined;
        });

        if (hasContent) {
          setDraft(values);
        }
      }, debounceMs);
    },
    [defaultValues, debounceMs, setDraft]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    savedDraft: draft,
    saveDraft,
    clearDraft,
    hasDraft: draft !== null,
  };
}
