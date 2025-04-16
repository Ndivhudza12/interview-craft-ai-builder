
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Video, Mic, Text as TextIcon, Clock, ArrowRight, Check } from 'lucide-react';
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
  const { toast } = useToast();
  
  const currentQuestion = interview.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === interview.questions.length - 1;
  
  // Set up timer for current question
  useEffect(() => {
    if (!currentQuestion) return;
    
    setTimeLeft(currentQuestion.timeLimit);
    setTimeSpent(0);
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleNextQuestion();
          return 0;
        }
        return prev - 1;
      });
      
      setTimeSpent(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentQuestionIndex]);
  
  const handleNextQuestion = () => {
    // Save current answer
    const newAnswer: Answer = {
      questionId: currentQuestionIndex,
      questionText: currentQuestion.text,
      answerText: currentAnswer || "No answer provided",
      timeSpent,
      type: currentQuestion.type
    };
    
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    setCurrentAnswer('');
    
    // Move to next question or complete interview
    if (isLastQuestion) {
      setIsSubmitting(true);
      setTimeout(() => {
        onComplete(updatedAnswers);
      }, 1000);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
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
  
  // Show loading state when submitting
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
  
  // Handle the case where there are no questions
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
              <div className="bg-gray-200 rounded-lg p-8 text-center">
                <Video className="h-12 w-12 mx-auto text-gray-500 mb-2" />
                <p className="text-gray-600">Video recording functionality would go here</p>
                <p className="text-sm text-gray-500 mt-2">For demo purposes, please type your answer instead</p>
              </div>
              <Textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer for the video question..."
                className="min-h-[100px]"
              />
            </div>
          )}
          
          {currentQuestion.type === 'Audio' && (
            <div className="space-y-4">
              <div className="bg-gray-200 rounded-lg p-8 text-center">
                <Mic className="h-12 w-12 mx-auto text-gray-500 mb-2" />
                <p className="text-gray-600">Audio recording functionality would go here</p>
                <p className="text-sm text-gray-500 mt-2">For demo purposes, please type your answer instead</p>
              </div>
              <Textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer for the audio question..."
                className="min-h-[100px]"
              />
            </div>
          )}
        </CardContent>
        
        <CardFooter className="border-t bg-gray-50 p-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {currentQuestion.required && <span className="text-red-600">* Required</span>}
          </div>
          <Button
            onClick={handleNextQuestion}
            disabled={currentQuestion.required && !currentAnswer.trim()}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isLastQuestion ? 'Submit Answers' : 'Next Question'} 
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
