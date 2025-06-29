
import React, { createContext, useContext } from 'react';

type TripVariant = 'consumer' | 'pro';

interface TripVariantContextType {
  variant: TripVariant;
  accentColors: {
    primary: string;
    secondary: string;
    gradient: string;
    badge: string;
  };
}

const TripVariantContext = createContext<TripVariantContextType>({
  variant: 'consumer',
  accentColors: {
    primary: 'glass-orange',
    secondary: 'glass-yellow', 
    gradient: 'from-glass-orange to-glass-yellow',
    badge: 'from-glass-orange to-glass-yellow'
  }
});

export const useTripVariant = () => useContext(TripVariantContext);

interface TripVariantProviderProps {
  variant: TripVariant;
  children: React.ReactNode;
}

export const TripVariantProvider = ({ variant, children }: TripVariantProviderProps) => {
  const accentColors = variant === 'pro' 
    ? {
        primary: 'glass-crimson',
        secondary: 'glass-crimson-light',
        gradient: 'from-glass-crimson to-glass-crimson-light',
        badge: 'from-glass-crimson to-glass-crimson-light'
      }
    : {
        primary: 'glass-orange',
        secondary: 'glass-yellow',
        gradient: 'from-glass-orange to-glass-yellow', 
        badge: 'from-glass-orange to-glass-yellow'
      };

  return (
    <TripVariantContext.Provider value={{ variant, accentColors }}>
      {children}
    </TripVariantContext.Provider>
  );
};
