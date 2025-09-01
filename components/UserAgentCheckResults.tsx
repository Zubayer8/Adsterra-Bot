import React from 'react';

interface UserAgentCheckResultsProps {
  goodUserAgents: string[];
  badUserAgents: string[];
  isChecking: boolean;
}

const UserAgentList: React.FC<{ title: string; userAgents: string[]; color: string }> = ({ title, userAgents, color }) => (
  <div className="flex-1 min-w-0">
    <h3 className={`text-lg font-semibold mb-2 ${color}`}>{title} ({userAgents.length})</h3>
    <div className="bg-gray-900/50 rounded-md h-48 overflow-y-auto p-2 border border-gray-700">
      {userAgents.length > 0 ? (
        userAgents.map((ua, index) => (
            <p key={index} className="text-sm text-gray-400 font-mono p-1 truncate" title={ua}>{ua}</p>
        ))
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">No user agents found.</div>
      )}
    </div>
  </div>
);

const UserAgentCheckResults: React.FC<UserAgentCheckResultsProps> = ({ goodUserAgents, badUserAgents, isChecking }) => {
  if (isChecking) {
    return (
      <div className="mb-8 p-6 bg-gray-800 rounded-lg border border-gray-700 text-center">
        <div className="flex items-center justify-center">
          <svg className="animate-spin mr-3 h-5 w-5 text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-300">Checking user agents...</p>
        </div>
      </div>
    );
  }

  if (goodUserAgents.length === 0 && badUserAgents.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 p-6 bg-gray-800 rounded-lg border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4 text-center">User Agent Check Results</h2>
      <div className="flex flex-col md:flex-row gap-6">
        <UserAgentList title="Good User Agents" userAgents={goodUserAgents} color="text-green-400" />
        <UserAgentList title="Bad User Agents" userAgents={badUserAgents} color="text-red-400" />
      </div>
    </div>
  );
};

export default UserAgentCheckResults;
