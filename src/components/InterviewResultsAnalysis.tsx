import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Redo, PencilLine, BarChart2, ListChecks, MessageSquare, Clock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { InterviewAnswerPlayer } from './InterviewAnswerPlayer';
import { ReviewComments } from './ReviewComments';
import { InterviewShareOptions } from './InterviewShareOptions';
import { ViewToggle } from './ViewToggle';
import { AnswersTableView } from './AnswersTableView';
import { AnswersCardView } from './AnswersCardView';
import { ScoreCards } from './results/ScoreCards';
import { PerformanceCharts } from './results/PerformanceCharts';
import { ImprovementAreas } from './results/ImprovementAreas';
import { generateAnswerFeedback, generateImprovementTips } from '@/utils/answerFeedback';

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

interface Review {
  id: string;
  reviewerName: string;
  comment: string;
  isAnonymous: boolean;
  timestamp: string;
}

interface InterviewResultsAnalysisProps {
  interview: SavedInterview;
  answers: Answer[];
  onBackToList: () => void;
  onEditInterview: () => void;
  onRetakeInterview: () => void;
}

export function InterviewResultsAnalysis({ 
  interview, answers, onBackToList, onEditInterview, onRetakeInterview 
}: InterviewResultsAnalysisProps) {
  const [activeTab, setActiveTab] = useState("summary");
  const [answerViewMode, setAnswerViewMode] = useState<'card' | 'table'>('card');
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      reviewerName: 'Sarah Johnson',
      comment: 'Great answers to technical questions! Try to be more specific about your experience with React in future interviews.',
      isAnonymous: false,
      timestamp: '2 days ago'
    },
    {
      id: '2',
      reviewerName: 'Anonymous',
      comment: 'You could improve your explanation of state management concepts. Consider mentioning specific examples from your projects.',
      isAnonymous: true,
      timestamp: '1 day ago'
    }
  ]);
  
  const isMobile = useIsMobile();
  
  const totalQuestions = interview.questions.length;
  const answeredQuestions = answers.filter(a => a.answerText !== "No answer provided").length;
  const averageResponseTime = answers.reduce((sum, a) => sum + a.timeSpent, 0) / answers.length;
  const timeEfficiencyScore = Math.min(100, Math.round((1 - (averageResponseTime / 60)) * 100));
  const completionScore = Math.round((answeredQuestions / totalQuestions) * 100);
  
  const answerQualityScores = answers.map((answer, index) => {
    const baseScore = 60;
    const lengthBonus = Math.min(20, Math.floor(answer.answerText.length / 20));
    const randomFactor = (answer.questionId * 7) % 15;
    return Math.min(95, baseScore + lengthBonus + randomFactor);
  });
  
  const averageQualityScore = Math.round(
    answerQualityScores.reduce((sum, score) => sum + score, 0) / answerQualityScores.length
  );
  
  const overallScore = Math.round((completionScore + timeEfficiencyScore + averageQualityScore) / 3);
  
  const scoreChartData = [
    { name: 'Completion', value: completionScore, color: '#9333EA' },
    { name: 'Time Efficiency', value: timeEfficiencyScore, color: '#3B82F6' },
    { name: 'Answer Quality', value: averageQualityScore, color: '#10B981' },
    { name: 'Overall', value: overallScore, color: '#F97316' },
  ];
  
  const timeSpentData = answers.map((answer, index) => ({
    name: `Q${index + 1}`,
    timeSpent: answer.timeSpent,
    limit: interview.questions[answer.questionId].timeLimit
  }));
  
  const handleAddReview = (review: Omit<Review, 'id' | 'timestamp'>) => {
    const newReview = {
      ...review,
      id: Date.now().toString(),
      timestamp: 'Just now'
    };
    
    setReviews([newReview, ...reviews]);
  };
  
  const selectedAnswer = selectedAnswerId !== null 
    ? answers.find(a => a.questionId === selectedAnswerId) 
    : null;
  
  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="outline" 
          onClick={onBackToList}
          className="border-indigo-200 hover:bg-indigo-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Interviews
        </Button>
        
        <div className="flex gap-2">
          <Button 
            onClick={onRetakeInterview}
            variant="outline" 
            className="border-green-200 text-green-700 hover:bg-green-50"
          >
            <Redo className="mr-2 h-4 w-4" />
            Retake
          </Button>
          
          <Button 
            onClick={onEditInterview}
            variant="outline" 
            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          >
            <PencilLine className="mr-2 h-4 w-4" />
            Edit Questions
          </Button>
        </div>
      </div>
      
      <h2 className="text-2xl md:text-3xl font-bold text-indigo-800 mb-2">
        {interview.jobTitle} Interview Results
      </h2>
      <p className="text-gray-600 mb-8">
        Completed {answers.length} of {totalQuestions} questions
      </p>
      
      <ScoreCards 
        overallScore={overallScore}
        completionScore={completionScore}
        timeEfficiencyScore={timeEfficiencyScore}
        averageQualityScore={averageQualityScore}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full animate-fade-in">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            <span className="hidden md:inline">Summary</span>
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            <span className="hidden md:inline">Questions & Answers</span>
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden md:inline">Feedback</span>
          </TabsTrigger>
          <TabsTrigger value="share" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden md:inline">Share</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary">
          <div className="space-y-6">
            <PerformanceCharts 
              scoreChartData={scoreChartData}
              timeSpentData={timeSpentData}
            />
            <ImprovementAreas />
          </div>
        </TabsContent>
        
        <TabsContent value="questions">
          <div className="space-y-6">
            {selectedAnswer ? (
              <div className="space-y-4 animate-fade-in">
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedAnswerId(null)}
                    className="border-indigo-200 hover:bg-indigo-50"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to All Answers
                  </Button>
                </div>
                
                <Card className={`border-l-4 ${selectedAnswer.answerText === "No answer provided" ? 'border-l-red-400' : 'border-l-green-400'}`}>
                  <CardHeader className="bg-gray-50">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base font-medium">
                        Question: {selectedAnswer.questionText}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1">
                          {selectedAnswer.type}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {selectedAnswer.timeSpent}s
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Your Answer:</h4>
                        <p className="text-gray-800 bg-gray-50 p-3 border border-gray-100">
                          {selectedAnswer.answerText}
                        </p>
                      </div>
                      
                      <InterviewAnswerPlayer
                        audioUrl="/mock-audio.mp3"
                        videoUrl="/mock-video.mp4"
                        answerType={selectedAnswer.type}
                        questionText={selectedAnswer.questionText}
                      />
                      
                      <div>
                        <h4 className="text-sm font-medium text-indigo-600 mb-1">Answer Quality:</h4>
                        <div className="w-full bg-gray-200 h-2">
                          <div 
                            className="h-2 bg-indigo-600" 
                            style={{ width: `${answerQualityScores[selectedAnswer.questionId]}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Poor</span>
                          <span>Excellent</span>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-indigo-50 border border-indigo-100">
                        <h4 className="font-medium text-indigo-700 mb-2">Feedback</h4>
                        <p className="text-indigo-700">{generateAnswerFeedback(selectedAnswer)}</p>
                        
                        <h4 className="font-medium text-indigo-700 mt-4 mb-2">How to Improve</h4>
                        <p className="text-indigo-700">{generateImprovementTips(selectedAnswer)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-indigo-700">Your Answers</h3>
                  <ViewToggle 
                    viewMode={answerViewMode} 
                    onViewModeChange={setAnswerViewMode} 
                  />
                </div>
                
                {answerViewMode === 'card' ? (
                  <AnswersCardView 
                    answers={answers} 
                    onViewAnswer={setSelectedAnswerId}
                  />
                ) : (
                  <AnswersTableView 
                    answers={answers} 
                    onViewAnswer={setSelectedAnswerId} 
                  />
                )}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="feedback">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Overall Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Based on your interview responses for the {interview.jobTitle} position, 
                  you've demonstrated {overallScore >= 80 ? 'strong' : overallScore >= 60 ? 'adequate' : 'some'} 
                  understanding of the role requirements. Here's a detailed analysis of your performance:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                    <h4 className="font-medium text-indigo-700 mb-2">Strengths</h4>
                    <ul className="list-disc list-inside space-y-2 text-indigo-600">
                      <li>Responded to {answeredQuestions} out of {totalQuestions} questions</li>
                      <li>{timeEfficiencyScore >= 70 ? 'Good time management' : 'Attempted to manage time effectively'}</li>
                      <li>Showed familiarity with key concepts</li>
                      <li>Demonstrated clear communication in responses</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
                    <h4 className="font-medium text-amber-700 mb-2">Areas for Improvement</h4>
                    <ul className="list-disc list-inside space-y-2 text-amber-600">
                      <li>Provide more specific examples in answers</li>
                      <li>Use industry-specific terminology more frequently</li>
                      <li>Structure responses using frameworks like STAR</li>
                      <li>Research company and role more thoroughly</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Question-Specific Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {answers.map((answer, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                      <h4 className="font-medium text-gray-800">Question {index + 1}</h4>
                      <p className="text-sm text-gray-600 mt-1 mb-3">{answer.questionText}</p>
                      
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <h5 className="text-sm font-medium text-indigo-700 mb-1">Feedback</h5>
                        <p className="text-sm">{generateAnswerFeedback(answer)}</p>
                        
                        <h5 className="text-sm font-medium text-green-700 mt-3 mb-1">How to Improve</h5>
                        <p className="text-sm">{generateImprovementTips(answer)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="share" className="animate-fade-in">
          <div className="space-y-6">
            <InterviewShareOptions 
              interviewId={interview.id}
              jobTitle={interview.jobTitle}
            />
            
            <ReviewComments 
              interviewId={interview.id}
              reviews={reviews}
              onAddReview={handleAddReview}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
