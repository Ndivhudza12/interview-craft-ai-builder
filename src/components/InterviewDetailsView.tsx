
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { X, PencilLine, Clock, Video, Mic, Text as TextIcon } from 'lucide-react';

interface Question {
  text: string;
  type: string;
  required: boolean;
  timeLimit: number;
}

interface SavedInterview {
  id: string;
  jobTitle: string;
  experience: string;
  description: string;
  questions: Question[];
}

interface InterviewDetailsViewProps {
  interview: SavedInterview;
  onClose: () => void;
  onEdit: () => void;
}

export function InterviewDetailsView({ interview, onClose, onEdit }: InterviewDetailsViewProps) {
  const getQuestionTypeIcon = (type: string) => {
    switch(type) {
      case 'Video': return <Video className="h-4 w-4" />;
      case 'Audio': return <Mic className="h-4 w-4" />;
      case 'Text': return <TextIcon className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold text-indigo-800">
          Interview Details
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="text-indigo-600 hover:text-indigo-700"
          >
            <PencilLine className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-indigo-700">{interview.jobTitle}</h3>
            <p className="text-sm text-gray-600">Experience: {interview.experience}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Job Description</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border">
              {interview.description}
            </p>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-medium text-gray-700 mb-4">Questions ({interview.questions.length})</h4>
          <div className="space-y-3">
            {interview.questions.map((question, index) => (
              <Card key={index} className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-1">
                      {getQuestionTypeIcon(question.type)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-indigo-600">
                          {question.type}
                        </span>
                        {question.required && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700">{question.text}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{question.timeLimit} seconds</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
