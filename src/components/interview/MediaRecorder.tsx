
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Video, Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MediaRecorderProps {
  type: 'Video' | 'Audio';
  onRecordingComplete: () => void;
  setIsRecording: (isRecording: boolean) => void;
}

export function MediaRecordingSection({ type, onRecordingComplete, setIsRecording }: MediaRecorderProps) {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const constraints = {
        audio: true,
        video: type === 'Video' ? true : false
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setMediaStream(stream);
      
      if (type === 'Video' && videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
          setRecordedChunks([...chunks]);
        }
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: type === 'Video' ? 'video/webm' : 'audio/webm' });
        const url = URL.createObjectURL(blob);
        
        toast({
          title: `${type} recording completed`,
          description: "In a production app, this would be saved to the server."
        });
        
        if (mediaStream) {
          mediaStream.getTracks().forEach(track => track.stop());
        }
        URL.revokeObjectURL(url);
      };
      
      recorder.start();
      setIsRecording(true);
      
      toast({
        title: `${type} recording started`,
        description: "Recording in progress..."
      });
    } catch (err) {
      console.error("Error accessing media devices:", err);
      toast({
        title: "Recording failed",
        description: "Could not access your media devices. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
      onRecordingComplete();
      
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    }
  };

  if (!isRecording) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        {type === 'Video' ? (
          <Video className="h-12 w-12 mx-auto text-indigo-500 mb-2" />
        ) : (
          <Mic className="h-12 w-12 mx-auto text-blue-500 mb-2" />
        )}
        <p className="text-gray-700 font-medium">Ready to record your {type.toLowerCase()} answer</p>
        <Button 
          onClick={startRecording}
          className={`mt-4 ${type === 'Video' ? 'bg-indigo-600' : 'bg-blue-600'}`}
        >
          Start {type} Recording
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          You'll need to grant {type === 'Video' ? 'camera and microphone' : 'microphone'} permissions
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 rounded-lg p-4">
      {type === 'Video' && (
        <div className="aspect-video bg-black rounded-lg overflow-hidden relative mb-3">
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-red-500 h-3 w-3 rounded-full animate-pulse"></div>
        </div>
      )}
      {type === 'Audio' && (
        <div className="h-24 flex items-center justify-center">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className="w-1 bg-blue-500 rounded-full animate-pulse" 
                style={{
                  height: `${20 + (Math.sin(Date.now() / (200 * i)) + 1) * 15}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              ></div>
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-center">
        <Button 
          variant="destructive"
          onClick={stopRecording}
        >
          Stop Recording
        </Button>
      </div>
    </div>
  );
}
