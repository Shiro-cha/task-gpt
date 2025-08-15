type Props = { logs: string[] };

export default function LogsWindow({ logs }: Props) {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-gray-800 rounded-xl p-4 flex flex-col gap-1 text-sm">
      {logs.map((log, i) => (
        <div
          key={i}
          className={
            log.includes("BOT") ? "text-blue-400" : log.includes("USER") ? "text-green-400" : "text-gray-100"
          }
        >
          {log}
        </div>
      ))}
    </div>
  );
}
