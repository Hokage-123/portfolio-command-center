import { useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { initializeSampleData } from '../services/sampleData';

export const useInitialData = () => {
  const { state, dispatch } = useApp();

  useEffect(() => {
    // Initialize sample data if no data exists
    if (state.projects.length === 0 && state.journalEntries.length === 0) {
      const sampleData = initializeSampleData();
      
      dispatch({ type: 'SET_PROJECTS', payload: sampleData.projects });
      dispatch({ type: 'SET_JOURNAL_ENTRIES', payload: sampleData.journalEntries });
    }
  }, [state.projects.length, state.journalEntries.length, dispatch]);
};
