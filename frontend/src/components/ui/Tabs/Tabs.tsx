import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'underline' | 'pills';
}

/**
 * Tabs Component
 * Accessible tab navigation
 */
const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  variant = 'underline',
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const variants = {
    underline: {
      tabList: 'border-b border-gray-200',
      tab: (isActive: boolean) => `
        px-4 py-3 text-sm font-medium border-b-2 transition-colors
        ${
          isActive
            ? 'border-amazon-orange text-amazon-orange'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        }
        ${isActive ? '' : 'hover:border-gray-300'}
      `,
    },
    pills: {
      tabList: 'space-x-1',
      tab: (isActive: boolean) => `
        px-4 py-2 text-sm font-medium rounded-full transition-colors
        ${
          isActive
            ? 'bg-amazon-orange text-white'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
        }
      `,
    },
  };

  const currentVariant = variants[variant];
  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div>
      <div className={currentVariant.tabList} role="tablist">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              disabled={tab.disabled}
              onClick={() => handleTabChange(tab.id)}
              className={currentVariant.tab(activeTab === tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        className="mt-4"
      >
        {activeContent}
      </div>
    </div>
  );
};

export default Tabs;
