"use client";

import { useState, useEffect, useRef } from 'react';

export default function AssistantUI() {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing...');
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stages = [
      { text: "Booting assistant...", duration: 500, progress: 10 },
      { text: "Loading modules...", duration: 600, progress: 30 },
      { text: "Connecting server...", duration: 700, progress: 50 },
      { text: "Syncing APIs...", duration: 800, progress: 70 },
      { text: "Finalizing setup...", duration: 500, progress: 90 },
      { text: "Assistant ready!", duration: 400, progress: 100 },
    ];

    let current = 0;
    const addLog = (msg: string) =>
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

    const processStage = () => {
      if (current >= stages.length) return;
      const stage = stages[current];
      setStatus(stage.text);
      addLog(stage.text);

      const start = progress;
      const end = stage.progress;
      const increment = (end - start) / (stage.duration / 30);

      const interval = setInterval(() => {
        setProgress(prev => {
          const next = prev + increment;
          return next >= end ? end : next;
        });
      }, 30);

      setTimeout(() => {
        clearInterval(interval);
        current++;
        processStage();
      }, stage.duration);
    };

    processStage();
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="w-screen h-screen bg-gray-900 text-gray-100 flex flex-col p-4 overflow-hidden">
      <header className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl animate-bounce">
            🤖
          </div>
          <h1 className="text-lg font-bold">TaskGPT</h1>
        </div>
        <div className="flex gap-2">
          <button className="w-3 h-3 bg-red-500 rounded-full" />
          <button className="w-3 h-3 bg-yellow-500 rounded-full" />
          <button className="w-3 h-3 bg-green-500 rounded-full" />
        </div>
      </header>

      <div className="flex-1 min-h-0 overflow-y-auto bg-gray-800 rounded-lg p-3 font-mono text-sm">
        {logs.map((log, i) => (
          <div
            key={i}
            className={log.toLowerCase().includes('ready') ? 'text-green-400' : 'text-gray-100'}
          >
            {log}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>

      <div className="mb-2 mt-2 flex-shrink-0">
        <div className="h-2 w-full bg-gray-700 rounded-full">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-400 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex gap-2 items-center flex-shrink-0">
        <input
          type="text"
          placeholder="Enter command..."
          className="flex-1 bg-gray-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="bg-blue-600 px-3 py-2 rounded-lg hover:bg-blue-500">Send</button>
      </div>

      <nav className="mt-3 flex gap-2 text-xs text-gray-400 justify-center flex-shrink-0">
        <button className="hover:text-white">All</button>
        <button className="hover:text-white">Logs</button>
        <button className="hover:text-white">Errors</button>
      </nav>
    </div>
  );
}
