import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Video, 
  Mic, 
  Text as TextIcon, 
  Clock, 
  ArrowRight, 
  Check, 
  Save, 
  ChevronLeft, 
  ChevronRight,
  MoveRight,
  Wand2,
  ArrowLeftCircle,
  ArrowRightCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Question {
  text: string;
  type: string;
  required: boolean;
  timeLimit: number;
}

interface Answer {
  questionId: number;
  questionText: string;
  answerText: string;
  timeSpent: number;
  type: string;
  draftSaved?: boolean;
}

interface SavedInterview {
  id: string;
  jobTitle: string;
  experience: string;
  description: string;
  questions: Question[];
}

interface InterviewSessionProps {
  interview: SavedInterview;
  onComplete: (answers: Answer[]) => void;
}

export function InterviewSession({ interview, onComplete }: InterviewSessionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  
  const currentQuestion = interview.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === interview.questions.length - 1;
  
  useEffect(() => {
    if (!currentQuestion) return;
    
    setTimeLeft(currentQuestion.timeLimit);
    setTimeSpent(0);
    setShowAnalysis(false);
    
    const existingAnswer = answers.find(a => a.questionId === currentQuestionIndex);
    if (existingAnswer) {
      setCurrentAnswer(existingAnswer.answerText);
    } else {
      setCurrentAnswer('');
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!showAnalysis) {
            saveDraft(true);
            setShowAnalysis(true);
          }
          return 0;
        }
        return prev - 1;
      });
      
      setTimeSpent(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentQuestionIndex, showAnalysis]);
  
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaStream]);
  
  const startRecording = async (type: string) => {
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
      
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    }
  };
  
  const saveDraft = (autoSave = false) => {
    const newAnswer: Answer = {
      questionId: currentQuestionIndex,
      questionText: currentQuestion.text,
      answerText: currentAnswer || (autoSave ? "No answer provided" : currentAnswer),
      timeSpent,
      type: currentQuestion.type,
      draftSaved: true
    };
    
    const updatedAnswers = [...answers];
    const existingIndex = updatedAnswers.findIndex(a => a.questionId === currentQuestionIndex);
    if (existingIndex >= 0) {
      updatedAnswers[existingIndex] = newAnswer;
    } else {
      updatedAnswers.push(newAnswer);
    }
    
    setAnswers(updatedAnswers);
    
    localStorage.setItem(`interview-${interview.id}-drafts`, JSON.stringify(updatedAnswers));
    
    if (!autoSave) {
      toast({
        title: "Draft saved",
        description: "Your answer has been saved as a draft."
      });
    }
  };
  
  const handleNextQuestion = () => {
    if (showAnalysis) {
      if (isLastQuestion) {
        setIsSubmitting(true);
        setTimeout(() => {
          onComplete(answers);
        }, 1000);
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
      return;
    }
    
    saveDraft(true);
    setShowAnalysis(true);
    
    if (isRecording) {
      stopRecording();
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      saveDraft();
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const getQuestionTypeIcon = () => {
    switch(currentQuestion?.type) {
      case 'Video': return <Video className="h-6 w-6 text-purple-600" />;
      case 'Audio': return <Mic className="h-6 w-6 text-blue-600" />;
      case 'Text': return <TextIcon className="h-6 w-6 text-indigo-600" />;
      default: return null;
    }
  };
  
  const getProgressColor = () => {
    const percentage = (timeLeft / currentQuestion?.timeLimit) * 100;
    if (percentage > 66) return "bg-green-500";
    if (percentage > 33) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  const getAnswerQualityScore = () => {
    if (!currentAnswer || currentAnswer === "No answer provided") return 0;
    
    const wordCount = currentAnswer.split(/\s+/).filter(Boolean).length;
    const lengthScore = Math.min(50, wordCount / 2);
    
    const consistentRandom = (currentQuestionIndex * 17 + currentAnswer.length) % 30;
    
    return Math.min(100, Math.round(lengthScore + consistentRandom));
  };
  
  const getFeedbackMessage = () => {
    const score = getAnswerQualityScore();
    
    if (score < 30) {
      return "Your answer is quite brief. Consider providing more specific examples and details.";
    } else if (score < 60) {
      return "Your answer covers the basics. Try to include more specific examples related to your experience.";
    } else if (score < 80) {
      return "Good answer! To improve, consider structuring your response using the STAR method (Situation, Task, Action, Result).";
    } else {
      return "Excellent answer! You've provided a comprehensive response with good detail and structure.";
    }
  };
  
  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="animate-pulse flex flex-col items-center">
          <Check className="h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Submitting your answers...</h2>
          <p className="text-gray-600 mt-2">Analyzing your responses</p>
        </div>
      </div>
    );
  }
  
  if (!currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h2 className="text-2xl font-bold text-gray-800">No questions available</h2>
        <Button onClick={() => onComplete([])} className="mt-4">
          Return to dashboard
        </Button>
      </div>
    );
  }
  
  if (showAnalysis) {
    const qualityScore = getAnswerQualityScore();
    const timeUsedPercentage = (timeSpent / currentQuestion.timeLimit) * 100;
    
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center text-indigo-800">{interview.jobTitle} Interview</h2>
          <p className="text-center text-gray-600">Question {currentQuestionIndex + 1} of {interview.questions.length} - Analysis</p>
        </div>
        
        <Card className="shadow-lg border-2 border-indigo-100 mb-6">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardTitle className="text-lg md:text-xl">
              Question Analysis
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="font-medium text-gray-800">{currentQuestion.text}</h3>
              <div className="flex items-center gap-2 mt-2">
                {getQuestionTypeIcon()}
                <span className="text-sm text-gray-600">{currentQuestion.type} Question</span>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="font-medium text-gray-800 mb-2">Your Answer:</h3>
              <p className="bg-gray-50 p-3 rounded border border-gray-200 text-gray-800">
                {currentAnswer || "No answer provided"}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                  <Wand2 className="h-4 w-4 mr-1 text-purple-600" />
                  Answer Quality
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                  <div 
                    className="h-2 rounded-full bg-purple-600" 
                    style={{ width: `${qualityScore}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Needs improvement</span>
                  <span>Excellent</span>
                </div>
                <p className="mt-2 text-sm text-gray-700">{getFeedbackMessage()}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-blue-600" />
                  Time Management
                </h3>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                  <div 
                    className={`h-2 rounded-full ${
                      timeUsedPercentage < 30 ? 'bg-red-500' : 
                      timeUsedPercentage < 70 ? 'bg-yellow-500' : 
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(100, timeUsedPercentage)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Too quick</span>
                  <span>Used time well</span>
                </div>
                <p className="mt-2 text-sm text-gray-700">
                  {timeUsedPercentage < 30 
                    ? "You answered very quickly. Taking more time might help you provide more detail."
                    : timeUsedPercentage < 70 
                      ? "You used a moderate amount of time. Good balance between conciseness and detail."
                      : "You used your time well. This shows thoroughness in your answer."
                  }
                </p>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="border-t bg-gray-50 p-4 flex justify-between items-center">
            <Button 
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="border-indigo-200 text-indigo-700"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            
            <Button
              onClick={handleNextQuestion}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isLastQuestion ? 'Submit All Answers' : <span className="flex items-center">Next Question <ChevronRight className="ml-1 h-4 w-4" /></span>}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="flex justify-center">
          <div className="flex items-center gap-1">
            {Array.from({ length: interview.questions.length }).map((_, index) => (
              <div 
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === currentQuestionIndex ? 'bg-indigo-600' : 
                  index < currentQuestionIndex ? 'bg-indigo-300' : 'bg-gray-300'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center text-indigo-800">{interview.jobTitle} Interview</h2>
        <p className="text-center text-gray-600">Question {currentQuestionIndex + 1} of {interview.questions.length}</p>
      </div>
      
      <Card className="shadow-lg border-2 border-indigo-100">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {getQuestionTypeIcon()}
              <CardTitle className="text-lg md:text-xl font-semibold">
                {currentQuestion.type} Question
              </CardTitle>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm">
              <Clock className="h-4 w-4 text-red-500" />
              <span className={`font-mono ${timeLeft < 10 ? 'text-red-600 font-bold' : ''}`}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
          <Progress value={(timeLeft / currentQuestion.timeLimit) * 100} className={getProgressColor()} />
        </CardHeader>
        
        <CardContent className="p-6">
          <p className="text-lg font-medium mb-6">{currentQuestion.text}</p>
          
          {currentQuestion.type === 'Text' && (
            <Textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="min-h-[150px] border-2 focus:border-indigo-300"
            />
          )}
          
          {currentQuestion.type === 'Video' && (
            <div className="space-y-4">
              {!isRecording ? (
                <div className="bg-gray-100 rounded-lg p-6 text-center">
                  <Video className="h-12 w-12 mx-auto text-indigo-500 mb-2" />
                  <p className="text-gray-700 font-medium">Ready to record your video answer</p>
                  <Button 
                    onClick={() => startRecording('Video')}
                    className="mt-4 bg-indigo-600"
                  >
                    Start Video Recording
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    You'll need to grant camera and microphone permissions
                  </p>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg p-4">
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
                  <div className="flex justify-center">
                    <Button 
                      variant="destructive"
                      onClick={stopRecording}
                    >
                      Stop Recording
                    </Button>
                  </div>
                </div>
              )}
              
              <Textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Add notes to accompany your video answer..."
                className="min-h-[80px]"
              />
            </div>
          )}
          
          {currentQuestion.type === 'Audio' && (
            <div className="space-y-4">
              {!isRecording ? (
                <div className="bg-gray-100 rounded-lg p-6 text-center">
                  <Mic className="h-12 w-12 mx-auto text-blue-500 mb-2" />
                  <p className="text-gray-700 font-medium">Ready to record your audio answer</p>
                  <Button 
                    onClick={() => startRecording('Audio')}
                    className="mt-4 bg-blue-600"
                  >
                    Start Audio Recording
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    You'll need to grant microphone permissions
                  </p>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg p-4 text-center">
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
                  <Button 
                    variant="destructive"
                    onClick={stopRecording}
                  >
                    Stop Recording
                  </Button>
                </div>
              )}
              
              <Textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Add notes to accompany your audio answer..."
                className="min-h-[80px]"
              />
            </div>
          )}
        </CardContent>
        
        <CardFooter className="border-t bg-gray-50 p-4 flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="border-gray-200"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Previous</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => saveDraft()}
              className="border-green-200 text-green-700"
            >
              <Save className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Save Draft</span>
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 hidden sm:inline-block">
              {currentQuestion.required && "* Required"}
            </span>
            
            <Button
              onClick={handleNextQuestion}
              disabled={currentQuestion.required && !currentAnswer.trim() && !isRecording}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <span className="hidden sm:inline">Next</span>
              <ArrowRight className="sm:ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <div className="mt-4 flex justify-center">
        <div className="flex items-center gap-1">
          {Array.from({ length: interview.questions.length }).map((_, index) => (
            <div 
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentQuestionIndex ? 'bg-indigo-600' : 
                answers.some(a => a.questionId === index) ? 'bg-indigo-300' : 'bg-gray-300'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
