
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Clock, Video, Mic, Text as TextIcon, FileText } from 'lucide-react';

interface Answer {
  questionId: number;
  questionText: string;
  answerText: string;
  timeSpent: number;
  type: string;
}

interface AnswersCardViewProps {
  answers: Answer[];
  onViewAnswer: (answerId: number) => void;
}

export function AnswersCardView({ answers, onViewAnswer }: AnswersCardViewProps) {
  const getQuestionTypeIcon = (type: string) => {
    switch(type) {
      case 'Video': return <Video className="h-4 w-4" />;
      case 'Audio': return <Mic className="h-4 w-4" />;
      case 'Text': return <TextIcon className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
      {answers.map((answer, index) => (
        <Card 
          key={index}
          className="animate-fade-in border-l-4 hover:shadow-md transition-all"
          style={{ 
            animationDelay: `${index * 50}ms`,
            borderLeftColor: answer.answerText === "No answer provided" ? '#f87171' : '#10b981'
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              {getQuestionTypeIcon(answer.type)}
              <span className="text-sm font-medium text-indigo-700">{answer.type}</span>
              <div className="flex-grow"></div>
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {answer.timeSpent}s
              </span>
            </div>
            
            <h3 className="text-sm font-medium mb-2 line-clamp-2" title={answer.questionText}>
              {answer.questionText}
            </h3>
            
            {answer.answerText === "No answer provided" ? (
              <Badge variant="destructive" className="mb-3">Not Answered</Badge>
            ) : (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {answer.answerText}
              </p>
            )}
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onViewAnswer(answer.questionId)}
              className="w-full hover:bg-indigo-100 hover:text-indigo-700 hover:scale-[1.02] transition-all animate-fade-in"
            >
              <Eye className="h-3 w-3 mr-1" /> View Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
