
import { Button } from '@/components/ui/button';
import { Volume2, Volume1, VolumeX } from 'lucide-react';

interface VolumeControlsProps {
  volume: number;
  muted: boolean;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleMute: () => void;
}

export function VolumeControls({
  volume,
  muted,
  onVolumeChange,
  onToggleMute
}: VolumeControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onToggleMute}
        className="hover:bg-indigo-100 hover:text-indigo-700"
      >
        {muted ? (
          <VolumeX className="h-4 w-4" />
        ) : volume < 0.5 ? (
          <Volume1 className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
      
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={muted ? 0 : volume}
        onChange={onVolumeChange}
        className="w-16 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
      />
    </div>
  );
}
