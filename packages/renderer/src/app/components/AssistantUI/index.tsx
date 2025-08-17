"use client";
import { useState, useRef } from "react";
import { Message } from "./types";
import { useAssistantStages } from "./hooks";
import Header from "./Header";
import Tabs from "./Tabs";
import ChatWindow from "./ChatWindow";
import LogsWindow from "./LogsWindow";
import InputBar from "./InputBar";
import ProgressBar from "./ProgressBar";

export default function AssistantUI() {
  const [logs, setLogs] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<"chat" | "logs">("chat");
  const chatEndRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const inputRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;

  const { progress } = useAssistantStages(setLogs, setMessages);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { from: "user", text }]);
    setLogs(prev => [...prev, `[USER] ${text}`]);
    if (inputRef.current) inputRef.current.value = "";

    setTimeout(() => {
      const botReply = `Bot says: "${text.split("").reverse().join("")}"`;
      setMessages(prev => [...prev, { from: "bot", text: botReply }]);
      setLogs(prev => [...prev, `[BOT] ${botReply}`]);
    }, 500);
  };

  return (
    <div className="w-screen h-screen bg-gray-900 text-gray-100 flex flex-col p-4 overflow-hidden">
      <Header />
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "chat" ? (
        <ChatWindow messages={messages} chatEndRef={chatEndRef} />
      ) : (
        <LogsWindow logs={logs} />
      )}
      <InputBar onSend={handleSend} inputRef={inputRef} />
      <ProgressBar progress={progress} />
    </div>
  );
}
