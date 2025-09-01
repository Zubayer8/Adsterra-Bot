import React from 'react';
import StatusCard from './StatusCard';

interface DashboardProps {
  proxiesCount: number;
  goodProxiesCount: number;
  userAgentsCount: number;
  goodUserAgentsCount: number;
}

const Dashboard: React.FC<DashboardProps> = ({
  proxiesCount,
  goodProxiesCount,
  userAgentsCount,
  goodUserAgentsCount,
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-white mb-4 text-center">Asset Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <StatusCard title="Proxies Loaded" count={proxiesCount} type="proxy" />
        <StatusCard title="Verified Good Proxies" count={goodProxiesCount} type="good-proxy" />
        <StatusCard title="User Agents Loaded" count={userAgentsCount} type="user-agent" />
        <StatusCard title="Verified Good User Agents" count={goodUserAgentsCount} type="good-user-agent" />
      </div>
    </div>
  );
};

export default Dashboard;
