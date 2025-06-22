import { useState } from 'react';
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { Watchlist } from '@/components/Watchlist';
import { Diary } from '@/components/Diary';
import { Settings } from '@/components/Settings';
import { AIAssistant } from '@/components/AIAssistant';
import { CurrencyProvider } from '@/hooks/useCurrency';

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'watchlist':
        return <Watchlist />;
      case 'diary':
        return <Diary />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <CurrencyProvider>
      <div className="min-h-screen bg-background">
        <div className="flex h-screen w-full">
          {/* Sidebar */}
          <div className={`transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} flex-shrink-0`}>
            <Sidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              isCollapsed={sidebarCollapsed}
              onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Content Area */}
            <div className="flex-1 overflow-auto">
              <div className="p-6 h-full">
                <div className="max-w-7xl mx-auto h-full">
                  {renderActiveSection()}
                </div>
              </div>
            </div>

            {/* AI Assistant Sidebar */}
            <div className={`transition-all duration-300 ${aiAssistantOpen ? 'w-80' : 'w-0'} flex-shrink-0 overflow-hidden`}>
              <AIAssistant
                isOpen={aiAssistantOpen}
                onClose={() => setAiAssistantOpen(false)}
              />
            </div>
          </div>

          {/* Floating AI Button */}
          {!aiAssistantOpen && (
            <Button
              onClick={() => setAiAssistantOpen(true)}
              className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl z-50"
              size="sm"
            >
              <Bot className="h-6 w-6" />
            </Button>
          )}
        </div>
      </div>
    </CurrencyProvider>
  );
};

export default Index;
