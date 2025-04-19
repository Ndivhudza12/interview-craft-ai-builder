import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Upload, FileText, Clipboard } from 'lucide-react';
import { toast } from "sonner";
import { GenerationSourceButton } from './ai-generation/GenerationSourceButton';
import { FileUploadSection } from './ai-generation/FileUploadSection';
import { QuestionSettings } from './ai-generation/QuestionSettings';

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

  const sourceButtons = [
    {
      id: 'existing',
      icon: FileText,
      title: 'Use Job Details',
      description: 'From current form',
    },
    {
      id: 'paste',
      icon: Clipboard,
      title: 'Custom Description',
      description: 'Paste your own',
    },
    {
      id: 'upload',
      icon: Upload,
      title: 'Upload Resume/CV',
      description: 'PDF, DOC, TXT',
    },
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-2xl animate-fade-in">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-purple-800">
              Generate AI Interview Questions
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Choose your preferred method to generate relevant interview questions
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label className="text-lg font-semibold text-purple-800">
                Generate questions based on:
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {sourceButtons.map((button) => (
                  <GenerationSourceButton
                    key={button.id}
                    isActive={generationSource === button.id}
                    icon={button.icon}
                    title={button.title}
                    description={button.description}
                    onClick={() => setGenerationSource(button.id as GenerationSource)}
                  />
                ))}
              </div>
            </div>

            {generationSource === 'paste' && (
              <div className="space-y-2 animate-fade-in">
                <Label className="text-purple-800 font-medium">
                  Custom Job Description or Requirements
                </Label>
                <Textarea
                  value={pastedContent}
                  onChange={(e) => setPastedContent(e.target.value)}
                  placeholder="Paste job description, requirements, or any relevant text..."
                  className="min-h-[150px] resize-none border-purple-200 focus:border-purple-400"
                />
              </div>
            )}

            {generationSource === 'upload' && (
              <FileUploadSection
                fileContent={fileContent}
                onFileUpload={handleFileUpload}
              />
            )}

            <QuestionSettings
              numberOfQuestions={numberOfQuestions}
              timeLimit={timeLimit}
              generationType={generationType}
              includeTechnical={includeTechnical}
              includeBehavioral={includeBehavioral}
              onNumberOfQuestionsChange={setNumberOfQuestions}
              onTimeLimitChange={setTimeLimit}
              onGenerationTypeChange={setGenerationType}
              onIncludeTechnicalChange={setIncludeTechnical}
              onIncludeBehavioralChange={setIncludeBehavioral}
            />
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
