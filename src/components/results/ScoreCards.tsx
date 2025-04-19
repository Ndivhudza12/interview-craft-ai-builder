
import { Card, CardContent } from "@/components/ui/card";

interface ScoreCardsProps {
  overallScore: number;
  completionScore: number;
  timeEfficiencyScore: number;
  averageQualityScore: number;
}

export function ScoreCards({
  overallScore,
  completionScore,
  timeEfficiencyScore,
  averageQualityScore,
}: ScoreCardsProps) {
  return (
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
  );
}
