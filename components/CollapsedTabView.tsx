import React from 'react';

interface BrowsingSession {
  id: number;
  proxy: string;
  userAgent: string;
  cycleKey: number;
}

interface CollapsedTabViewProps {
  session: BrowsingSession;
}

const CollapsedTabView: React.FC<CollapsedTabViewProps> = ({ session }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-4">
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h4 className="text-md font-semibold text-white truncate">Tab {session.id + 1}</h4>
           <p className="text-xs text-gray-400 mt-1 truncate" title={session.proxy}>
            <span className="font-semibold text-teal-400">Proxy:</span> {session.proxy}
          </p>
          <p className="text-xs text-gray-400 mt-1 truncate" title={session.userAgent}>
            <span className="font-semibold text-indigo-400">User Agent:</span> {session.userAgent}
          </p>
        </div>
        <div className="flex flex-col items-center ml-2">
          <span className="text-xs font-medium text-gray-400">Cycles</span>
          <span className="text-xl font-bold text-teal-300">{session.cycleKey}</span>
        </div>
      </div>
    </div>
  );
};

export default CollapsedTabView;