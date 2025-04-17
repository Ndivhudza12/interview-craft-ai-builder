import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { ArrowLeft, Redo, PencilLine, BarChart as BarChartIcon, ListChecks, MessageSquare, BarChart2, Clock, Video, Mic, Text as TextIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { InterviewAnswerPlayer } from './InterviewAnswerPlayer';
import { ReviewComments } from './ReviewComments';
import { InterviewShareOptions } from './InterviewShareOptions';
import { ViewToggle } from './ViewToggle';
import { AnswersTableView } from './AnswersTableView';
import { AnswersCardView } from './AnswersCardView';

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

const generateAnswerFeedback = (answer: Answer) => {
  const feedbacks = [
    "Your response was well-structured and addressed the key points.",
    "Consider providing more specific examples in your answer.",
    "Your answer demonstrates good understanding of the topic.",
    "The response could be more concise and focused.",
    "You effectively highlighted your relevant experience.",
    "Try to connect your skills more directly to the job requirements.",
    "Good use of technical terminology and industry knowledge.",
    "The answer could benefit from a stronger conclusion.",
  ];
  
  const index = (answer.questionText.length + answer.answerText.length) % feedbacks.length;
  return feedbacks[index];
};

const generateImprovementTips = (answer: Answer) => {
  const tips = [
    "Use the STAR method (Situation, Task, Action, Result) to structure your response.",
    "Include quantifiable achievements when discussing your experience.",
    "Prepare 2-3 concrete examples that showcase your skills.",
    "Practice brevity while still fully answering the question.",
    "Research the company more thoroughly to tailor your answers.",
    "Focus on demonstrating problem-solving abilities.",
    "Highlight collaborative experiences and teamwork.",
    "Show enthusiasm for the role and company mission.",
  ];
  
  const index = answer.questionId % tips.length;
  return tips[index];
};

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
  
  const questionTypeData = [
    { name: 'Video', value: answers.filter(a => a.type === 'Video').length, color: '#9b87f5' },
    { name: 'Audio', value: answers.filter(a => a.type === 'Audio').length, color: '#7E69AB' },
    { name: 'Text', value: answers.filter(a => a.type === 'Text').length, color: '#D6BCFA' },
  ].filter(item => item.value > 0);
  
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
  
  const getQuestionTypeIcon = (type: string) => {
    switch(type) {
      case 'Video': return <Video className="h-4 w-4" />;
      case 'Audio': return <Mic className="h-4 w-4" />;
      case 'Text': return <TextIcon className="h-4 w-4" />;
      default: return <TextIcon className="h-4 w-4" />;
    }
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
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100 animate-fade-in">
          <CardContent className="p-4 text-center">
            <div className="text-4xl font-bold text-indigo-800 mb-2">{overallScore}%</div>
            <p className="text-indigo-700">Overall Score</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <CardContent className="p-4 text-center">
            <div className="text-4xl font-bold text-purple-800 mb-2">{completionScore}%</div>
            <p className="text-purple-700">Completion Rate</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <CardContent className="p-4 text-center">
            <div className="text-4xl font-bold text-blue-800 mb-2">{timeEfficiencyScore}%</div>
            <p className="text-blue-700">Time Efficiency</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-100 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <CardContent className="p-4 text-center">
            <div className="text-4xl font-bold text-green-800 mb-2">{averageQualityScore}%</div>
            <p className="text-green-700">Answer Quality</p>
          </CardContent>
        </Card>
      </div>
      
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <BarChartIcon className="mr-2 h-5 w-5 text-indigo-600" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {scoreChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Clock className="mr-2 h-5 w-5 text-blue-600" />
                  Time Management
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSpentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Seconds', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="timeSpent" name="Time Spent" stroke="#8884d8" />
                    <Line type="monotone" dataKey="limit" name="Time Limit" stroke="#82ca9d" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Improvement Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
                    <h4 className="font-medium text-amber-800">Time Management</h4>
                    <p className="text-amber-700 text-sm">
                      Aim to use at least 70% of the available time for each question to provide more detailed answers.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <h4 className="font-medium text-blue-800">Answer Structure</h4>
                    <p className="text-blue-700 text-sm">
                      Use the STAR method (Situation, Task, Action, Result) for behavioral questions to provide more comprehensive responses.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <h4 className="font-medium text-green-800">Technical Knowledge</h4>
                    <p className="text-green-700 text-sm">
                      Include more specific technical examples and terminology relevant to the job description.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
