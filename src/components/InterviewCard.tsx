import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PencilLine, Play, Video, Mic, Text as TextIcon, Clock, FileCheck, FileClock, Eye } from "lucide-react";

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
  status?: 'draft' | 'ongoing' | 'completed';
  attemptsCount?: number;
}

interface InterviewCardProps {
  interview: SavedInterview;
  onStartInterview: (interview: SavedInterview) => void;
  onEditInterview: (interview: SavedInterview) => void;
  onViewDetails?: (interview: SavedInterview) => void;
  isLoading: boolean;
  loadingAction: string;
}

export function InterviewCard({
  interview,
  onStartInterview,
  onEditInterview,
  onViewDetails,
  isLoading,
  loadingAction
}: InterviewCardProps) {
  const videoQuestions = interview.questions.filter(q => q.type === 'Video').length;
  const audioQuestions = interview.questions.filter(q => q.type === 'Audio').length;
  const textQuestions = interview.questions.filter(q => q.type === 'Text').length;
  
  const totalTimeSeconds = interview.questions.reduce((total, q) => total + q.timeLimit, 0);
  const totalMinutes = Math.floor(totalTimeSeconds / 60);
  const remainingSeconds = totalTimeSeconds % 60;
  const formattedTime = `${totalMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  
  const getStatusBadge = () => {
    switch(interview.status) {
      case 'draft': 
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300 flex items-center gap-1">
            <FileClock className="w-3 h-3" /> Draft
          </Badge>
        );
      case 'ongoing': 
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300 flex items-center gap-1">
            <Clock className="w-3 h-3" /> In Progress
          </Badge>
        );
      case 'completed': 
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-300 flex items-center gap-1">
            <FileCheck className="w-3 h-3" /> Completed
          </Badge>
        );
      default: 
        return null;
    }
  };

  return (
    <Card className="animate-fade-in hover:shadow-lg transition-all">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white text-lg">{interview.jobTitle}</CardTitle>
          {interview.status && getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-600">
          <p><span className="font-medium">Experience:</span> {interview.experience}</p>
          <p><span className="font-medium">Questions:</span> {interview.questions.length}</p>
          <p className="line-clamp-2 text-gray-500 text-xs mt-2">{interview.description}</p>
        </div>
        
        <div className="flex justify-between items-center border-t border-indigo-50 pt-3 mt-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs">
              <Video className="h-3 w-3 text-indigo-700" />
              <span>{videoQuestions}</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Mic className="h-3 w-3 text-purple-700" />
              <span>{audioQuestions}</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <TextIcon className="h-3 w-3 text-pink-700" />
              <span>{textQuestions}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Clock className="h-3 w-3" />
            <span>{formattedTime}</span>
          </div>
        </div>
        
        {interview.attemptsCount !== undefined && interview.attemptsCount > 0 && (
          <div className="text-xs text-gray-500 pt-1 border-t border-indigo-50">
            <span className="font-medium">{interview.attemptsCount}</span> {interview.attemptsCount === 1 ? 'attempt' : 'attempts'} completed
          </div>
        )}
        
        <CardFooter className="flex justify-between pt-2">
          <div className="flex gap-2">
            {onViewDetails && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(interview)}
                className="text-indigo-600 hover:text-indigo-700"
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEditInterview(interview)}
              isLoading={isLoading && loadingAction === `load-${interview.id}`}
            >
              <PencilLine className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
          <Button
            onClick={() => onStartInterview(interview)}
            size="sm"
            isLoading={isLoading && loadingAction === `start-${interview.id}`}
          >
            <Play className="h-4 w-4 mr-1" />
            Start
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
