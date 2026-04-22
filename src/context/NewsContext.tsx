import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NEWS_DATA } from '../constants';
import { NewsItem } from '../types';
import api from '../services/api';

interface NewsContextType {
  news: NewsItem[];
  loading: boolean;
  refreshNews: () => Promise<void>;
  addNews: (item: NewsItem) => Promise<boolean>;
  updateNews: (item: NewsItem) => Promise<boolean>;
  deleteNews: (id: string) => Promise<boolean>;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshNews = async () => {
    setLoading(true);
    try {
      const data = await api.getNews();
      setNews(data);
    } catch (err) {
      console.warn('Failed to fetch news from API, using mock data');
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshNews();
  }, []);

  const addNews = async (item: NewsItem): Promise<boolean> => {
    try {
      const newItem = await api.createNews(item);
      setNews(prev => [newItem, ...prev]);
      return true;
    } catch (err) {
      console.error('Failed to add news:', err);
      return false;
    }
  };

  const updateNews = async (item: NewsItem): Promise<boolean> => {
    try {
      const updated = await api.updateNews(item.id, item);
      setNews(prev => prev.map(n => (n.id === updated.id ? updated : n)));
      return true;
    } catch (err) {
      console.error('Failed to update news:', err);
      return false;
    }
  };

  const deleteNews = async (id: string): Promise<boolean> => {
    try {
      await api.deleteNews(id);
      setNews(prev => prev.filter(n => n.id !== id));
      return true;
    } catch (err) {
      console.error('Failed to delete news:', err);
      return false;
    }
  };

  return (
    <NewsContext.Provider value={{ news, loading, refreshNews, addNews, updateNews, deleteNews }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};