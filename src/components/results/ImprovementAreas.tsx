
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ImprovementAreas() {
  return (
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
  );
}
