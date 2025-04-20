import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Check, Save, ArrowRight, ChevronLeft, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MediaRecordingSection } from './interview/MediaRecorder';
import { QuestionAnalysis } from './interview/QuestionAnalysis';
import { ProgressIndicator } from './interview/ProgressIndicator';

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
      setIsRecording(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      saveDraft();
      setCurrentQuestionIndex(prev => prev - 1);
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
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center text-indigo-800">{interview.jobTitle} Interview</h2>
          <p className="text-center text-gray-600">Question {currentQuestionIndex + 1} of {interview.questions.length} - Analysis</p>
        </div>
        
        <QuestionAnalysis
          currentQuestion={currentQuestion}
          currentAnswer={currentAnswer}
          timeSpent={timeSpent}
          timeLimit={currentQuestion.timeLimit}
          isLastQuestion={isLastQuestion}
          currentQuestionIndex={currentQuestionIndex}
          handlePreviousQuestion={handlePreviousQuestion}
          handleNextQuestion={handleNextQuestion}
          interview={interview}
        />
        
        <ProgressIndicator
          totalQuestions={interview.questions.length}
          currentIndex={currentQuestionIndex}
          answers={answers}
        />
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
              <h3 className="text-lg md:text-xl font-semibold">
                {currentQuestion.type} Question
              </h3>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm">
              <Clock className="h-4 w-4 text-red-500" />
              <span className={`font-mono ${timeLeft < 10 ? 'text-red-600 font-bold' : ''}`}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
          <Progress value={(timeLeft / currentQuestion.timeLimit) * 100} className="bg-gray-200" />
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
          
          {(currentQuestion.type === 'Video' || currentQuestion.type === 'Audio') && (
            <div className="space-y-4">
              <MediaRecordingSection
                type={currentQuestion.type}
                onRecordingComplete={() => setIsRecording(false)}
                setIsRecording={setIsRecording}
              />
              
              <Textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder={`Add notes to accompany your ${currentQuestion.type.toLowerCase()} answer...`}
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
      
      <ProgressIndicator
        totalQuestions={interview.questions.length}
        currentIndex={currentQuestionIndex}
        answers={answers}
      />
    </div>
  );
}
