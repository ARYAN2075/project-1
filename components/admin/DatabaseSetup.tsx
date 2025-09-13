import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Copy, Database, CheckCircle, XCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { toast } from '../ui/toast';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface DatabaseStatus {
  success: boolean;
  message: string;
  details: {
    connection: boolean;
    existingTables: string[];
    testQueries: string[];
    errors: string[];
    suggestions: string[];
  };
}

interface DatabaseInfo {
  tables: string[];
  storage: string[];
  functions: string[];
  policies: string[];
}

export function DatabaseSetup() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [info, setInfo] = useState<DatabaseInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [sqlStatements, setSqlStatements] = useState<string>('');

  const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-48dfdf85`;

  // Test database connection on component mount
  useEffect(() => {
    checkDatabaseStatus();
    loadDatabaseInfo();
    loadSQLStatements();
  }, []);

  const checkDatabaseStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${serverUrl}/database/setup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(data);
      } else {
        const errorData = await response.json();
        setStatus({
          success: false,
          message: errorData.message || 'Database check failed',
          details: {
            connection: false,
            existingTables: [],
            testQueries: [],
            errors: [errorData.message || 'Connection failed'],
            suggestions: ['Check Supabase credentials and server setup']
          }
        });
      }
    } catch (error) {
      console.error('Database status check failed:', error);
      setStatus({
        success: false,
        message: 'Failed to connect to server',
        details: {
          connection: false,
          existingTables: [],
          testQueries: [],
          errors: [`Server connection failed: ${error.message}`],
          suggestions: ['Check if the server is running and accessible']
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDatabaseInfo = async () => {
    try {
      const response = await fetch(`${serverUrl}/database/info`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setInfo(data.database);
      }
    } catch (error) {
      console.error('Database info load failed:', error);
    }
  };

  const loadSQLStatements = async () => {
    try {
      const response = await fetch(`${serverUrl}/database/sql`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (response.ok) {
        const sql = await response.text();
        setSqlStatements(sql);
      }
    } catch (error) {
      console.error('SQL statements load failed:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('SQL copied to clipboard!');
  };

  const openSupabaseDashboard = () => {
    window.open(`https://supabase.com/dashboard/project/${projectId}/editor`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0a0118] p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold gradient-text">DigiPratibha Database Setup</h1>
          <p className="text-muted-foreground">
            Initialize and configure your Supabase database for DigiPratibha
          </p>
        </div>

        <Tabs defaultValue="status" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="status">Database Status</TabsTrigger>
            <TabsTrigger value="setup">Manual Setup</TabsTrigger>
            <TabsTrigger value="info">Database Info</TabsTrigger>
          </TabsList>

          <TabsContent value="status" className="space-y-4">
            <Card className="glass border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Database Connection Status
                </CardTitle>
                <CardDescription>
                  Current status of your DigiPratibha database connection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Connection Status</span>
                  <Button
                    onClick={checkDatabaseStatus}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                  >
                    {loading ? 'Testing...' : 'Test Connection'}
                  </Button>
                </div>

                {status && (
                  <div className="space-y-4">
                    <Alert className={status.success ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'}>
                      <div className="flex items-center gap-2">
                        {status.success ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <AlertDescription className="font-medium">
                          {status.message}
                        </AlertDescription>
                      </div>
                    </Alert>

                    {/* Existing Tables */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Accessible Tables ({status.details.existingTables.length})</h4>
                      <div className="flex flex-wrap gap-2">
                        {status.details.existingTables.map((table) => (
                          <Badge key={table} variant="secondary" className="bg-green-500/20 text-green-300">
                            {table}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Test Results */}
                    {status.details.testQueries.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Test Results</h4>
                        <div className="space-y-1">
                          {status.details.testQueries.map((query, index) => (
                            <div key={index} className="text-sm text-green-400">
                              {query}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Errors */}
                    {status.details.errors.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-red-400">Issues Found</h4>
                        <div className="space-y-1">
                          {status.details.errors.map((error, index) => (
                            <div key={index} className="text-sm text-red-400">
                              • {error}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggestions */}
                    {status.details.suggestions.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-yellow-400">Recommended Actions</h4>
                        <div className="space-y-1">
                          {status.details.suggestions.map((suggestion, index) => (
                            <div key={index} className="text-sm text-yellow-400">
                              • {suggestion}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="setup" className="space-y-4">
            <Card className="glass border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Manual Database Setup
                </CardTitle>
                <CardDescription>
                  Copy the SQL commands below and execute them in your Supabase SQL Editor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={openSupabaseDashboard}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Supabase SQL Editor
                  </Button>
                  <Button
                    onClick={() => copyToClipboard(sqlStatements)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy SQL to Clipboard
                  </Button>
                </div>

                <Alert className="border-blue-500/50 bg-blue-500/10">
                  <AlertTriangle className="w-4 h-4" />
                  <AlertDescription>
                    <strong>Setup Instructions:</strong><br />
                    1. Click "Open Supabase SQL Editor" above<br />
                    2. Copy the SQL commands below<br />
                    3. Paste them into the SQL Editor<br />
                    4. Click "Run" to execute the commands<br />
                    5. Return here and test the connection
                  </AlertDescription>
                </Alert>

                <div className="relative">
                  <pre className="bg-[#1a1332] border border-purple-500/20 rounded-lg p-4 overflow-x-auto text-sm">
                    <code className="text-green-400">{sqlStatements}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info" className="space-y-4">
            <Card className="glass border-purple-500/20">
              <CardHeader>
                <CardTitle>Database Information</CardTitle>
                <CardDescription>
                  Current database schema and configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {info ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Tables ({info.tables.length})</h4>
                      <div className="space-y-1">
                        {info.tables.length > 0 ? (
                          info.tables.map((table) => (
                            <Badge key={table} variant="secondary">
                              {table}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No tables found</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Storage Buckets ({info.storage.length})</h4>
                      <div className="space-y-1">
                        {info.storage.length > 0 ? (
                          info.storage.map((bucket) => (
                            <Badge key={bucket} variant="outline">
                              {bucket}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No storage buckets found</p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading database information...</p>
                  </div>
                )}

                <Button
                  onClick={loadDatabaseInfo}
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                >
                  Refresh Database Info
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}