
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PlayerControls } from './player/PlayerControls';
import { VolumeControls } from './player/VolumeControls';
import { ProgressBar } from './player/ProgressBar';

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
          <ProgressBar 
            currentTime={currentTime}
            duration={duration}
            onProgressChange={handleProgressChange}
          />
          
          <div className="flex justify-between items-center">
            <PlayerControls 
              isPlaying={isPlaying}
              onPlayPause={togglePlay}
              onSkipBackward={() => skip(-10)}
              onSkipForward={() => skip(10)}
            />
            
            <VolumeControls 
              volume={volume}
              muted={muted}
              onVolumeChange={handleVolumeChange}
              onToggleMute={toggleMute}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
