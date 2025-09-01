import React from 'react';

interface StatusCardProps {
  title: string;
  count: number;
  type: 'proxy' | 'good-proxy' | 'user-agent' | 'good-user-agent';
}

const StatusCard: React.FC<StatusCardProps> = ({ title, count, type }) => {
  const getIcon = () => {
    switch (type) {
      case 'proxy':
        return <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.884 21a9 9 0 01-5.12-2.884M16.116 21a9 9 0 00-5.12-2.884m-2.848-12.872A9.006 9.006 0 0112 3c2.485 0 4.733.994 6.364 2.636m-1.316 9.328a9.006 9.006 0 01-2.088 2.088"></path></svg>;
      case 'good-proxy':
        return <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>;
      case 'user-agent':
        return <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>;
      case 'good-user-agent':
        return <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>;
    }
  }
  
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 flex items-center space-x-4">
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-bold text-white">{count}</p>
      </div>
    </div>
  );
};

export default StatusCard;
