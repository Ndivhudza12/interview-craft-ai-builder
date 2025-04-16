
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { LoaderCircle, Upload, File, Clipboard } from 'lucide-react';
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
      // In a real implementation, we would process the file and extract text
      // For now, we'll just use the filename
      contentToUse = `Content from uploaded file: ${fileContent.name}`;
    }
    
    const prompt = `Generate ${numberOfQuestions} ${includeTechnical && includeBehavioral ? 'mixed' : includeTechnical ? 'technical' : 'behavioral'} interview questions for a ${jobTitle} role with ${experience} experience. Content: ${contentToUse}`;

    try {
      // Simulate API call
      console.log("Generating questions with prompt:", prompt);
      
      // In a real implementation, this would be an API call
      // const res = await fetch('/api/generate-questions', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ prompt })
      // });
      
      // Instead, we'll use dummy data
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
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>Generate AI Interview Questions</DialogTitle>
            <DialogDescription>
              Let AI create relevant questions based on job description or resume
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="generationSource">Generate based on:</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant={generationSource === 'existing' ? 'default' : 'outline'} 
                  onClick={() => setGenerationSource('existing')}
                  className="flex flex-col items-center p-2 h-auto text-xs"
                >
                  <Clipboard className="h-5 w-5 mb-1" />
                  Existing Job Details
                </Button>
                <Button 
                  variant={generationSource === 'paste' ? 'default' : 'outline'} 
                  onClick={() => setGenerationSource('paste')}
                  className="flex flex-col items-center p-2 h-auto text-xs"
                >
                  <Clipboard className="h-5 w-5 mb-1" />
                  Paste Description
                </Button>
                <Button 
                  variant={generationSource === 'upload' ? 'default' : 'outline'} 
                  onClick={() => setGenerationSource('upload')}
                  className="flex flex-col items-center p-2 h-auto text-xs"
                >
                  <Upload className="h-5 w-5 mb-1" />
                  Upload Resume/CV
                </Button>
              </div>
            </div>

            {generationSource === 'paste' && (
              <div className="space-y-2">
                <Label htmlFor="pasteContent">Paste Job Description or Resume</Label>
                <Textarea
                  id="pasteContent"
                  value={pastedContent}
                  onChange={(e) => setPastedContent(e.target.value)}
                  placeholder="Paste job description or resume text here..."
                  className="min-h-[150px]"
                />
              </div>
            )}

            {generationSource === 'upload' && (
              <div className="space-y-2">
                <Label htmlFor="fileUpload">Upload Resume/CV</Label>
                <div className="border-2 border-dashed rounded-md p-6 text-center">
                  <Input
                    id="fileUpload"
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Label htmlFor="fileUpload" className="cursor-pointer block">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm font-medium">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-xs text-muted-foreground block mt-1">
                      PDF, DOC, DOCX, or TXT (Max 5MB)
                    </span>
                  </Label>
                  {fileContent && (
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <File className="h-4 w-4" />
                      <span>{fileContent.name}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numberOfQuestions">Number of Questions</Label>
                <Input 
                  id="numberOfQuestions"
                  type="number" 
                  value={numberOfQuestions} 
                  onChange={e => setNumberOfQuestions(e.target.value)} 
                  min="1"
                  max="20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeLimit">Time per Question (seconds)</Label>
                <Input 
                  id="timeLimit"
                  type="number" 
                  value={timeLimit} 
                  onChange={e => setTimeLimit(parseInt(e.target.value) || 0)} 
                  min="10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="questionType">Question Type</Label>
              <Select value={generationType} onValueChange={setGenerationType}>
                <SelectTrigger id="questionType">
                  <SelectValue placeholder="Question Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mixed">Mixed</SelectItem>
                  <SelectItem value="Video">Video</SelectItem>
                  <SelectItem value="Audio">Audio</SelectItem>
                  <SelectItem value="Text">Text</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="block mb-2">Question Categories</Label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="technical" 
                    checked={includeTechnical} 
                    onCheckedChange={(checked) => setIncludeTechnical(!!checked)} 
                  />
                  <Label htmlFor="technical">Include Technical Questions</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="behavioral" 
                    checked={includeBehavioral} 
                    onCheckedChange={(checked) => setIncludeBehavioral(!!checked)} 
                  />
                  <Label htmlFor="behavioral">Include Behavioral Questions</Label>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={generateQuestions} 
              disabled={loading || (generationSource === 'paste' && !pastedContent.trim()) || (generationSource === 'upload' && !fileContent)}
              className="bg-purple-600 hover:bg-purple-700"
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
