import { useState, useEffect } from 'react';

export type NetworkQuality = 'excellent' | 'good' | 'poor' | 'offline';

export function useNetworkQuality() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [quality, setQuality] = useState<NetworkQuality>('good');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initial state
    setIsOnline(navigator.onLine);
    setQuality(navigator.onLine ? 'good' : 'offline');

    const handleOnline = () => {
      setIsOnline(true);
      setQuality('good');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setQuality('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Optional: add a ping mechanism for quality ('excellent' vs 'poor')
    // We'll keep it simple for now based on browser connection api
    if (navigator && (navigator as any).connection) {
       const updateConnectionStatus = () => {
         const conn = (navigator as any).connection;
         if (conn.rtt === 0 || conn.downlink === 0) setQuality('offline');
         else if (conn.rtt < 100) setQuality('excellent');
         else if (conn.rtt < 500) setQuality('good');
         else setQuality('poor');
       };
       (navigator as any).connection.addEventListener('change', updateConnectionStatus);
       updateConnectionStatus();
       
       return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
          (navigator as any).connection.removeEventListener('change', updateConnectionStatus);
       }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, quality };
}
