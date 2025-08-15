"use client";

import { useState, useEffect, useRef } from "react";

export default function AssistantUI() {
  const [logs, setLogs] = useState<string[]>([]);
  const [messages, setMessages] = useState<{ from: "bot" | "user"; text: string }[]>([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing...");
  const [activeTab, setActiveTab] = useState<"chat" | "logs">("chat");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    const addMessage = (msg: string) => setMessages(prev => [...prev, { from: "bot", text: msg }]);

    const processStage = () => {
      if (current >= stages.length) return;
      const stage = stages[current];
      setStatus(stage.text);
      addLog(stage.text);
      addMessage(stage.text);

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
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const text = inputRef.current?.value.trim();
    if (!text) return;

    setMessages(prev => [...prev, { from: "user", text }]);
    setLogs(prev => [...prev, `[USER] ${text}`]);
    inputRef.current!.value = "";

    setTimeout(() => {
      const botReply = `Bot says: "${text.split("").reverse().join("")}"`;
      setMessages(prev => [...prev, { from: "bot", text: botReply }]);
      setLogs(prev => [...prev, `[BOT] ${botReply}`]);
    }, 500);
  };

  return (
    <div className="w-screen h-screen bg-gray-900 text-gray-100 flex flex-col p-4 overflow-hidden">
      <header className="flex items-center justify-between mb-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl animate-bounce shadow-lg">
            🤖
          </div>
          <h1 className="text-xl font-bold tracking-wide">Echo</h1>
        </div>
        <div className="flex gap-2">
          <button className="w-3 h-3 bg-red-500 rounded-full" />
          <button className="w-3 h-3 bg-yellow-500 rounded-full" />
          <button className="w-3 h-3 bg-green-500 rounded-full" />
        </div>
      </header>

      <div className="flex gap-2 mb-3 flex-shrink-0">
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "chat" ? "bg-blue-600 text-white shadow-md" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          Chat
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "logs" ? "bg-blue-600 text-white shadow-md" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
        >
          Logs
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto bg-gray-800 rounded-xl p-4 flex flex-col gap-2">
        {activeTab === "chat" &&
          messages.map((msg, i) => (
            <div
              key={i}
              className={`px-4 py-2 rounded-2xl max-w-[75%] break-words shadow-md ${
                msg.from === "bot"
                  ? "bg-blue-700 self-start animate-fadeIn"
                  : "bg-green-600 self-end ml-auto animate-fadeIn"
              }`}
            >
              {msg.text}
            </div>
          ))}

        {activeTab === "logs" &&
          logs.map((log, i) => (
            <div
              key={i}
              className={`text-sm ${log.includes("BOT") ? "text-blue-400" : log.includes("USER") ? "text-green-400" : "text-gray-100"}`}
            >
              {log}
            </div>
          ))}
        <div ref={chatEndRef} />
      </div>

      <div className="mt-3 flex-shrink-0 flex gap-3 items-center">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command..."
            className="peer w-full bg-gray-800 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <label className="absolute left-4 top-1.5 text-gray-400 text-sm pointer-events-none peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base transition-all">
            Enter command...
          </label>
        </div>
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-2xl shadow-md transition-all active:scale-95"
        >
          Send
        </button>
      </div>

      <div className="mt-3 h-2 w-full bg-gray-700 rounded-full flex-shrink-0 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 to-green-400 transition-all" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
