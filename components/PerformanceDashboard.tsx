// Beautiful Performance Dashboard for DigiPratibha Backend
// Real-time monitoring and analytics for system performance

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Activity, Database, Zap, Clock, HardDrive, Wifi, TrendingUp, Server } from 'lucide-react';
import { enhancedBackend, performance, cache } from '../lib/enhanced-backend-service';
import { dbOptimizer } from '../lib/database-optimizer';

interface PerformanceDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PerformanceDashboard({ isOpen, onClose }: PerformanceDashboardProps) {
  const [metrics, setMetrics] = useState(enhancedBackend.getPerformanceMetrics());
  const [cacheStats, setCacheStats] = useState(cache.stats());
  const [dbReport, setDbReport] = useState(dbOptimizer.getPerformanceReport());
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Initial load
      updateMetrics();
      
      // Set up refresh interval
      const interval = setInterval(updateMetrics, 2000); // Update every 2 seconds
      setRefreshInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    } else {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    }
  }, [isOpen]);

  const updateMetrics = () => {
    setMetrics(enhancedBackend.getPerformanceMetrics());
    setCacheStats(cache.stats());
    setDbReport(dbOptimizer.getPerformanceReport());
  };

  const performanceData = [
    { name: 'Latency', value: metrics.averageLatency, color: '#8b5cf6' },
    { name: 'Ops/Sec', value: metrics.operationsPerSecond, color: '#06b6d4' },
    { name: 'Cache Hit %', value: metrics.cacheHitRate, color: '#10b981' },
    { name: 'Error Rate %', value: metrics.errorRate, color: '#ef4444' }
  ];

  const connectionQualityData = [
    { name: 'Excellent', value: 45, color: '#10b981' },
    { name: 'Good', value: 30, color: '#f59e0b' },
    { name: 'Poor', value: 20, color: '#ef4444' },
    { name: 'Critical', value: 5, color: '#991b1b' }
  ];

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(10, 1, 24, 0.8)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-6xl max-h-[90vh] overflow-auto backdrop-blur-xl bg-black/80 border border-white/20 rounded-3xl p-6"
            style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Performance Dashboard</h2>
                  <p className="text-white/70">Real-time system monitoring and analytics</p>
                </div>
              </div>
              
              <motion.button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ✕
              </motion.button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Connection Status */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Wifi className="w-5 h-5 text-green-400" />
                  <h3 className="font-semibold text-white">Connection Status</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Status:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-green-400 capitalize">{metrics.connectionStatus.status}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Latency:</span>
                    <span className="text-blue-400 font-mono">{metrics.connectionStatus.latency.toFixed(0)}ms</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Region:</span>
                    <span className="text-purple-400 uppercase">{metrics.connectionStatus.region}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Queue:</span>
                    <span className="text-orange-400">{metrics.queueLength} operations</span>
                  </div>
                </div>
              </motion.div>

              {/* Performance Metrics */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <h3 className="font-semibold text-white">Performance</h3>
                </div>
                
                <div className="space-y-4">
                  {performanceData.map((item, index) => (
                    <div key={item.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70 text-sm">{item.name}</span>
                        <span className="text-white font-mono text-sm">
                          {item.value.toFixed(1)}{item.name.includes('%') ? '%' : item.name.includes('Latency') ? 'ms' : ''}
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <motion.div
                          className="h-2 rounded-full"
                          style={{ backgroundColor: item.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(item.value, 100)}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Cache Statistics */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <HardDrive className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-semibold text-white">Cache Status</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Entries:</span>
                    <span className="text-cyan-400 font-mono">{cacheStats.size}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Memory:</span>
                    <span className="text-green-400 font-mono">{cacheStats.memoryUsage}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Hit Rate:</span>
                    <span className="text-purple-400 font-mono">{cacheStats.hitRate.toFixed(1)}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Avg Time:</span>
                    <span className="text-orange-400 font-mono">{cacheStats.averageQueryTime}</span>
                  </div>
                </div>
                
                <motion.button
                  onClick={() => cache.clear()}
                  className="w-full mt-4 py-2 px-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-xl text-sm font-medium text-white hover:from-red-500/30 hover:to-pink-500/30 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Clear Cache
                </motion.button>
              </motion.div>

              {/* Database Performance Chart */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 lg:col-span-2"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Database className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold text-white">Database Operations</h3>
                </div>
                
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Object.entries(dbReport.operationMetrics).map(([name, metrics]: [string, any]) => ({
                      name: name.replace('_', ' '),
                      time: parseFloat(metrics.averageTime.replace('ms', '')),
                      cache: parseFloat(metrics.cacheHitRate.replace('%', ''))
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="name" 
                        stroke="rgba(255,255,255,0.7)" 
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
                      <Bar dataKey="time" fill="#8b5cf6" name="Avg Time (ms)" />
                      <Bar dataKey="cache" fill="#10b981" name="Cache Hit %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Connection Quality Pie Chart */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <h3 className="font-semibold text-white">Quality Distribution</h3>
                </div>
                
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={connectionQualityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {connectionQualityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-2">
                  {connectionQualityData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-white/70">{item.name}</span>
                      </div>
                      <span className="text-white font-mono">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Top Optimizations */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 lg:col-span-2"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Server className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-semibold text-white">Top Optimizations</h3>
                </div>
                
                <div className="space-y-3">
                  {dbReport.topOptimizations.slice(0, 5).map((opt: any, index: number) => (
                    <div key={opt.optimization} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                        <span className="text-white/90 capitalize">{opt.optimization.replace('-', ' ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-400 font-mono">{opt.usage}</span>
                        <span className="text-white/50 text-sm">uses</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* System Actions */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-orange-400" />
                  <h3 className="font-semibold text-white">System Actions</h3>
                </div>
                
                <div className="space-y-3">
                  <motion.button
                    onClick={() => performance.sync()}
                    className="w-full py-2 px-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl text-sm font-medium text-white hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sync Changes
                  </motion.button>
                  
                  <motion.button
                    onClick={() => dbOptimizer.clearCache()}
                    className="w-full py-2 px-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl text-sm font-medium text-white hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Clear DB Cache
                  </motion.button>
                  
                  <motion.button
                    onClick={updateMetrics}
                    className="w-full py-2 px-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl text-sm font-medium text-white hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Refresh Metrics
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}