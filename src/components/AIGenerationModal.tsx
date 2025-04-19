
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Upload, FileText, Clipboard, Clock } from 'lucide-react';
import { toast } from "sonner";

interface AIGenerationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (questions: any[]) => void;
  jobTitle: string;
  experience: string;
  description: string;
}

type GenerationSource = 'existing' | 'paste' | 'upload';

export function AIGenerationModal({ 
  isOpen, 
  onOpenChange, 
  onGenerate, 
  jobTitle, 
  experience, 
  description 
}: AIGenerationModalProps) {
  const [numberOfQuestions, setNumberOfQuestions] = useState('5');
  const [generationType, setGenerationType] = useState('Mixed');
  const [timeLimit, setTimeLimit] = useState(60);
  const [includeTechnical, setIncludeTechnical] = useState(true);
  const [includeBehavioral, setIncludeBehavioral] = useState(true);
  const [loading, setLoading] = useState(false);
  const [generationSource, setGenerationSource] = useState<GenerationSource>('existing');
  const [pastedContent, setPastedContent] = useState('');
  const [fileContent, setFileContent] = useState<File | null>(null);
  const [showFileAlert, setShowFileAlert] = useState(false);

  const randomType = () => ['Video', 'Audio', 'Text'][Math.floor(Math.random() * 3)];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf' || file.type === 'text/plain' || file.type.includes('document')) {
        setFileContent(file);
      } else {
        setShowFileAlert(true);
      }
    }
  };

  const generateQuestions = async () => {
    setLoading(true);
    let contentToUse = description;
    
    if (generationSource === 'paste') {
      contentToUse = pastedContent;
    } else if (generationSource === 'upload' && fileContent) {
      contentToUse = `Content from uploaded file: ${fileContent.name}`;
    }
    
    const prompt = `Generate ${numberOfQuestions} ${includeTechnical && includeBehavioral ? 'mixed' : includeTechnical ? 'technical' : 'behavioral'} interview questions for a ${jobTitle} role with ${experience} experience. Content: ${contentToUse}`;

    try {
      console.log("Generating questions with prompt:", prompt);
      
      // Simulating API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const dummyQuestions = [
        "What are the core principles of React?",
        "Describe a challenging bug you encountered and how you resolved it.",
        "How would you optimize a slow-loading webpage?",
        "Explain the difference between state and props in React.",
        "How do you ensure accessibility in frontend applications?"
      ];

      const generatedQuestions = dummyQuestions.slice(0, parseInt(numberOfQuestions)).map(q => ({
        text: q,
        type: generationType === 'Mixed' ? randomType() : generationType,
        required: true,
        timeLimit,
      }));

      onGenerate(generatedQuestions);
      onOpenChange(false);
      toast.success("Questions generated successfully!");
    } catch (error) {
      console.error('Error generating questions:', error);
      toast.error("Failed to generate questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getSourceButtonClass = (source: GenerationSource) => `
    flex flex-col items-center p-4 h-auto space-y-2 transition-all duration-200 
    hover:scale-[1.02] animate-fade-in rounded-lg w-full
    ${generationSource === source 
      ? 'bg-purple-600 hover:bg-purple-700 text-white' 
      : 'bg-white border-2 border-purple-200 hover:border-purple-400'
    }
  `;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-2xl animate-fade-in">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-purple-800">Generate AI Interview Questions</DialogTitle>
            <DialogDescription className="text-gray-600">
              Choose your preferred method to generate relevant interview questions
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label className="text-lg font-semibold text-purple-800">Generate questions based on:</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button 
                  onClick={() => setGenerationSource('existing')}
                  className={getSourceButtonClass('existing')}
                >
                  <FileText className="h-8 w-8 mb-2" />
                  <span className="text-sm font-medium">Use Job Details</span>
                  <span className="text-xs opacity-75">From current form</span>
                </button>
                <button 
                  onClick={() => setGenerationSource('paste')}
                  className={getSourceButtonClass('paste')}
                >
                  <Clipboard className="h-8 w-8 mb-2" />
                  <span className="text-sm font-medium">Custom Description</span>
                  <span className="text-xs opacity-75">Paste your own</span>
                </button>
                <button 
                  onClick={() => setGenerationSource('upload')}
                  className={getSourceButtonClass('upload')}
                >
                  <Upload className="h-8 w-8 mb-2" />
                  <span className="text-sm font-medium">Upload Resume/CV</span>
                  <span className="text-xs opacity-75">PDF, DOC, TXT</span>
                </button>
              </div>
            </div>

            {generationSource === 'paste' && (
              <div className="space-y-2 animate-fade-in">
                <Label className="text-purple-800 font-medium">Custom Job Description or Requirements</Label>
                <Textarea
                  value={pastedContent}
                  onChange={(e) => setPastedContent(e.target.value)}
                  placeholder="Paste job description, requirements, or any relevant text..."
                  className="min-h-[150px] resize-none border-purple-200 focus:border-purple-400"
                />
              </div>
            )}

            {generationSource === 'upload' && (
              <div className="space-y-2 animate-fade-in">
                <Label className="text-purple-800 font-medium">Upload Resume/CV</Label>
                <div className="border-2 border-dashed border-purple-200 hover:border-purple-400 rounded-lg p-6 text-center transition-all">
                  <Input
                    id="fileUpload"
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                  />
                  <Label htmlFor="fileUpload" className="cursor-pointer block">
                    <Upload className="mx-auto h-10 w-10 text-purple-400 mb-3" />
                    <span className="text-sm font-medium block text-purple-800">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-xs text-gray-500 block mt-1">
                      PDF, DOC, DOCX, or TXT (Max 5MB)
                    </span>
                  </Label>
                  {fileContent && (
                    <div className="mt-3 flex items-center justify-center gap-2 text-sm text-purple-600">
                      <FileText className="h-4 w-4" />
                      <span className="truncate max-w-[200px]">{fileContent.name}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numberOfQuestions" className="text-purple-800 font-medium">Number of Questions</Label>
                <div className="relative">
                  <Input 
                    id="numberOfQuestions"
                    type="number" 
                    value={numberOfQuestions} 
                    onChange={e => setNumberOfQuestions(e.target.value)} 
                    min="1"
                    max="20"
                    className="pr-12 border-purple-200 focus:border-purple-400"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeLimit" className="text-purple-800 font-medium">Time per Question</Label>
                <div className="relative">
                  <Input 
                    id="timeLimit"
                    type="number" 
                    value={timeLimit} 
                    onChange={e => setTimeLimit(parseInt(e.target.value) || 60)} 
                    min="30"
                    className="pr-12 border-purple-200 focus:border-purple-400"
                  />
                  <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="questionType" className="text-purple-800 font-medium">Response Format</Label>
              <Select value={generationType} onValueChange={setGenerationType}>
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
                    onCheckedChange={(checked) => setIncludeTechnical(!!checked)} 
                  />
                  <Label htmlFor="technical" className="text-sm cursor-pointer">Technical Questions</Label>
                </div>
                <div className="flex items-center gap-2 bg-purple-50 p-3 rounded-lg hover:bg-purple-100 transition-colors">
                  <Checkbox 
                    id="behavioral" 
                    checked={includeBehavioral} 
                    onCheckedChange={(checked) => setIncludeBehavioral(!!checked)} 
                  />
                  <Label htmlFor="behavioral" className="text-sm cursor-pointer">Behavioral Questions</Label>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={generateQuestions} 
              disabled={loading || (generationSource === 'paste' && !pastedContent.trim()) || (generationSource === 'upload' && !fileContent)}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  Generating...
                </>
              ) : (
                'Generate Questions'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showFileAlert} onOpenChange={setShowFileAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsupported File Format</AlertDialogTitle>
            <AlertDialogDescription>
              Please upload a PDF, DOC, DOCX, or TXT file.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>OK</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
