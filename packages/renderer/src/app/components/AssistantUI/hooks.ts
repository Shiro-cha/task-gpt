import { useState, useEffect, useRef } from "react";
import type { Message } from "./types";

export function useAssistantStages(setLogs: (l: string[]) => void, setMessages: (m: Message[]) => void) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing...");

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
    const addLog = (msg: string) => setLogs((prev: any) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    const addMessage = (msg: string) => setMessages((prev: any) => [...prev, { from: "bot", text: msg }]);

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

  return { progress, status };
}
