import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { LoaderCircle, Upload, FileText, Clipboard, Clock } from 'lucide-react';
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
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      
      const dummyQuestions = [
        "What are the core principles of React?",
        "Describe a challenging bug you encountered and how you resolved it.",
        "How would you optimize a slow-loading webpage?",
        "Explain the difference between state and props in React.",
        "How do you ensure accessibility in frontend applications?"
      ];

      const generatedQuestions = dummyQuestions.map(q => ({
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

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md md:max-w-lg animate-fade-in">
          <DialogHeader>
            <DialogTitle>Generate AI Interview Questions</DialogTitle>
            <DialogDescription>
              Choose your preferred method to generate relevant interview questions
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Generate questions based on:</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button 
                  variant={generationSource === 'existing' ? 'default' : 'outline'} 
                  onClick={() => setGenerationSource('existing')}
                  className={`flex flex-col items-center p-4 h-auto space-y-2 transition-all duration-200 hover:scale-[1.02] animate-fade-in ${
                    generationSource === 'existing' ? 'bg-purple-600 hover:bg-purple-700' : ''
                  }`}
                >
                  <FileText className="h-6 w-6" />
                  <span className="text-xs">Existing Job Details</span>
                </Button>
                <Button 
                  variant={generationSource === 'paste' ? 'default' : 'outline'} 
                  onClick={() => setGenerationSource('paste')}
                  className={`flex flex-col items-center p-4 h-auto space-y-2 transition-all duration-200 hover:scale-[1.02] animate-fade-in ${
                    generationSource === 'paste' ? 'bg-purple-600 hover:bg-purple-700' : ''
                  }`}
                >
                  <Clipboard className="h-6 w-6" />
                  <span className="text-xs">Paste Description</span>
                </Button>
                <Button 
                  variant={generationSource === 'upload' ? 'default' : 'outline'} 
                  onClick={() => setGenerationSource('upload')}
                  className={`flex flex-col items-center p-4 h-auto space-y-2 transition-all duration-200 hover:scale-[1.02] animate-fade-in ${
                    generationSource === 'upload' ? 'bg-purple-600 hover:bg-purple-700' : ''
                  }`}
                >
                  <Upload className="h-6 w-6" />
                  <span className="text-xs">Upload Resume/CV</span>
                </Button>
              </div>
            </div>

            {generationSource === 'paste' && (
              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="pasteContent">Paste Job Description or Resume</Label>
                <Textarea
                  id="pasteContent"
                  value={pastedContent}
                  onChange={(e) => setPastedContent(e.target.value)}
                  placeholder="Paste job description or resume text here..."
                  className="min-h-[150px] resize-none"
                />
              </div>
            )}

            {generationSource === 'upload' && (
              <div className="space-y-2 animate-fade-in">
                <Label>Upload Resume/CV</Label>
                <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg p-6 text-center transition-all hover:border-purple-500">
                  <Input
                    id="fileUpload"
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                  />
                  <Label htmlFor="fileUpload" className="cursor-pointer block">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm font-medium block">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="numberOfQuestions">Number of Questions</Label>
                <Input 
                  id="numberOfQuestions"
                  type="number" 
                  value={numberOfQuestions} 
                  onChange={e => setNumberOfQuestions(e.target.value)} 
                  min="1"
                  max="20"
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeLimit">Time per Question (seconds)</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="timeLimit"
                    type="number" 
                    value={timeLimit} 
                    onChange={e => setTimeLimit(parseInt(e.target.value) || 0)} 
                    min="10"
                    className="w-full"
                  />
                  <Clock className="h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>

            <div className="space-y-2 animate-fade-in">
              <Label htmlFor="questionType">Response Format</Label>
              <Select value={generationType} onValueChange={setGenerationType}>
                <SelectTrigger id="questionType">
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

            <div className="space-y-3 animate-fade-in">
              <Label>Question Categories</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                  <Checkbox 
                    id="technical" 
                    checked={includeTechnical} 
                    onCheckedChange={(checked) => setIncludeTechnical(!!checked)} 
                  />
                  <Label htmlFor="technical" className="text-sm">Technical Questions</Label>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                  <Checkbox 
                    id="behavioral" 
                    checked={includeBehavioral} 
                    onCheckedChange={(checked) => setIncludeBehavioral(!!checked)} 
                  />
                  <Label htmlFor="behavioral" className="text-sm">Behavioral Questions</Label>
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
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700"
            >
              {loading ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
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
