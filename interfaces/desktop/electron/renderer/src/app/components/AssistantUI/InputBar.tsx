type Props = { onSend: (text: string) => void; inputRef: React.RefObject<HTMLInputElement> };

export default function InputBar({ onSend, inputRef }: Props) {
  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && onSend(inputRef.current!.value);

  return (
    <div className="mt-3 flex-shrink-0 flex gap-3 items-center">
      <input
        ref={inputRef}
        type="text"
        placeholder="Type a command..."
        onKeyDown={handleKey}
        className="flex-1 bg-gray-800 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />
      <button
        onClick={() => onSend(inputRef.current!.value)}
        className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-2xl shadow-md transition-all active:scale-95"
      >
        Send
      </button>
    </div>
  );
}
