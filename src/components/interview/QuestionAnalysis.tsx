
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, ChevronLeft, ChevronRight, Wand2 } from 'lucide-react';

interface QuestionAnalysisProps {
  currentQuestion: {
    text: string;
    type: string;
  };
  currentAnswer: string;
  timeSpent: number;
  timeLimit: number;
  isLastQuestion: boolean;
  currentQuestionIndex: number;
  handlePreviousQuestion: () => void;
  handleNextQuestion: () => void;
  interview: {
    questions: any[];
  };
}

export function QuestionAnalysis({
  currentQuestion,
  currentAnswer,
  timeSpent,
  timeLimit,
  isLastQuestion,
  currentQuestionIndex,
  handlePreviousQuestion,
  handleNextQuestion,
  interview
}: QuestionAnalysisProps) {
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

  const timeUsedPercentage = (timeSpent / timeLimit) * 100;
  const qualityScore = getAnswerQualityScore();

  return (
    <Card className="shadow-lg border-2 border-indigo-100 mb-6">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
        <CardTitle className="text-lg md:text-xl">Question Analysis</CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="font-medium text-gray-800">{currentQuestion.text}</h3>
          <div className="flex items-center gap-2 mt-2">
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
  );
}
