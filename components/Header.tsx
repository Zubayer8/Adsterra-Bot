import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4 md:px-8 py-6 text-center">
        <h1 className="text-4xl font-bold text-teal-400 tracking-wider">
          ProxyLink Browser
        </h1>
        <p className="text-gray-400 mt-2">
          Simulate browsing websites with custom proxies and user agents.
        </p>
      </div>
    </header>
  );
};

export default Header;
