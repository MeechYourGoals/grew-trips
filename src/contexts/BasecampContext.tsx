import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BasecampLocation } from '@/types/basecamp';

interface BasecampContextType {
  basecamp: BasecampLocation | null;
  setBasecamp: (basecamp: BasecampLocation | null) => void;
  isBasecampSet: boolean;
  clearBasecamp: () => void;
}

const BasecampContext = createContext<BasecampContextType | undefined>(undefined);

const BASECAMP_STORAGE_KEY = 'trip-basecamp';

export const BasecampProvider = ({ children }: { children: ReactNode }) => {
  const [basecamp, setBasecampState] = useState<BasecampLocation | null>(null);

  // Load basecamp from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(BASECAMP_STORAGE_KEY);
      if (stored) {
        const parsedBasecamp = JSON.parse(stored);
        setBasecampState(parsedBasecamp);
      }
    } catch (error) {
      console.warn('Failed to load basecamp from localStorage:', error);
      localStorage.removeItem(BASECAMP_STORAGE_KEY);
    }
  }, []);

  // Save basecamp to localStorage whenever it changes
  const setBasecamp = (newBasecamp: BasecampLocation | null) => {
    setBasecampState(newBasecamp);
    
    if (newBasecamp) {
      try {
        localStorage.setItem(BASECAMP_STORAGE_KEY, JSON.stringify(newBasecamp));
      } catch (error) {
        console.warn('Failed to save basecamp to localStorage:', error);
      }
    } else {
      localStorage.removeItem(BASECAMP_STORAGE_KEY);
    }
  };

  const clearBasecamp = () => {
    setBasecamp(null);
  };

  const isBasecampSet = !!basecamp;

  return (
    <BasecampContext.Provider value={{
      basecamp,
      setBasecamp,
      isBasecampSet,
      clearBasecamp
    }}>
      {children}
    </BasecampContext.Provider>
  );
};

export const useBasecamp = () => {
  const context = useContext(BasecampContext);
  if (context === undefined) {
    throw new Error('useBasecamp must be used within a BasecampProvider');
  }
  return context;
};

// Helper hook for getting basecamp coordinates
export const useBasecampCoordinates = () => {
  const { basecamp } = useBasecamp();
  return basecamp?.coordinates || null;
};

// Helper hook for getting basecamp search center
export const useBasecampSearchCenter = () => {
  const { basecamp } = useBasecamp();
  
  if (basecamp?.coordinates) {
    return {
      lat: basecamp.coordinates.lat,
      lng: basecamp.coordinates.lng,
      address: basecamp.address
    };
  }
  
  return null;
};