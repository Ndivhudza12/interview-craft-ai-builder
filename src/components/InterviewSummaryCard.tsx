
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, XAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { Video, Mic, Text as TextIcon, Clock, Briefcase, Calendar } from "lucide-react";

interface Question {
  text: string;
  type: string;
  required: boolean;
  timeLimit: number;
}

interface InterviewSummaryCardProps {
  jobTitle: string;
  experience: string;
  questions: Question[];
}

export function InterviewSummaryCard({ jobTitle, experience, questions }: InterviewSummaryCardProps) {
  const isMobile = useIsMobile();
  
  // Question type statistics
  const videoQuestions = questions.filter(q => q.type === 'Video').length;
  const audioQuestions = questions.filter(q => q.type === 'Audio').length;
  const textQuestions = questions.filter(q => q.type === 'Text').length;
  
  // Calculate total time in seconds and minutes
  const totalTimeSeconds = questions.reduce((total, q) => total + q.timeLimit, 0);
  const totalMinutes = Math.floor(totalTimeSeconds / 60);
  const remainingSeconds = totalTimeSeconds % 60;
  
  // Format time as MM:SS
  const formattedTime = `${totalMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  
  // Prepare chart data
  const pieChartData = [
    { name: 'Video', value: videoQuestions, color: '#9b87f5' },
    { name: 'Audio', value: audioQuestions, color: '#7E69AB' },
    { name: 'Text', value: textQuestions, color: '#D6BCFA' },
  ].filter(item => item.value > 0);
  
  const barChartData = [
    { name: 'Video', value: videoQuestions, color: '#9b87f5' },
    { name: 'Audio', value: audioQuestions, color: '#7E69AB' },
    { name: 'Text', value: textQuestions, color: '#D6BCFA' },
  ].filter(item => item.value > 0);

  // Calculate required vs optional questions
  const requiredQuestions = questions.filter(q => q.required).length;
  const optionalQuestions = questions.length - requiredQuestions;

  return (
    <div className="space-y-6 animate-fade-in">
      <h3 className="text-lg md:text-xl font-semibold text-indigo-600">Interview Summary</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-white to-indigo-50">
          <CardHeader className="py-4 bg-gradient-to-r from-indigo-500 to-purple-600">
            <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
              <Briefcase className="h-4 w-4" /> 
              Job Position
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-1">
            <p className="text-xl font-bold text-indigo-900">{jobTitle || 'Not specified'}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {experience || 'Experience not specified'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-white to-indigo-50">
          <CardHeader className="py-4 bg-gradient-to-r from-indigo-500 to-purple-600">
            <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Question Types
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3">
            {questions.length > 0 ? (
              <div className="h-[110px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {isMobile ? (
                    <BarChart data={barChartData}>
                      <XAxis dataKey="name" fontSize={10} />
                      <Bar dataKey="value" fill="#9b87f5" radius={[4, 4, 0, 0]}>
                        {barChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  ) : (
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={45}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ name }) => name}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center py-5 text-gray-500">No questions added</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-white to-indigo-50">
          <CardHeader className="py-4 bg-gradient-to-r from-indigo-500 to-purple-600">
            <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time & Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2">
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-700">{formattedTime}</p>
              <p className="text-xs text-gray-600">Total minutes</p>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center pt-2">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center p-1 bg-indigo-100 rounded-full w-8 h-8 mb-1">
                  <Video className="h-4 w-4 text-indigo-700" />
                </div>
                <p className="font-medium text-indigo-900">{videoQuestions}</p>
                <p className="text-xs text-gray-600">Video</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center p-1 bg-purple-100 rounded-full w-8 h-8 mb-1">
                  <Mic className="h-4 w-4 text-purple-700" />
                </div>
                <p className="font-medium text-purple-900">{audioQuestions}</p>
                <p className="text-xs text-gray-600">Audio</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center p-1 bg-pink-100 rounded-full w-8 h-8 mb-1">
                  <TextIcon className="h-4 w-4 text-pink-700" />
                </div>
                <p className="font-medium text-pink-900">{textQuestions}</p>
                <p className="text-xs text-gray-600">Text</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
