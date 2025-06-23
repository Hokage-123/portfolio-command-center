import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Eye, EyeOff, Key, TestTube, CheckCircle, XCircle, Settings as SettingsIcon } from 'lucide-react';

interface APIKeyConfig {
  geminiApiKey: string;
  firebaseApiKey: string;
  firebaseAuthDomain: string;
  firebaseProjectId: string;
}

export const Settings: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<APIKeyConfig>({
    geminiApiKey: '',
    firebaseApiKey: '',
    firebaseAuthDomain: '',
    firebaseProjectId: ''
  });
  
  const [showKeys, setShowKeys] = useState({
    gemini: false,
    firebase: false
  });
  
  const [testResults, setTestResults] = useState({
    gemini: null as boolean | null,
    firebase: null as boolean | null
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Load saved API keys on component mount
  useEffect(() => {
    const savedKeys = localStorage.getItem('portfolio_api_keys');
    if (savedKeys) {
      try {
        const parsed = JSON.parse(savedKeys);
        setApiKeys(parsed);
      } catch (error) {
        console.error('Error loading saved API keys:', error);
      }
    }
  }, []);

  const handleInputChange = (field: keyof APIKeyConfig, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [field]: value
    }));
    // Reset test results when keys change
    if (field === 'geminiApiKey') {
      setTestResults(prev => ({ ...prev, gemini: null }));
    }
    if (field.startsWith('firebase')) {
      setTestResults(prev => ({ ...prev, firebase: null }));
    }
  };

  const testGeminiAPI = async () => {
    if (!apiKeys.geminiApiKey.trim()) {
      setTestResults(prev => ({ ...prev, gemini: false }));
      return;
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKeys.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: "Test connection"
            }]
          }]
        })
      });

      if (response.ok) {
        setTestResults(prev => ({ ...prev, gemini: true }));
      } else {
        setTestResults(prev => ({ ...prev, gemini: false }));
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, gemini: false }));
    }
  };

  const testFirebaseConfig = () => {
    const isValid = !!(apiKeys.firebaseApiKey.trim() && 
                      apiKeys.firebaseAuthDomain.trim() && 
                      apiKeys.firebaseProjectId.trim());
    setTestResults(prev => ({ ...prev, firebase: isValid }));
  };

  const saveAPIKeys = () => {
    setIsSaving(true);
    try {
      localStorage.setItem('portfolio_api_keys', JSON.stringify(apiKeys));
      
      // Update the global API configuration
      window.dispatchEvent(new CustomEvent('apiKeysUpdated', { 
        detail: apiKeys 
      }));
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving API keys:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const clearAPIKeys = () => {
    setApiKeys({
      geminiApiKey: '',
      firebaseApiKey: '',
      firebaseAuthDomain: '',
      firebaseProjectId: ''
    });
    localStorage.removeItem('portfolio_api_keys');
    setTestResults({ gemini: null, firebase: null });
    setSaveStatus('idle');
  };

  const maskKey = (key: string, show: boolean) => {
    if (!key || show) return key;
    if (key.length <= 8) return '••••••••';
    return key.substring(0, 4) + '••••••••' + key.substring(key.length - 4);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>
        <p className="text-gray-600">Configure your API keys to enable AI features and authentication</p>
      </div>

      <Tabs defaultValue="api-keys" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="api-keys">API Configuration</TabsTrigger>
          <TabsTrigger value="help">Setup Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys">
          <div className="space-y-6">
            {/* Gemini AI Configuration */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      Gemini AI API
                    </CardTitle>
                    <CardDescription>
                      Enable AI features like project insights, status updates, and journal analysis
                    </CardDescription>
                  </div>
                  {testResults.gemini !== null && (
                    <Badge variant={testResults.gemini ? "default" : "destructive"}>
                      {testResults.gemini ? 'Connected' : 'Failed'}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gemini-key">API Key</Label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        id="gemini-key"
                        type={showKeys.gemini ? "text" : "password"}
                        value={maskKey(apiKeys.geminiApiKey, showKeys.gemini)}
                        onChange={(e) => handleInputChange('geminiApiKey', e.target.value)}
                        placeholder="Enter your Gemini API key"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowKeys(prev => ({ ...prev, gemini: !prev.gemini }))}
                      >
                        {showKeys.gemini ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <Button 
                      onClick={testGeminiAPI}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <TestTube className="h-4 w-4" />
                      Test
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Firebase Configuration */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      Firebase Authentication
                    </CardTitle>
                    <CardDescription>
                      Enable user authentication and data persistence
                    </CardDescription>
                  </div>
                  {testResults.firebase !== null && (
                    <Badge variant={testResults.firebase ? "default" : "destructive"}>
                      {testResults.firebase ? 'Valid' : 'Invalid'}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firebase-key">API Key</Label>
                    <div className="relative">
                      <Input
                        id="firebase-key"
                        type={showKeys.firebase ? "text" : "password"}
                        value={maskKey(apiKeys.firebaseApiKey, showKeys.firebase)}
                        onChange={(e) => handleInputChange('firebaseApiKey', e.target.value)}
                        placeholder="Firebase API Key"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firebase-domain">Auth Domain</Label>
                    <Input
                      id="firebase-domain"
                      value={apiKeys.firebaseAuthDomain}
                      onChange={(e) => handleInputChange('firebaseAuthDomain', e.target.value)}
                      placeholder="your-project.firebaseapp.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firebase-project">Project ID</Label>
                    <Input
                      id="firebase-project"
                      value={apiKeys.firebaseProjectId}
                      onChange={(e) => handleInputChange('firebaseProjectId', e.target.value)}
                      placeholder="your-project-id"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={testFirebaseConfig}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 w-full"
                    >
                      <TestTube className="h-4 w-4" />
                      Validate Config
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowKeys(prev => ({ ...prev, firebase: !prev.firebase }))}
                    className="flex items-center gap-2"
                  >
                    {showKeys.firebase ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {showKeys.firebase ? 'Hide' : 'Show'} Keys
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Save/Reset Actions */}
            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" onClick={clearAPIKeys}>
                Clear All Keys
              </Button>
              <div className="flex items-center gap-3">
                {saveStatus === 'success' && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Saved successfully</span>
                  </div>
                )}
                {saveStatus === 'error' && (
                  <div className="flex items-center gap-2 text-red-600">
                    <XCircle className="h-4 w-4" />
                    <span className="text-sm">Save failed</span>
                  </div>
                )}
                <Button 
                  onClick={saveAPIKeys}
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  {isSaving ? 'Saving...' : 'Save Configuration'}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="help">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How to Get Your API Keys</CardTitle>
                <CardDescription>Step-by-step guide to obtain the required API keys</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">🤖 Gemini AI API Key</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                    <li>Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a></li>
                    <li>Sign in with your Google account</li>
                    <li>Click "Create API Key"</li>
                    <li>Copy the generated API key</li>
                    <li>Paste it in the Gemini AI API field above</li>
                  </ol>
                  <Alert className="mt-3">
                    <AlertDescription>
                      <strong>Free tier available:</strong> Google provides free access with generous quotas for personal projects.
                    </AlertDescription>
                  </Alert>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">🔥 Firebase Configuration</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                    <li>Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Firebase Console</a></li>
                    <li>Create a new project or select existing one</li>
                    <li>Click "Project Settings" (gear icon)</li>
                    <li>Scroll down to "Your apps" and add a web app</li>
                    <li>Copy the configuration values:
                      <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                        <li><code className="text-xs bg-gray-100 px-1 rounded">apiKey</code></li>
                        <li><code className="text-xs bg-gray-100 px-1 rounded">authDomain</code></li>
                        <li><code className="text-xs bg-gray-100 px-1 rounded">projectId</code></li>
                      </ul>
                    </li>
                    <li>Enable Authentication in your Firebase project</li>
                  </ol>
                  <Alert className="mt-3">
                    <AlertDescription>
                      <strong>Free tier:</strong> Firebase offers generous free quotas for authentication and database usage.
                    </AlertDescription>
                  </Alert>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">🔒 Security Notes</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>API keys are stored locally in your browser</li>
                    <li>Keys are not transmitted to any third-party servers</li>
                    <li>Clear your keys if using a shared computer</li>
                    <li>Firebase keys are safe to use in frontend applications</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
