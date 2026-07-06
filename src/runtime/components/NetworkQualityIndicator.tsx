import React from 'react';
import { useNetworkQuality } from '../hooks/useNetworkQuality';
import { Wifi, WifiOff } from 'lucide-react';

export function NetworkQualityIndicator() {
  const { isOnline, quality } = useNetworkQuality();

  if (isOnline && quality === 'excellent') {
    return null; // Don't distract the user if connection is perfect
  }

  return (
    <div className={`fixed bottom-4 right-4 flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
      !isOnline ? 'bg-red-500 text-white shadow-red-500/20' : 
      quality === 'poor' ? 'bg-yellow-500 text-white shadow-yellow-500/20' : 
      'bg-gray-800 text-white shadow-gray-800/20'
    } shadow-lg z-50`}>
      {!isOnline ? (
        <>
          <WifiOff className="w-4 h-4" />
          <span>Offline - Answers saved locally</span>
        </>
      ) : (
        <>
          <Wifi className="w-4 h-4" />
          <span>
            {quality === 'poor' ? 'Poor Connection' : 'Connected'}
          </span>
        </>
      )}
    </div>
  );
}
