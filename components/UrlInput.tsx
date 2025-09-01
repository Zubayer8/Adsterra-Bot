import React from 'react';

interface ToggleSwitchProps {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, setEnabled, disabled = false }) => {
  const handleToggle = () => {
    if (!disabled) {
      setEnabled(!enabled);
    }
  };

  return (
    <button
      type="button"
      className={`${
        enabled ? 'bg-teal-600' : 'bg-gray-600'
      } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed`}
      role="switch"
      aria-checked={enabled}
      onClick={handleToggle}
      disabled={disabled}
    >
      <span
        className={`${
          enabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
      />
    </button>
  );
};


interface UrlInputProps {
  url: string;
  setUrl: (url: string) => void;
  onBrowse: () => void;
  isLoading: boolean;
  isAutoCycleEnabled: boolean;
  setIsAutoCycleEnabled: (enabled: boolean) => void;
  isCyclingActive: boolean;
  onStartCycling: () => void;
  onStopCycling: () => void;
  cycleInterval: string;
  setCycleInterval: (interval: string) => void;
  cycleCount: number;
}

const UrlInput: React.FC<UrlInputProps> = ({ 
  url, setUrl, onBrowse, isLoading,
  isAutoCycleEnabled, setIsAutoCycleEnabled, isCyclingActive,
  onStartCycling, onStopCycling, cycleInterval, setCycleInterval, cycleCount
}) => {
  const handleMainButtonClick = () => {
    if (isAutoCycleEnabled) {
      if (isCyclingActive) {
        onStopCycling();
      } else {
        onStartCycling();
      }
    } else {
      onBrowse();
    }
  };

  const mainButtonText = isAutoCycleEnabled ? (isCyclingActive ? 'Stop Cycling' : 'Start Cycling') : 'Browse';
  const isButtonDisabled = isLoading && !isCyclingActive;
  const buttonClass = isAutoCycleEnabled && isCyclingActive 
    ? "bg-red-600 hover:bg-red-500 focus:ring-red-500" 
    : "bg-teal-600 hover:bg-teal-500 focus:ring-teal-500";

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 mb-8">
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to browse (e.g., example.com)"
          className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors disabled:bg-gray-700"
          disabled={isCyclingActive}
        />
        <button
          onClick={handleMainButtonClick}
          disabled={isButtonDisabled}
          className={`w-full md:w-auto flex items-center justify-center px-6 py-3 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed ${buttonClass}`}
        >
          {isLoading && !isCyclingActive ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Browsing...
            </>
          ) : (
            mainButtonText
          )}
        </button>
      </div>

      {/* Advanced Controls Section */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex flex-col sm:flex-row items-center justify-start gap-4 sm:gap-6">
            <div className="flex items-center space-x-3">
                <label htmlFor="auto-cycle-toggle" className="font-medium text-gray-300">Auto-Cycle</label>
                <ToggleSwitch enabled={isAutoCycleEnabled} setEnabled={setIsAutoCycleEnabled} disabled={isCyclingActive} />
            </div>
            {isAutoCycleEnabled && (
                <div className="flex items-center space-x-2">
                    <label htmlFor="cycle-interval" className="text-sm text-gray-400">Interval (s):</label>
                    <input
                        type="number"
                        id="cycle-interval"
                        value={cycleInterval}
                        onChange={(e) => setCycleInterval(e.target.value)}
                        disabled={isCyclingActive}
                        className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        min="5"
                    />
                </div>
            )}
            {isCyclingActive && (
                <div className="text-sm text-teal-400 animate-pulse">
                    Cycles Completed: <span className="font-bold text-lg text-white">{cycleCount}</span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default UrlInput;
