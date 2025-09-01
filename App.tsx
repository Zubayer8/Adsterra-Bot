import React, { useState, useCallback, useEffect, useRef } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import UrlInput from './components/UrlInput';
import ProxyCheckResults from './components/ProxyCheckResults';
import UserAgentCheckResults from './components/UserAgentCheckResults';
import Dashboard from './components/Dashboard';
import MultiBrowserView from './components/MultiBrowserView';

interface BrowsingSession {
  id: number;
  proxy: string;
  userAgent: string;
  cycleKey: number;
}

const App: React.FC = () => {
  const [proxies, setProxies] = useState<string[]>([]);
  const [goodProxies, setGoodProxies] = useState<string[]>([]);
  const [badProxies, setBadProxies] = useState<string[]>([]);
  const [isCheckingProxies, setIsCheckingProxies] = useState<boolean>(false);
  
  const [userAgents, setUserAgents] = useState<string[]>([]);
  const [goodUserAgents, setGoodUserAgents] = useState<string[]>([]);
  const [badUserAgents, setBadUserAgents] = useState<string[]>([]);
  const [isCheckingUserAgents, setIsCheckingUserAgents] = useState<boolean>(false);

  const [url, setUrl] = useState<string>('');
  const [displayUrl, setDisplayUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [customDelay, setCustomDelay] = useState<string>('');

  // State for multi-browser sessions
  const [browsingSessions, setBrowsingSessions] = useState<BrowsingSession[]>([]);

  // State for auto-cycling
  const [isAutoCycleEnabled, setIsAutoCycleEnabled] = useState<boolean>(false);
  const [isCyclingActive, setIsCyclingActive] = useState<boolean>(false);
  const [cycleInterval, setCycleInterval] = useState<string>('15');
  const [cycleCount, setCycleCount] = useState<number>(0);
  const [cycleLog, setCycleLog] = useState<string[]>([]);
  const [isTransitioningCycle, setIsTransitioningCycle] = useState<boolean>(false);

  // State for sequential cycling indices
  const [currentProxyIndex, setCurrentProxyIndex] = useState<number>(0);
  const [currentUserAgentIndex, setCurrentUserAgentIndex] = useState<number>(0);

  const handleFileLoad = useCallback((content: string, type: 'proxy' | 'userAgent') => {
    setError(null);
    const lines = content.split('\n').map(line => line.trim()).filter(Boolean);
    if (type === 'proxy') {
      setProxies(lines);
      setGoodProxies([]);
      setBadProxies([]);
    } else {
      setUserAgents(lines);
      setGoodUserAgents([]);
      setBadUserAgents([]);
    }
  }, []);

  const simulatePixelScanCheck = (proxy: string, delay?: number): Promise<{ proxy: string; isGood: boolean }> => {
    return new Promise((resolve, reject) => {
      if (Math.random() < 0.05) {
        setTimeout(() => reject(new Error("PixelScan API simulation failed")), 50 + Math.random() * 100);
        return;
      }
      const checkDelay = delay !== undefined ? delay : 50 + Math.random() * 200;
      const isGood = Math.random() > 0.3;
      setTimeout(() => resolve({ proxy, isGood }), checkDelay);
    });
  };

  const simulateUserAgentCheck = (userAgent: string, delay?: number): Promise<{ userAgent: string; isGood: boolean }> => {
    return new Promise((resolve) => {
      const checkDelay = delay !== undefined ? delay : 20 + Math.random() * 100;
      const modernBrowserKeywords = ['chrome', 'firefox', 'safari', 'edge', 'mozilla'];
      const isGood = userAgent.length > 20 && modernBrowserKeywords.some(keyword => userAgent.toLowerCase().includes(keyword));
      setTimeout(() => resolve({ userAgent, isGood }), checkDelay);
    });
  };

  const handleCheckProxies = async () => {
    if (proxies.length === 0) {
      setError("Please upload a proxy file first.");
      return;
    }
    setError(null);
    setIsCheckingProxies(true);
    setGoodProxies([]);
    setBadProxies([]);

    try {
      const checkDelay = customDelay ? parseInt(customDelay, 10) || undefined : undefined;
      const results = await Promise.all(proxies.map(proxy => simulatePixelScanCheck(proxy, checkDelay)));
      setGoodProxies(results.filter(r => r.isGood).map(r => r.proxy));
      setBadProxies(results.filter(r => !r.isGood).map(r => r.proxy));
    } catch (e) {
      setError('Proxy checking failed. Please try again.');
    } finally {
      setIsCheckingProxies(false);
    }
  };

  const handleCheckUserAgents = async () => {
    if (userAgents.length === 0) {
      setError("Please upload a user agent file first.");
      return;
    }
    setError(null);
    setIsCheckingUserAgents(true);
    setGoodUserAgents([]);
    setBadUserAgents([]);

    try {
      const checkDelay = customDelay ? parseInt(customDelay, 10) || undefined : undefined;
      const results = await Promise.all(userAgents.map(ua => simulateUserAgentCheck(ua, checkDelay)));
      setGoodUserAgents(results.filter(r => r.isGood).map(r => r.userAgent));
      setBadUserAgents(results.filter(r => !r.isGood).map(r => r.userAgent));
    } catch (e) {
      setError('User agent checking failed. Please try again.');
    } finally {
      setIsCheckingUserAgents(false);
    }
  };

  const createBrowsingSessions = (startProxyIndex: number, startUAIndex: number, currentCycleCount: number): BrowsingSession[] => {
    const sessions: BrowsingSession[] = [];
    const usedProxies = new Set<string>();
    const usedUAs = new Set<string>();
    
    let pIndex = startProxyIndex;
    let uaIndex = startUAIndex;

    for (let i = 0; i < 4; i++) {
        // Find next unique proxy
        let attempts = 0;
        while(usedProxies.has(goodProxies[pIndex % goodProxies.length]) && attempts < goodProxies.length) {
            pIndex++;
            attempts++;
        }
        const proxy = goodProxies[pIndex % goodProxies.length];
        usedProxies.add(proxy);

        // Find next unique user agent
        attempts = 0;
        while(usedUAs.has(goodUserAgents[uaIndex % goodUserAgents.length]) && attempts < goodUserAgents.length) {
            uaIndex++;
            attempts++;
        }
        const userAgent = goodUserAgents[uaIndex % goodUserAgents.length];
        usedUAs.add(userAgent);

        sessions.push({
            id: i,
            proxy,
            userAgent,
            cycleKey: currentCycleCount,
        });

        pIndex++;
        uaIndex++;
    }

    // Update indices for the next cycle
    setCurrentProxyIndex(pIndex % goodProxies.length);
    setCurrentUserAgentIndex(uaIndex % goodUserAgents.length);
    
    return sessions;
  };

  const handleBrowse = () => {
    setError(null);
    if (!url) {
      setError("Please enter a URL to browse.");
      return;
    }
    if (goodProxies.length < 4) {
      setError("At least 4 verified good proxies are required for multi-browser mode.");
      return;
    }
    if (goodUserAgents.length < 4) {
      setError("At least 4 verified good user agents are required for multi-browser mode.");
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setBrowsingSessions(createBrowsingSessions(0, 0, 0));
      setDisplayUrl(/^https?:\/\//i.test(url) ? url : 'https://' + url);
      setIsLoading(false);
    }, 500);
  };
  
  const handleStopCycling = useCallback(() => {
    setIsCyclingActive(false);
    if (cycleCount > 0) {
      setCycleLog(prev => [`[${new Date().toLocaleTimeString()}] Auto-cycling stopped.`, ...prev]);
    }
  }, [cycleCount]);

  const performCycle = useCallback(() => {
    if (goodProxies.length < 4 || goodUserAgents.length < 4) {
      setError("Cannot cycle without at least 4 good proxies and user agents.");
      handleStopCycling();
      return;
    }

    setIsTransitioningCycle(true);
    const newCycleCount = cycleCount + 1;

    const logMessage = `[${new Date().toLocaleTimeString()}] Starting Cycle #${newCycleCount}. Assigning new identities.`;
    setCycleLog(prev => [logMessage, ...prev].slice(0, 100));

    setTimeout(() => {
      setBrowsingSessions(createBrowsingSessions(currentProxyIndex, currentUserAgentIndex, newCycleCount));
      setCycleCount(newCycleCount);

      if (url) {
          setDisplayUrl(/^https?:\/\//i.test(url) ? url : 'https://' + url);
      }
      setIsTransitioningCycle(false);
    }, 1000); // Increased transition time for better UX
  }, [goodProxies.length, goodUserAgents.length, url, handleStopCycling, currentProxyIndex, currentUserAgentIndex, cycleCount]);

  const handleStartCycling = () => {
    setError(null);
    if (!url) {
      setError("Please enter a URL to browse.");
      return;
    }
    if (goodProxies.length < 4 || goodUserAgents.length < 4) {
      setError("Please verify at least 4 good proxies and user agents before cycling.");
      return;
    }
    
    const intervalMs = parseInt(cycleInterval, 10) * 1000;
    if (isNaN(intervalMs) || intervalMs < 5000) { // Minimum 5 seconds
        setError("Please set a valid interval of at least 5 seconds.");
        return;
    }

    setCurrentProxyIndex(0);
    setCurrentUserAgentIndex(0);
    setCycleLog([]);
    setCycleCount(0);
    setIsCyclingActive(true);
  };
  
  const savedPerformCycle = useRef(performCycle);
  useEffect(() => {
    savedPerformCycle.current = performCycle;
  });
  
  useEffect(() => {
    if (!isCyclingActive) return;
    
    // Perform the first cycle immediately
    savedPerformCycle.current();

    const intervalMs = parseInt(cycleInterval, 10) * 1000;
    const timerId = setInterval(() => savedPerformCycle.current(), intervalMs);

    return () => clearInterval(timerId);
  }, [isCyclingActive, cycleInterval]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <FileUpload label="Upload Proxies" onFileLoad={(content) => handleFileLoad(content, 'proxy')} onError={setError} />
          <FileUpload label="Upload User Agents" onFileLoad={(content) => handleFileLoad(content, 'userAgent')} onError={setError} />
        </div>

        <div className="mb-8 text-center bg-gray-800 border border-gray-700 p-6 rounded-lg">
            <div className="max-w-xs mx-auto mb-4">
                <label htmlFor="customDelay" className="block text-sm font-medium text-gray-400 mb-1 text-left">
                    Custom Check Delay (ms)
                </label>
                <input
                    type="number"
                    id="customDelay"
                    value={customDelay}
                    onChange={(e) => setCustomDelay(e.target.value)}
                    placeholder="Optional, applies to both checks"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min="0"
                />
            </div>
            <div className="flex flex-col md:flex-row justify-center items-center gap-4">
              <button
                  onClick={handleCheckProxies}
                  disabled={isCheckingProxies || proxies.length === 0 || isCheckingUserAgents || isCyclingActive}
                  className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed w-full md:w-auto"
              >
                  {isCheckingProxies ? "Checking..." : 'Check Proxies'}
              </button>
               <button
                  onClick={handleCheckUserAgents}
                  disabled={isCheckingUserAgents || userAgents.length === 0 || isCheckingProxies || isCyclingActive}
                  className="px-8 py-3 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed w-full md:w-auto"
              >
                  {isCheckingUserAgents ? "Checking..." : 'Check User Agents'}
              </button>
            </div>
        </div>

        <ProxyCheckResults goodProxies={goodProxies} badProxies={badProxies} isChecking={isCheckingProxies} />
        <UserAgentCheckResults goodUserAgents={goodUserAgents} badUserAgents={badUserAgents} isChecking={isCheckingUserAgents} />
        <Dashboard 
            proxiesCount={proxies.length}
            goodProxiesCount={goodProxies.length}
            userAgentsCount={userAgents.length}
            goodUserAgentsCount={goodUserAgents.length}
        />
        
        <UrlInput 
            url={url} 
            setUrl={setUrl} 
            onBrowse={handleBrowse} 
            isLoading={isLoading} 
            isAutoCycleEnabled={isAutoCycleEnabled}
            setIsAutoCycleEnabled={setIsAutoCycleEnabled}
            isCyclingActive={isCyclingActive}
            onStartCycling={handleStartCycling}
            onStopCycling={handleStopCycling}
            cycleInterval={cycleInterval}
            setCycleInterval={setCycleInterval}
            cycleCount={cycleCount}
        />
        
        {error && (
            <div className="mt-4 p-3 bg-red-800/50 border border-red-600 text-red-300 rounded-md text-center">
                {error}
            </div>
        )}

        <MultiBrowserView
          sessions={browsingSessions}
          url={displayUrl}
          isTransitioning={isTransitioningCycle}
        />
        
        {cycleLog.length > 0 && (
          <div className="mt-8 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
            <div className="p-4 bg-gray-900/50 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Cycle Activity Log</h3>
            </div>
            <div className="p-4 h-48 overflow-y-auto bg-gray-900">
              {cycleLog.map((log, index) => (
                <p key={index} className="text-sm text-gray-400 font-mono p-1">
                  {log}
                </p>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
