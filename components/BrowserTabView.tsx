import React, { useState, useEffect, useRef } from 'react';

interface BrowsingSession {
  id: number;
  proxy: string;
  userAgent: string;
  cycleKey: number;
}

interface BrowserTabViewProps {
  session: BrowsingSession;
  url: string;
  isTransitioning: boolean;
}

// Generates more realistic, randomized action descriptions for the log.
const simulateRandomAction = (): string => {
    const actionType = Math.random();

    // 50% scroll, 40% click/interaction, 10% pause
    if (actionType < 0.5) { // scroll
        const scrollType = Math.random();
        // Prioritize random depth scrolling to make it more common.
        if (scrollType < 0.7) { // 70% chance for random depth scroll
            return `Scrolling to ${Math.floor(Math.random() * 70 + 20)}% of the page.`;
        } else if (scrollType < 0.85) { // 15% chance for slow scroll
            return `Scrolling down slowly...`;
        } else { // 15% chance for jump to bottom
            return `Jumping to page bottom.`;
        }
    } else if (actionType < 0.9) { // click/interaction
        const interactionType = Math.random();
        const linkTexts = ['About Us', 'Contact', 'Products', 'Read More', 'View Details', 'Privacy Policy', 'Login', 'Help Center', 'Terms of Service'];
        const buttonTexts = ['Submit', 'Sign Up', 'Add to Cart', 'Search', 'Get Started', 'Continue', 'Download Now', 'Learn More'];
        
        const complexInteractions = [
            () => 'Interacting with an image.',
            () => {
                const videoActions = ['Playing video.', 'Pausing video.', 'Adjusting video volume.'];
                return videoActions[Math.floor(Math.random() * videoActions.length)];
            },
            () => 'Closing a promotional banner.',
            () => {
                const inputActions = ['Typing in an input field.', 'Clearing an input field.', 'Focusing on a search bar.'];
                return inputActions[Math.floor(Math.random() * inputActions.length)];
            },
            () => 'Opening a dropdown menu.',
            () => 'Accepting cookie consent.',
            () => 'Clicking a generic container (div).'
        ];

        if (interactionType < 0.4) { // 40% link click
            const text = linkTexts[Math.floor(Math.random() * linkTexts.length)];
            return `Following link with text: "${text}"`;
        } else if (interactionType < 0.8) { // 40% button click
             const text = buttonTexts[Math.floor(Math.random() * buttonTexts.length)];
            return `Clicking on button: "${text}"`;
        } else { // 20% complex interaction
            const actionFn = complexInteractions[Math.floor(Math.random() * complexInteractions.length)];
            return actionFn();
        }
    } else { // pause
        const pauseType = Math.random();
        if (pauseType < 0.5) {
            return 'Pausing to read content.';
        } else {
            return 'Simulating mouse hover over element.';
        }
    }
};

const BrowserTabView: React.FC<BrowserTabViewProps> = ({ session, url, isTransitioning }) => {
    const [actionLog, setActionLog] = useState<string[]>([]);
    const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const addActionLog = (message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setActionLog(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 20));
    };

    useEffect(() => {
        // Clear previous interval if it exists
        if (intervalRef.current) {
            clearTimeout(intervalRef.current);
        }

        // Reset log when the session changes
        setActionLog([]);
        addActionLog("New session started.");

        const scheduleNextAction = () => {
            const randomDelay = Math.random() * 5000 + 3000; // 3-8 seconds
            intervalRef.current = setTimeout(() => {
                const randomAction = simulateRandomAction(); // Use the new dynamic function
                addActionLog(randomAction);
                scheduleNextAction();
            }, randomDelay);
        };

        scheduleNextAction();

        // Cleanup on component unmount or re-render
        return () => {
            if (intervalRef.current) {
                clearTimeout(intervalRef.current);
            }
        };
    }, [session.cycleKey]); // Rerun effect when a new cycle starts

    return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
        <div className="p-3 bg-gray-900/50 border-b border-gray-700">
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
        <div className="h-64 bg-gray-900 relative">
            {isTransitioning ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-center text-gray-400">
                <svg className="w-12 h-12 text-teal-400 mx-auto animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <h3 className="text-lg font-semibold text-white mt-2">Clearing Session...</h3>
            </div>
            ) : (
            <iframe
                key={`${session.id}-${session.cycleKey}`}
                src={url}
                title={`Web Content Tab ${session.id + 1}`}
                className="w-full h-full border-0"
                sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts"
                referrerPolicy="no-referrer"
            />
            )}
        </div>
        <div className="p-3 bg-gray-900/50 border-t border-gray-700">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Simulated Actions</h4>
            <div className="h-24 overflow-y-auto bg-gray-900 rounded p-2">
                {actionLog.map((log, index) => (
                    <p key={index} className="text-xs text-gray-500 font-mono">
                        {log}
                    </p>
                ))}
            </div>
        </div>
    </div>
    );
};

export default BrowserTabView;