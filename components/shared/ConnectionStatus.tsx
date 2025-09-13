import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';

interface ConnectionStatusProps {
  className?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ className = '' }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkConnection = async () => {
    try {
      // Test Supabase connection with timeout and graceful fallback
      let connected = false;
      
      // Create fast timeout promise
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection check timeout')), 1000)
      );

      try {
        const dbTestPromise = supabase
          .from('users')
          .select('count')
          .limit(1)
          .maybeSingle();
        
        const { error } = await Promise.race([dbTestPromise, timeoutPromise]) as any;
        connected = !error;
      } catch (dbError) {
        // Fallback to auth service test
        try {
          const authTestPromise = supabase.auth.getSession();
          const { error: authError } = await Promise.race([authTestPromise, timeoutPromise]) as any;
          connected = !authError;
        } catch (authError) {
          // If both fail, assume offline mode but don't show error
          connected = false;
        }
      }
      
      setIsConnected(connected);
      setLastChecked(new Date());
    } catch (error) {
      // Silently handle connection check failures - don't spam console
      setIsConnected(false);
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    // Initial connection check
    checkConnection();

    // Check connection every 2 minutes (less frequent)
    const interval = setInterval(checkConnection, 120000);

    return () => clearInterval(interval);
  }, []);

  if (isConnected === null) {
    return (
      <div className={`flex items-center space-x-2 text-yellow-400 ${className}`}>
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm">Checking connection...</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${isConnected ? 'text-green-400' : 'text-red-400'} ${className}`}>
      {isConnected ? (
        <Wifi className="w-4 h-4" />
      ) : (
        <WifiOff className="w-4 h-4" />
      )}
      <span className="text-sm">
        {isConnected ? 'Supabase Connected' : 'Connection Lost'}
      </span>
      {lastChecked && (
        <span className="text-xs opacity-60">
          {lastChecked.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};