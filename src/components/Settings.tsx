
import { useState } from 'react';
import { Moon, Sun, Globe, DollarSign, Bell, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

export const Settings = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currency, setCurrency] = useState('USD');
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [finnhubKey, setFinnhubKey] = useState('');
  const [openRouterKey, setOpenRouterKey] = useState('');

  const handleSaveApiKeys = () => {
    if (finnhubKey) {
      localStorage.setItem('finnhub-api-key', finnhubKey);
    }
    if (openRouterKey) {
      localStorage.setItem('openrouter-api-key', openRouterKey);
    }
    // In a real app, you'd also update the API utilities here
    alert('API keys saved! Please refresh the page for changes to take effect.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Customize your Invest IQ experience</p>
      </div>

      {/* API Configuration */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">API Configuration</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Finnhub API Key
            </label>
            <Input
              type="password"
              placeholder="Enter your Finnhub API key for real-time data"
              value={finnhubKey}
              onChange={(e) => setFinnhubKey(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-white/60"
            />
            <p className="text-xs text-gray-400 mt-1">
              Get your free API key at <a href="https://finnhub.io" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">finnhub.io</a>
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              OpenRouter API Key
            </label>
            <Input
              type="password"
              placeholder="Enter your OpenRouter API key for AI features"
              value={openRouterKey}
              onChange={(e) => setOpenRouterKey(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-white/60"
            />
            <p className="text-xs text-gray-400 mt-1">
              Get your API key at <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">openrouter.ai</a>
            </p>
          </div>
          
          <Button onClick={handleSaveApiKeys} className="bg-gradient-to-r from-green-400 to-blue-500">
            Save API Keys
          </Button>
        </div>
      </div>

      {/* Appearance */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          {isDarkMode ? <Moon className="h-5 w-5 text-blue-400" /> : <Sun className="h-5 w-5 text-yellow-400" />}
          <h2 className="text-xl font-semibold text-white">Appearance</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">Dark Mode</label>
              <p className="text-xs text-gray-400">Toggle between light and dark themes</p>
            </div>
            <Switch 
              checked={isDarkMode} 
              onCheckedChange={setIsDarkMode}
            />
          </div>
        </div>
      </div>

      {/* Market Data */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-green-400" />
          <h2 className="text-xl font-semibold text-white">Market Data</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Primary Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-2 bg-white/10 border border-white/20 rounded-md text-white"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="INR">INR - Indian Rupee</option>
              <option value="CAD">CAD - Canadian Dollar</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">Auto-refresh Data</label>
              <p className="text-xs text-gray-400">Automatically update prices every 30 seconds</p>
            </div>
            <Switch 
              checked={autoRefresh} 
              onCheckedChange={setAutoRefresh}
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">Notifications</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">Price Alerts</label>
              <p className="text-xs text-gray-400">Get notified when stocks hit your target prices</p>
            </div>
            <Switch 
              checked={notifications} 
              onCheckedChange={setNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">Market News</label>
              <p className="text-xs text-gray-400">Receive breaking market news notifications</p>
            </div>
            <Switch checked={true} />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-white">AI Insights</label>
              <p className="text-xs text-gray-400">Get AI-powered market insights and recommendations</p>
            </div>
            <Switch checked={true} />
          </div>
        </div>
      </div>

      {/* About */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-5 w-5 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">About Invest IQ</h2>
        </div>
        
        <div className="space-y-3 text-gray-300">
          <p>Version 1.0.0</p>
          <p>Your intelligent investment companion powered by real-time market data and AI analysis.</p>
          <div className="flex gap-4 text-sm">
            <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>
            <a href="#" className="text-blue-400 hover:underline">Terms of Service</a>
            <a href="#" className="text-blue-400 hover:underline">Support</a>
          </div>
        </div>
      </div>
    </div>
  );
};
