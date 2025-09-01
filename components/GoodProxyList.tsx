import React from 'react';

interface GoodProxyListProps {
  goodProxies: string[];
}

const GoodProxyList: React.FC<GoodProxyListProps> = ({ goodProxies }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
      <h3 className="text-lg font-semibold mb-3 text-green-400">
        Verified Good Proxies ({goodProxies.length})
      </h3>
      <div className="bg-gray-900/50 rounded-md h-48 overflow-y-auto p-2 border border-gray-700">
        {goodProxies.length > 0 ? (
          goodProxies.map((proxy, index) => (
            <p key={index} className="text-sm text-gray-300 font-mono p-1 truncate" title={proxy}>
              {proxy}
            </p>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No good proxies verified yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default GoodProxyList;
