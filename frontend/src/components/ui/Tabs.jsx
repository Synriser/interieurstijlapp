import { useState } from 'react';

/**
 * Tabs Component
 * Accessible tab interface with keyboard navigation
 */
function Tabs({ tabs, defaultTab = 0, className = '' }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className={className}>
      {/* Tab List */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab, index) => {
            const isActive = activeTab === index;
            return (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  transition-colors duration-200
                  ${
                    isActive
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="flex items-center gap-2">
                  {tab.icon && <span>{tab.icon}</span>}
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Panels */}
      <div className="mt-6">
        {tabs[activeTab] && (
          <div
            role="tabpanel"
            className="focus:outline-none"
            tabIndex={0}
          >
            {tabs[activeTab].content}
          </div>
        )}
      </div>
    </div>
  );
}

export default Tabs;
