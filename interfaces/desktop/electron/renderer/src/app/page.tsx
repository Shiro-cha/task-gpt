// app/page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';

export default function ServerLoader() {
  const [status, setStatus] = useState("Starting server...");
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Simulate the entire server startup and compilation process
  useEffect(() => {
    const stages = [
      { text: "Resolving dependencies...", duration: 800, progress: 15 },
      { text: "Loading modules...", duration: 700, progress: 30 },
      { text: "Building initial chunks...", duration: 900, progress: 45 },
      { text: "Optimizing dependencies...", duration: 1200, progress: 60 },
      { text: "Compiling with Turbopack...", duration: 1500, progress: 75 },
      { text: "Finalizing compilation...", duration: 1000, progress: 90 },
      { text: "Server ready on http://localhost:3000", duration: 500, progress: 100 },
    ];

    let currentStage = 0;
    
    const addLog = (message: string) => {
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    };

    addLog("▲ Starting Next.js 15.4.6 with Turbopack");
    addLog("Warning: Found multiple lockfiles");
    
    const processStage = () => {
      if (currentStage >= stages.length) {
        setIsReady(true);
        addLog("✓ Ready! Compilation completed successfully");
        return;
      }
      
      const stage = stages[currentStage];
      setStatus(stage.text);
      addLog(stage.text);
      
      // Simulate progress within each stage
      const startProgress = progress;
      const endProgress = stage.progress;
      const increment = (endProgress - startProgress) / (stage.duration / 30);
      
      const interval = setInterval(() => {
        setProgress(prev => {
          const next = prev + increment;
          return next >= endProgress ? endProgress : next;
        });
      }, 30);
      
      setTimeout(() => {
        clearInterval(interval);
        setProgress(endProgress);
        currentStage++;
        processStage();
      }, stage.duration);
    };

    processStage();

    return () => {
      setIsReady(true);
      setProgress(100);
    };
  }, []);

  // Auto-scroll logs to bottom
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 flex flex-col">
      <div className="max-w-4xl mx-auto w-full">
        <header className="py-6 border-b border-gray-700 mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <span className="text-green-400">▲</span>
            <span>Next.js Development Server</span>
            <span className="text-xs bg-purple-600 px-2 py-1 rounded">Turbopack</span>
          </h1>
          <p className="text-gray-400 mt-2">v15.4.6</p>
        </header>

        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-3">
            <div className="font-mono text-sm">{status}</div>
            <div className="text-sm text-gray-400">{Math.round(progress)}%</div>
          </div>
          
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="mt-4 flex gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm">Local: http://localhost:3000</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span className="text-sm">Network: http://192.168.88.251:3000</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <div className="bg-gray-900 px-4 py-2 border-b border-gray-700 font-mono text-sm">
            Server Logs
          </div>
          <div className="h-64 overflow-y-auto p-4 font-mono text-sm">
            {logs.map((log, i) => (
              <div key={i} className="mb-1 last:mb-0">
                {log.includes('Warning') ? (
                  <span className="text-yellow-400">{log}</span>
                ) : log.includes('✓') ? (
                  <span className="text-green-400">{log}</span>
                ) : log.includes('▲') ? (
                  <span className="text-blue-400">{log}</span>
                ) : (
                  <span>{log}</span>
                )}
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>

        {isReady && (
          <div className="mt-6 flex justify-end">
            <button
              className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-medium transition-colors"
              onClick={() => window.open('http://localhost:3000', '_self')}
            >
              Open Application →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}