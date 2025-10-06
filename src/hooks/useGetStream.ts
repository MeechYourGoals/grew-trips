/**
 * @deprecated Use unifiedMessagingService instead
 * This hook is kept for backward compatibility only
 */
import { useState } from 'react';
import { PrivacyMode } from '../types/privacy';

export const useGetStream = () => {
  const [error] = useState<string | null>(null);

  console.warn('useGetStream is deprecated. Use unifiedMessagingService instead.');

  return {
    client: null,
    isConnecting: false,
    error,
    getTripChannel: async (_tripId: string, _privacyMode?: PrivacyMode) => null,
    isReady: false,
  };
};
