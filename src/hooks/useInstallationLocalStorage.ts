import { useCallback, useEffect, useState } from 'react';

type DraftKey = `${string}|${string}`;

const STORAGE_KEY = 'installationDrafts';

type DraftStorage<T> = Record<DraftKey, {
  formData: T;
  expiryDate: number;
}>;

export function useInstallationLocalStorage<T>(
  projectId: string,
  integrationId: string,
  groupRef: string,
  consumerRef: string,
  initialData: T,
) {
  const key: DraftKey = `${projectId}|${integrationId}|${groupRef}|${consumerRef}`;
  const [formData, setFormData] = useState<T>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialData;

    try {
      const parsed: DraftStorage<T> = JSON.parse(raw);
      return parsed[key]?.formData || initialData;
    } catch {
      return initialData;
    }
  });

  const clear = () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const parsed: DraftStorage<T> = JSON.parse(raw);
    delete parsed[key];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    setFormData(initialData);
  };

  const clearExpired = useCallback(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const parsed: DraftStorage<T> = JSON.parse(raw);
    const now = Date.now();

    const draftKeys = Object.keys(parsed) as DraftKey[]; // re-assigned parsed type

    draftKeys.forEach((storageKey) => {
      if (parsed[storageKey].expiryDate < now) {
        delete parsed[storageKey];
      }
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: DraftStorage<T> = raw ? JSON.parse(raw) : {};
    parsed[key] = {
      formData,
      expiryDate: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  }, [clearExpired, formData, key]);

  return {
    formData,
    setFormData,
    clear,
    key,
    clearExpired,
  };
}
