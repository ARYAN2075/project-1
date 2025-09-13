import React, { useState, useEffect } from 'react';
import { ConnectionTest } from '../../lib/connection-test';
import { supabaseService } from '../../lib/supabase-service';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SystemStatusProps {
  showDetails?: boolean;
}

interface SystemHealth {
  supabase: boolean;
  server: boolean;
  service: boolean;
  overall: boolean;
  lastChecked: Date;
}

export const SystemStatus: React.FC<SystemStatusProps> = ({ showDetails = false }) => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkSystemHealth = async () => {
    setIsChecking(true);
    try {
      const connectionTest = await ConnectionTest.runFullConnectionTest();
      const serviceConnection = supabaseService.isConnected();

      const systemHealth: SystemHealth = {
        supabase: connectionTest.supabase.success,
        server: connectionTest.server.success,
        service: serviceConnection,
        overall: connectionTest.overall && serviceConnection,
        lastChecked: new Date()
      };

      setHealth(systemHealth);

      // Don't show toast notifications for connection status
      // Users can see the status in the header if they're interested
    } catch (error) {
      setHealth({
        supabase: false,
        server: false,
        service: false,
        overall: false,
        lastChecked: new Date()
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkSystemHealth();
    
    // Check health every 5 minutes (less frequent to reduce noise)
    const interval = setInterval(checkSystemHealth, 300000);
    
    return () => clearInterval(interval);
  }, []);

  if (!health) {
    return (
      <div className="flex items-center space-x-2 text-yellow-400">
        <RefreshCw className="w-4 h-4 animate-spin" />
        <span className="text-sm">Checking system status...</span>
      </div>
    );
  }

  const StatusIcon = health.overall ? CheckCircle : XCircle;
  const statusColor = health.overall ? 'text-green-400' : 'text-red-400';

  return (
    <div className="flex items-center space-x-2">
      <StatusIcon className={`w-4 h-4 ${statusColor}`} />
      
      {showDetails ? (
        <div className="flex flex-col space-y-1">
          <div className={`text-sm ${statusColor}`}>
            {health.overall ? 'Connected' : 'Offline Mode'}
          </div>
          <div className="text-xs space-y-1">
            <div className={`flex items-center space-x-2 ${health.supabase ? 'text-green-400' : 'text-red-400'}`}>
              <div className="w-2 h-2 rounded-full bg-current"></div>
              <span>Database: {health.supabase ? 'Connected' : 'Disconnected'}</span>
            </div>
            <div className={`flex items-center space-x-2 ${health.server ? 'text-green-400' : 'text-red-400'}`}>
              <div className="w-2 h-2 rounded-full bg-current"></div>
              <span>Server: {health.server ? 'Online' : 'Offline'}</span>
            </div>
            <div className={`flex items-center space-x-2 ${health.service ? 'text-green-400' : 'text-red-400'}`}>
              <div className="w-2 h-2 rounded-full bg-current"></div>
              <span>Service: {health.service ? 'Ready' : 'Not Ready'}</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Last checked: {health.lastChecked.toLocaleTimeString()}
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <span className={`text-sm ${statusColor}`}>
            {health.overall ? 'Online' : 'Offline'}
          </span>
          <button
            onClick={checkSystemHealth}
            disabled={isChecking}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {isChecking ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <RefreshCw className="w-3 h-3" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};