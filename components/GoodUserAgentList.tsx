import React from 'react';

interface GoodUserAgentListProps {
  goodUserAgents: string[];
}

const GoodUserAgentList: React.FC<GoodUserAgentListProps> = ({ goodUserAgents }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
      <h3 className="text-lg font-semibold mb-3 text-indigo-400">
        Verified Good User Agents ({goodUserAgents.length})
      </h3>
      <div className="bg-gray-900/50 rounded-md h-48 overflow-y-auto p-2 border border-gray-700">
        {goodUserAgents.length > 0 ? (
          goodUserAgents.map((ua, index) => (
            <p key={index} className="text-sm text-gray-300 font-mono p-1 truncate" title={ua}>
              {ua}
            </p>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No good user agents verified yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default GoodUserAgentList;
