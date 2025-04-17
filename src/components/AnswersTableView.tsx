
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Clock, FileText, Video, Mic, Text as TextIcon } from 'lucide-react';

interface Answer {
  questionId: number;
  questionText: string;
  answerText: string;
  timeSpent: number;
  type: string;
}

interface AnswersTableViewProps {
  answers: Answer[];
  onViewAnswer: (answerId: number) => void;
}

export function AnswersTableView({ answers, onViewAnswer }: AnswersTableViewProps) {
  const getQuestionTypeIcon = (type: string) => {
    switch(type) {
      case 'Video': return <Video className="h-4 w-4" />;
      case 'Audio': return <Mic className="h-4 w-4" />;
      case 'Text': return <TextIcon className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="overflow-x-auto animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Type</TableHead>
            <TableHead>Question</TableHead>
            <TableHead>Answer Preview</TableHead>
            <TableHead className="w-[100px]">Time</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {answers.map((answer, index) => (
            <TableRow key={index} className="animate-fade-in" style={{ animationDelay: `${index * 30}ms` }}>
              <TableCell>
                <div className="flex items-center">
                  {getQuestionTypeIcon(answer.type)}
                  <span className="ml-1 hidden md:inline">{answer.type}</span>
                </div>
              </TableCell>
              <TableCell className="font-medium max-w-[250px] truncate">
                {answer.questionText}
              </TableCell>
              <TableCell className="max-w-[300px] truncate">
                {answer.answerText === "No answer provided" ? (
                  <Badge variant="destructive">Not Answered</Badge>
                ) : (
                  answer.answerText.substring(0, 50) + (answer.answerText.length > 50 ? '...' : '')
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {answer.timeSpent}s
                </div>
              </TableCell>
              <TableCell>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onViewAnswer(answer.questionId)}
                  className="hover:bg-indigo-100 hover:text-indigo-700 hover:scale-110 transition-all w-full animate-fade-in"
                >
                  <Eye className="h-3 w-3 mr-1" /> View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
