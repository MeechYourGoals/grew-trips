import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BasecampLocation } from '@/types/basecamp';
import { getStorageItem, setStorageItem, removeStorageItem } from '@/platform/storage';

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

  // Load basecamp from platform storage on mount
  useEffect(() => {
    const loadBasecamp = async () => {
      try {
        const stored = await getStorageItem<BasecampLocation>(BASECAMP_STORAGE_KEY);
        if (stored) {
          setBasecampState(stored);
        }
      } catch (error) {
        console.warn('Failed to load basecamp from storage:', error);
        await removeStorageItem(BASECAMP_STORAGE_KEY);
      }
    };
    loadBasecamp();
  }, []);

  // Save basecamp to platform storage whenever it changes
  const setBasecamp = async (newBasecamp: BasecampLocation | null) => {
    setBasecampState(newBasecamp);
    
    try {
      if (newBasecamp) {
        await setStorageItem(BASECAMP_STORAGE_KEY, newBasecamp);
      } else {
        await removeStorageItem(BASECAMP_STORAGE_KEY);
      }
    } catch (error) {
      console.warn('Failed to save basecamp to storage:', error);
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