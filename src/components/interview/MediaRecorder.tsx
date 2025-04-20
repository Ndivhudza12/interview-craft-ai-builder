
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
  const [isRecordingActive, setIsRecordingActive] = useState(false);
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
          description: "Click Next to proceed with the analysis."
        });
        
        if (mediaStream) {
          mediaStream.getTracks().forEach(track => track.stop());
        }
        URL.revokeObjectURL(url);
        
        // Ensure we call onRecordingComplete to trigger analysis
        onRecordingComplete();
      };
      
      recorder.start();
      setIsRecordingActive(true);
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
      setIsRecordingActive(false);
      setIsRecording(false);
      
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    }
  };

  if (!isRecordingActive) {
    return (
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 text-center shadow-lg transform transition-all hover:scale-[1.02]">
        {type === 'Video' ? (
          <Video className="h-12 w-12 mx-auto text-indigo-600 mb-2" />
        ) : (
          <Mic className="h-12 w-12 mx-auto text-purple-600 mb-2" />
        )}
        <p className="text-gray-700 font-medium mb-4">Ready to record your {type.toLowerCase()} answer</p>
        <Button 
          onClick={startRecording}
          className={`bg-gradient-to-r ${type === 'Video' ? 
            'from-indigo-600 to-indigo-700' : 
            'from-purple-600 to-purple-700'} 
            hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg`}
        >
          Start {type} Recording
        </Button>
        <p className="text-xs text-gray-500 mt-3">
          You'll need to grant {type === 'Video' ? 'camera and microphone' : 'microphone'} permissions
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 shadow-lg">
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
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className="w-1 bg-purple-500 rounded-full animate-pulse" 
                style={{
                  height: `${20 + (Math.sin(Date.now() / (200 * i)) + 1) * 15}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              ></div>
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-center mt-4">
        <Button 
          variant="destructive"
          onClick={stopRecording}
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg"
        >
          Stop Recording
        </Button>
      </div>
    </div>
  );
}
