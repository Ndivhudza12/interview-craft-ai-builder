
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX } from 'lucide-react';

interface InterviewAnswerPlayerProps {
  audioUrl?: string;
  videoUrl?: string;
  answerType: string;
  questionText: string;
}

export function InterviewAnswerPlayer({
  audioUrl,
  videoUrl,
  answerType,
  questionText
}: InterviewAnswerPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [muted, setMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRef = useRef<HTMLAudioElement | HTMLVideoElement | null>(null);
  
  // Initialize media element based on type
  useEffect(() => {
    if (answerType === 'Audio' && audioUrl) {
      audioRef.current = new Audio(audioUrl);
      mediaRef.current = audioRef.current;
    } else if (answerType === 'Video' && videoUrl) {
      mediaRef.current = videoRef.current;
    }
    
    if (mediaRef.current) {
      mediaRef.current.volume = volume;
      
      // Set up event listeners
      mediaRef.current.addEventListener('timeupdate', updateProgress);
      mediaRef.current.addEventListener('loadedmetadata', () => {
        setDuration(mediaRef.current?.duration || 0);
      });
      mediaRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
    }
    
    return () => {
      if (mediaRef.current) {
        mediaRef.current.pause();
        mediaRef.current.removeEventListener('timeupdate', updateProgress);
        mediaRef.current.removeEventListener('loadedmetadata', () => {});
        mediaRef.current.removeEventListener('ended', () => {});
      }
    };
  }, [audioUrl, videoUrl, answerType]);
  
  const updateProgress = () => {
    if (mediaRef.current) {
      setCurrentTime(mediaRef.current.currentTime);
    }
  };
  
  const togglePlay = () => {
    if (!mediaRef.current) return;
    
    if (isPlaying) {
      mediaRef.current.pause();
    } else {
      mediaRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (mediaRef.current) {
      setCurrentTime(newTime);
      mediaRef.current.currentTime = newTime;
    }
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (mediaRef.current) {
      mediaRef.current.volume = newVolume;
    }
    
    if (newVolume === 0) {
      setMuted(true);
    } else if (muted) {
      setMuted(false);
    }
  };
  
  const toggleMute = () => {
    if (!mediaRef.current) return;
    
    if (muted) {
      mediaRef.current.volume = volume;
      setMuted(false);
    } else {
      mediaRef.current.volume = 0;
      setMuted(true);
    }
  };
  
  const skip = (seconds: number) => {
    if (!mediaRef.current) return;
    
    const newTime = Math.min(
      Math.max(0, mediaRef.current.currentTime + seconds),
      mediaRef.current.duration
    );
    
    setCurrentTime(newTime);
    mediaRef.current.currentTime = newTime;
  };
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // If no media available
  if ((answerType === 'Audio' && !audioUrl) || (answerType === 'Video' && !videoUrl)) {
    return (
      <Card className="border animate-fade-in bg-gray-50">
        <CardContent className="p-4 text-center">
          <p className="text-gray-500">No {answerType.toLowerCase()} available for this answer.</p>
        </CardContent>
      </Card>
    );
  }
  
  // If "Text" answer type, don't show player
  if (answerType === 'Text') {
    return null;
  }
  
  return (
    <Card className="bg-gray-50 border animate-fade-in">
      <CardContent className="p-4">
        <p className="text-sm text-gray-600 mb-2">
          {answerType === 'Audio' ? 'Audio Recording' : 'Video Recording'} for:
        </p>
        <p className="font-medium mb-3 text-indigo-700">{questionText}</p>
        
        {answerType === 'Video' && videoUrl && (
          <div className="mb-4">
            <video 
              ref={videoRef} 
              className="w-full h-auto border" 
              src={videoUrl}
            />
          </div>
        )}
        
        <div className="space-y-2">
          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={handleProgressChange}
              className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-500">{formatTime(duration)}</span>
          </div>
          
          {/* Controls */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => skip(-10)}
                className="hover:bg-indigo-100 hover:text-indigo-700"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={togglePlay}
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
                onClick={() => skip(10)}
                className="hover:bg-indigo-100 hover:text-indigo-700"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMute}
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
                onChange={handleVolumeChange}
                className="w-16 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
