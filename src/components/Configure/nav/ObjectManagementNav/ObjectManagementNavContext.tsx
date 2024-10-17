import { createContext, useContext } from 'react';

// Create a context for the selected navObject's name

export const SelectedObjectNameContext = createContext<string | null | undefined>(null);
// Custom hook to access the selected navObject's name

export function useSelectedObjectName() {
  const selectedNavObjectName = useContext(SelectedObjectNameContext);
  if (selectedNavObjectName === null) {
    throw new Error(
      'useSelectedNavObjectName must be used within a SelectedNavObjectNameProvider',
    );
  }
  return { selectedObjectName: selectedNavObjectName }; // Return as an object
}
// create context for setNextTabIndex function

export const NextTabIndexContext = createContext<() => void>(() => { });
// Custom hook to access the setNextTabIndex function

export function useNextIncompleteTabIndex() {
  const onNextIncompleteTab = useContext(NextTabIndexContext);
  if (!onNextIncompleteTab) {
    throw new Error('useSetNextTabIndex must be used within a NextTabIndexProvider');
  }
  return { onNextIncompleteTab };
}
