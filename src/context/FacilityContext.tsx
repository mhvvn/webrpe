import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FACILITIES_DATA } from '../constants';
import { Facility } from '../types';
import api from '../services/api';

interface FacilityContextType {
  facilities: Facility[];
  loading: boolean;
  refreshFacilities: () => Promise<void>;
  addFacility: (facility: Facility) => Promise<boolean>;
  updateFacility: (facility: Facility) => Promise<boolean>;
  deleteFacility: (id: string) => Promise<boolean>;
}

const FacilityContext = createContext<FacilityContextType | undefined>(undefined);

export const FacilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshFacilities = async () => {
    setLoading(true);
    try {
      const data = await api.getFacilities();
      setFacilities(data);
    } catch (err) {
      console.warn('Failed to fetch facilities from API, using mock data');
      setFacilities(FACILITIES_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshFacilities();
  }, []);

  const addFacility = async (facility: Facility): Promise<boolean> => {
    try {
      const newFacility = await api.createFacility(facility);
      setFacilities(prev => [...prev, newFacility]);
      return true;
    } catch (err) {
      console.error('Failed to add facility:', err);
      return false;
    }
  };

  const updateFacility = async (facility: Facility): Promise<boolean> => {
    try {
      const updated = await api.updateFacility(facility.id, facility);
      setFacilities(prev => prev.map(f => (f.id === updated.id ? updated : f)));
      return true;
    } catch (err) {
      console.error('Failed to update facility:', err);
      return false;
    }
  };

  const deleteFacility = async (id: string): Promise<boolean> => {
    try {
      await api.deleteFacility(id);
      setFacilities(prev => prev.filter(f => f.id !== id));
      return true;
    } catch (err) {
      console.error('Failed to delete facility:', err);
      return false;
    }
  };

  return (
    <FacilityContext.Provider value={{ facilities, loading, refreshFacilities, addFacility, updateFacility, deleteFacility }}>
      {children}
    </FacilityContext.Provider>
  );
};

export const useFacilities = () => {
  const context = useContext(FacilityContext);
  if (context === undefined) {
    throw new Error('useFacilities must be used within a FacilityProvider');
  }
  return context;
};
