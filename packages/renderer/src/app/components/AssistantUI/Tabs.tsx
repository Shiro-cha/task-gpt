type Props = {
  activeTab: "chat" | "logs";
  onTabChange: (tab: "chat" | "logs") => void;
};

export default function Tabs({ activeTab, onTabChange }: Props) {
  return (
    <div className="flex gap-2 mb-3 flex-shrink-0">
      <button
        onClick={() => onTabChange("chat")}
        className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
          activeTab === "chat" ? "bg-blue-600 text-white shadow-md" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
        }`}
      >
        Chat
      </button>
      <button
        onClick={() => onTabChange("logs")}
        className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
          activeTab === "logs" ? "bg-blue-600 text-white shadow-md" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
        }`}
      >
        Screen
      </button>
    </div>
  );
}
