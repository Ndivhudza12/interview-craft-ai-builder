
interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onProgressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface TimeFormatterProps {
  time: number;
}

function TimeFormatter({ time }: TimeFormatterProps) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return (
    <span className="text-xs text-gray-500">
      {minutes}:{seconds.toString().padStart(2, '0')}
    </span>
  );
}

export function ProgressBar({ currentTime, duration, onProgressChange }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-2">
      <TimeFormatter time={currentTime} />
      <input
        type="range"
        min="0"
        max={duration || 100}
        step="0.1"
        value={currentTime}
        onChange={onProgressChange}
        className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
      />
      <TimeFormatter time={duration} />
    </div>
  );
}
