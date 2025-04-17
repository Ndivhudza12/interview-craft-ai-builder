
import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InterviewResultsAnalysis } from '@/components/InterviewResultsAnalysis';
import { ArrowLeft, Eye, Shield, Globe, User, AlertCircle } from 'lucide-react';

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

export default function SharedInterview() {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAnonymous = searchParams.get('anon') === '1';
  
  const [interview, setInterview] = useState<SavedInterview | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // In a real app, fetch the shared interview data from your API
    setTimeout(() => {
      // Mock data - this would come from your API in a real app
      const mockInterview: SavedInterview = {
        id: interviewId || '1',
        jobTitle: 'Frontend Developer',
        experience: '1-3 years',
        description: 'We are looking for a skilled Frontend Developer with experience in React, TypeScript, and modern web technologies...',
        questions: [
          {
            text: 'Explain the difference between state and props in React',
            type: 'Video',
            required: true,
            timeLimit: 60
          },
          {
            text: 'How would you optimize the performance of a React application?',
            type: 'Audio',
            required: true,
            timeLimit: 90
          }
        ]
      };
      
      const mockAnswers: Answer[] = [
        {
          questionId: 0,
          questionText: 'Explain the difference between state and props in React',
          answerText: 'State is managed within the component and can be changed, while props are passed from parent components and are read-only. State is used for data that changes over time, whereas props are used for configuring a component.',
          timeSpent: 48,
          type: 'Video'
        },
        {
          questionId: 1,
          questionText: 'How would you optimize the performance of a React application?',
          answerText: 'To optimize React performance, I would use React.memo for component memoization, lazy loading with Suspense for code splitting, virtualization for long lists, and proper use of useCallback and useMemo hooks to prevent unnecessary re-renders.',
          timeSpent: 65,
          type: 'Audio'
        }
      ];
      
      setInterview(mockInterview);
      setAnswers(mockAnswers);
      setIsLoading(false);
    }, 1000);
  }, [interviewId]);
  
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 min-h-screen flex items-center justify-center animate-fade-in">
        <Card className="w-full max-w-md animate-pulse">
          <CardHeader>
            <div className="h-8 bg-gray-200 rounded-md mb-2"></div>
            <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-20 bg-gray-200 rounded-md"></div>
              <div className="h-12 bg-gray-200 rounded-md w-1/2 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error || !interview) {
    return (
      <div className="max-w-6xl mx-auto p-6 min-h-screen flex items-center justify-center animate-fade-in">
        <Card className="w-full max-w-md border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Interview Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              The interview you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto p-3 md:p-6 min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
      <div className="mb-6 flex justify-between items-center animate-fade-in">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="border-indigo-200 hover:bg-indigo-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        
        <div className="flex items-center gap-2">
          {isAnonymous ? (
            <Card className="p-1 px-3 flex items-center gap-2 border-green-200 bg-green-50">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700">Anonymous View</span>
            </Card>
          ) : (
            <Card className="p-1 px-3 flex items-center gap-2 border-indigo-200 bg-indigo-50">
              <User className="h-4 w-4 text-indigo-600" />
              <span className="text-sm text-indigo-700">Identifiable View</span>
            </Card>
          )}
        </div>
      </div>
      
      <Card className="mb-6 bg-white/70 animate-fade-in">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="h-5 w-5 text-indigo-600" />
            <span className="text-indigo-700 font-medium">Shared Interview Review</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            {interview.jobTitle} Interview
          </h2>
          <p className="text-gray-600">
            {isAnonymous ? 'Anonymous' : 'John Doe'} • Experience: {interview.experience}
          </p>
        </CardContent>
      </Card>
      
      <InterviewResultsAnalysis
        interview={interview}
        answers={answers}
        onBackToList={() => navigate('/')}
        onEditInterview={() => {}} // No-op for shared view
        onRetakeInterview={() => {}} // No-op for shared view
      />
    </div>
  );
}
