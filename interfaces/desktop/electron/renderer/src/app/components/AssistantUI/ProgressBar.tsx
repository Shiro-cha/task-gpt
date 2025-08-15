type Props = { progress: number };

export default function ProgressBar({ progress }: Props) {
  return (
    <div className="mt-3 h-2 w-full bg-gray-700 rounded-full flex-shrink-0 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-green-400 transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
