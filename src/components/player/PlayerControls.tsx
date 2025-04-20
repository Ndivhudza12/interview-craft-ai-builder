
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onSkipBackward: () => void;
  onSkipForward: () => void;
}

export function PlayerControls({
  isPlaying,
  onPlayPause,
  onSkipBackward,
  onSkipForward
}: PlayerControlsProps) {
  return (
    <div className="flex items-center gap-1">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onSkipBackward}
        className="hover:bg-indigo-100 hover:text-indigo-700"
      >
        <SkipBack className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onPlayPause}
        className="hover:bg-indigo-100 hover:text-indigo-700"
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onSkipForward}
        className="hover:bg-indigo-100 hover:text-indigo-700"
      >
        <SkipForward className="h-4 w-4" />
      </Button>
    </div>
  );
}
