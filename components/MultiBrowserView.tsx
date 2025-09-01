import React, { useState } from 'react';
import BrowserTabView from './BrowserTabView';
import CollapsedTabView from './CollapsedTabView';

interface BrowsingSession {
  id: number;
  proxy: string;
  userAgent: string;
  cycleKey: number;
}

interface MultiBrowserViewProps {
  sessions: BrowsingSession[];
  url: string;
  isTransitioning: boolean;
}

const MultiBrowserView: React.FC<MultiBrowserViewProps> = ({ sessions, url, isTransitioning }) => {
  const [areTabsVisible, setAreTabsVisible] = useState(false);

  if (sessions.length === 0) {
    return (
      <div className="mt-8 p-10 bg-gray-800 rounded-lg border border-gray-700 text-center text-gray-400">
        <h3 className="text-xl font-semibold mb-2 text-white">Multi-Browser Simulation</h3>
        <p>Ready to launch 4 concurrent browsing tabs.</p>
        <p className="text-sm mt-2">Requires at least 4 good proxies and 4 good user agents.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="text-center mb-4">
        <button
          onClick={() => setAreTabsVisible(!areTabsVisible)}
          className="px-6 py-2 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500 transition-colors"
        >
          {areTabsVisible ? 'Hide Browsers' : 'Show Browsers'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sessions.map(session => (
            areTabsVisible ? (
                <BrowserTabView 
                    key={session.id}
                    session={session}
                    url={url}
                    isTransitioning={isTransitioning}
                />
            ) : (
                <CollapsedTabView
                    key={session.id}
                    session={session}
                />
            )
        ))}
      </div>
    </div>
  );
};

export default MultiBrowserView;