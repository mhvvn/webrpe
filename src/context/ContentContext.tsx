
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { INITIAL_STATS } from '../constants';
import { Statistics } from '../types';
import api from '../services/api';

interface ContentContextType {
  stats: Statistics;
  updateStats: (newStats: Statistics) => Promise<void>;
  loading: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<Statistics>(INITIAL_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const updateStats = async (newStats: Statistics) => {
    try {
      const updated = await api.updateStats(newStats);
      setStats(updated);
    } catch (err) {
      console.error('Failed to update stats:', err);
      throw err;
    }
  };

  return (
    <ContentContext.Provider value={{ stats, updateStats, loading }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
