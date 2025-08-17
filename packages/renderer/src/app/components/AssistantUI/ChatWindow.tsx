import type { Message } from "./types";

type Props = { messages: Message[]; chatEndRef: React.RefObject<HTMLDivElement> };

export default function ChatWindow({ messages, chatEndRef }: Props) {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-gray-800 rounded-xl p-4 flex flex-col gap-2">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`px-4 py-2 rounded-2xl max-w-[75%] break-words shadow-md ${
            msg.from === "bot" ? "bg-blue-700 self-start" : "bg-green-600 self-end ml-auto"
          }`}
        >
          {msg.text}
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
}
