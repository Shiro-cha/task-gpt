import { BOT_AVATAR, BOT_NAME } from "@/app/constants/bot";


export default function Header() {
  return (
    <header className="flex items-center justify-between mb-3 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl shadow-lg">
          {BOT_AVATAR}
        </div>
        <h1 className="text-xl font-bold tracking-wide">{BOT_NAME}</h1>
      </div>
      <div className="flex gap-2">
        <button className="w-3 h-3 bg-red-500 rounded-full" />
        <button className="w-3 h-3 bg-yellow-500 rounded-full" />
        <button className="w-3 h-3 bg-green-500 rounded-full" />
      </div>
    </header>
  );
}
