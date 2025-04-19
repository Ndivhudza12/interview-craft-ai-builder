
import { Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface QuestionSettingsProps {
  numberOfQuestions: string;
  timeLimit: number;
  generationType: string;
  includeTechnical: boolean;
  includeBehavioral: boolean;
  onNumberOfQuestionsChange: (value: string) => void;
  onTimeLimitChange: (value: number) => void;
  onGenerationTypeChange: (value: string) => void;
  onIncludeTechnicalChange: (checked: boolean) => void;
  onIncludeBehavioralChange: (checked: boolean) => void;
}

export function QuestionSettings({
  numberOfQuestions,
  timeLimit,
  generationType,
  includeTechnical,
  includeBehavioral,
  onNumberOfQuestionsChange,
  onTimeLimitChange,
  onGenerationTypeChange,
  onIncludeTechnicalChange,
  onIncludeBehavioralChange,
}: QuestionSettingsProps) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="numberOfQuestions" className="text-purple-800 font-medium">
            Number of Questions
          </Label>
          <div className="relative">
            <Input 
              id="numberOfQuestions"
              type="number" 
              value={numberOfQuestions} 
              onChange={e => onNumberOfQuestionsChange(e.target.value)} 
              min="1"
              max="20"
              className="pr-12 border-purple-200 focus:border-purple-400"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="timeLimit" className="text-purple-800 font-medium">
            Time per Question
          </Label>
          <div className="relative">
            <Input 
              id="timeLimit"
              type="number" 
              value={timeLimit} 
              onChange={e => onTimeLimitChange(parseInt(e.target.value) || 60)} 
              min="30"
              className="pr-12 border-purple-200 focus:border-purple-400"
            />
            <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="questionType" className="text-purple-800 font-medium">
          Response Format
        </Label>
        <Select value={generationType} onValueChange={onGenerationTypeChange}>
          <SelectTrigger id="questionType" className="border-purple-200 focus:border-purple-400">
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Mixed">Mixed Formats</SelectItem>
            <SelectItem value="Video">Video Only</SelectItem>
            <SelectItem value="Audio">Audio Only</SelectItem>
            <SelectItem value="Text">Text Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-purple-800 font-medium">Question Categories</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 bg-purple-50 p-3 rounded-lg hover:bg-purple-100 transition-colors">
            <Checkbox 
              id="technical" 
              checked={includeTechnical} 
              onCheckedChange={(checked) => onIncludeTechnicalChange(!!checked)} 
            />
            <Label htmlFor="technical" className="text-sm cursor-pointer">
              Technical Questions
            </Label>
          </div>
          <div className="flex items-center gap-2 bg-purple-50 p-3 rounded-lg hover:bg-purple-100 transition-colors">
            <Checkbox 
              id="behavioral" 
              checked={includeBehavioral} 
              onCheckedChange={(checked) => onIncludeBehavioralChange(!!checked)} 
            />
            <Label htmlFor="behavioral" className="text-sm cursor-pointer">
              Behavioral Questions
            </Label>
          </div>
        </div>
      </div>
    </>
  );
}
