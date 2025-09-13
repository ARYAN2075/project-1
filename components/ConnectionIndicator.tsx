// Beautiful Connection Status Indicator for DigiPratibha
// Stunning visual feedback for connection status with smooth animations

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { connectionMonitor, ConnectionState, connectionColors, qualityIcons } from '../lib/connection-monitor';
import { Wifi, WifiOff, RotateCcw, Activity, Zap } from 'lucide-react';

interface ConnectionIndicatorProps {
  variant?: 'compact' | 'detailed' | 'minimal';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  showDetails?: boolean;
}

export function ConnectionIndicator({ 
  variant = 'compact', 
  position = 'top-right',
  showDetails = false 
}: ConnectionIndicatorProps) {
  const [connectionState, setConnectionState] = useState<ConnectionState>(connectionMonitor.getState());
  const [showDetailPanel, setShowDetailPanel] = useState(false);

  useEffect(() => {
    const unsubscribe = connectionMonitor.subscribe(setConnectionState);
    return unsubscribe;
  }, []);

  const getStatusColor = () => {
    return connectionColors[connectionState.status];
  };

  const getStatusIcon = () => {
    switch (connectionState.status) {
      case 'online':
        return <Wifi className="w-4 h-4" />;
      case 'offline':
        return <WifiOff className="w-4 h-4" />;
      case 'reconnecting':
        return <RotateCcw className="w-4 h-4 animate-spin" />;
      case 'unstable':
        return <Activity className="w-4 h-4" />;
      default:
        return <WifiOff className="w-4 h-4" />;
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      default:
        return 'top-4 right-4';
    }
  };

  const formatLatency = (latency: number) => {
    if (latency === 0) return 'N/A';
    return `${latency}ms`;
  };

  if (variant === 'minimal') {
    return (
      <motion.div
        className={`fixed z-50 ${getPositionClasses()}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div 
          className="w-3 h-3 rounded-full"
          style={{ 
            background: getStatusColor().gradient,
            boxShadow: getStatusColor().glow
          }}
        />
      </motion.div>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.div
        className={`fixed z-50 ${getPositionClasses()}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          onClick={() => setShowDetailPanel(!showDetailPanel)}
          className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-full p-2 text-white hover:bg-white/20 transition-all duration-300"
          style={{ boxShadow: getStatusColor().glow }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center gap-1">
            {getStatusIcon()}
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getStatusColor().primary }}
            />
          </div>
        </motion.button>

        <AnimatePresence>
          {showDetailPanel && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              className="absolute top-full right-0 mt-2 w-64 backdrop-blur-xl bg-black/80 border border-white/20 rounded-2xl p-4 text-white"
              style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Connection Status</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs capitalize">{connectionState.status}</span>
                    {qualityIcons[connectionState.quality]}
                  </div>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/70">Latency:</span>
                    <span className="font-mono">{formatLatency(connectionState.latency)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-white/70">Quality:</span>
                    <span className="capitalize">{connectionState.quality}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-white/70">Bandwidth:</span>
                    <span className="capitalize">{connectionState.bandwidth}</span>
                  </div>
                  
                  {connectionState.reconnectAttempts > 0 && (
                    <div className="flex justify-between">
                      <span className="text-white/70">Retry attempts:</span>
                      <span>{connectionState.reconnectAttempts}</span>
                    </div>
                  )}
                </div>

                {connectionState.status === 'offline' && (
                  <motion.button
                    onClick={() => connectionMonitor.forceReconnect()}
                    className="w-full py-2 px-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-xs font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <RotateCcw className="w-3 h-3" />
                      Reconnect
                    </div>
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  if (variant === 'detailed') {
    return (
      <motion.div
        className={`fixed z-50 ${getPositionClasses()}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="backdrop-blur-xl bg-black/80 border border-white/20 rounded-2xl p-4 text-white min-w-[280px]">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-400" />
                Network Status
              </h3>
              <div 
                className="w-3 h-3 rounded-full animate-pulse"
                style={{ backgroundColor: getStatusColor().primary }}
              />
            </div>

            {/* Main Status */}
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-full"
                style={{ 
                  background: getStatusColor().gradient,
                  boxShadow: getStatusColor().glow
                }}
              >
                {getStatusIcon()}
              </div>
              <div>
                <div className="font-medium capitalize">{connectionState.status}</div>
                <div className="text-sm text-white/70 capitalize">
                  {connectionState.quality} quality
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
                <div className="text-white/70">Latency</div>
                <div className="font-mono text-green-400">
                  {formatLatency(connectionState.latency)}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-white/70">Bandwidth</div>
                <div className="capitalize text-blue-400">
                  {connectionState.bandwidth}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-white/70">Region</div>
                <div className="text-purple-400 uppercase">
                  {connectionState.region}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-white/70">Last Check</div>
                <div className="text-orange-400 text-xs">
                  {connectionState.lastPing.toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Progress Bar for Quality */}
            <div className="space-y-2">
              <div className="text-sm text-white/70">Connection Quality</div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <motion.div
                  className="h-2 rounded-full"
                  style={{ 
                    background: getStatusColor().gradient,
                    width: connectionState.quality === 'excellent' ? '100%' :
                           connectionState.quality === 'good' ? '75%' :
                           connectionState.quality === 'poor' ? '50%' : '25%'
                  }}
                  initial={{ width: 0 }}
                  animate={{ 
                    width: connectionState.quality === 'excellent' ? '100%' :
                           connectionState.quality === 'good' ? '75%' :
                           connectionState.quality === 'poor' ? '50%' : '25%'
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <motion.button
                onClick={() => connectionMonitor.forceReconnect()}
                className="flex-1 py-2 px-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg text-xs font-medium hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center gap-2">
                  <RotateCcw className="w-3 h-3" />
                  Refresh
                </div>
              </motion.button>
              
              <motion.button
                onClick={() => setShowDetailPanel(false)}
                className="py-2 px-3 bg-white/10 rounded-lg text-xs font-medium hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Hide
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
}

// Hook for using connection state in components
export function useConnectionState() {
  const [connectionState, setConnectionState] = useState<ConnectionState>(connectionMonitor.getState());

  useEffect(() => {
    const unsubscribe = connectionMonitor.subscribe(setConnectionState);
    return unsubscribe;
  }, []);

  return {
    connectionState,
    isOnline: connectionMonitor.isOnline(),
    isStable: connectionMonitor.isStable(),
    forceReconnect: () => connectionMonitor.forceReconnect()
  };
}