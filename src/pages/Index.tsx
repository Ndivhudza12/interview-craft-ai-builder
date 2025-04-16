"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AIGenerationModal } from '@/components/AIGenerationModal';
import { QuestionPagination } from '@/components/QuestionPagination';
import { InterviewSummaryCard } from '@/components/InterviewSummaryCard';
import { PlusCircle, PencilLine, Trash2, Save, FileText, Clock, Video, Mic, Text as TextIcon, Sparkles } from 'lucide-react';

interface Question {
  text: string;
  type: string;
  required: boolean;
  timeLimit: number;
}

interface SavedInterview {
  jobTitle: string;
  experience: string;
  description: string;
  questions: Question[];
}

export default function InterviewQuestionForm() {
  const [jobTitle, setJobTitle] = useState('Frontend Developer');
  const [experience, setExperience] = useState('1-3 years');
  const [description, setDescription] = useState('We are looking for a skilled Frontend Developer with experience in React, TypeScript, and modern web technologies...');
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('Video');
  const [required, setRequired] = useState(true);
  const [timeLimit, setTimeLimit] = useState(60);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [savedForms, setSavedForms] = useState<SavedInterview[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [aiModalOpen, setAIModalOpen] = useState(false);

  const randomType = () => ['Video', 'Audio', 'Text'][Math.floor(Math.random() * 3)];

  const addQuestion = () => {
    if (!questionText.trim()) return;

    const newQuestion: Question = {
      text: questionText,
      type: questionType,
      required,
      timeLimit,
    };

    if (editingIndex !== null) {
      const updated = [...questions];
      updated[editingIndex] = newQuestion;
      setQuestions(updated);
      setEditingIndex(null);
    } else {
      setQuestions([...questions, newQuestion]);
    }

    setQuestionText('');
    setSheetOpen(false);
  };

  const handleGeneratedQuestions = (generatedQuestions: Question[]) => {
    setQuestions([...questions, ...generatedQuestions]);
  };

  const saveForm = () => {
    const form = { jobTitle, experience, description, questions };
    console.log(form);
    setSavedForms([...savedForms, form]);
    setJobTitle('');
    setExperience('');
    setDescription('');
    setQuestions([]);
  };

  const loadForm = (index: number) => {
    const form = savedForms[index];
    setJobTitle(form.jobTitle);
    setExperience(form.experience);
    setDescription(form.description);
    setQuestions(form.questions);
  };

  const getQuestionTypeIcon = (type: string) => {
    switch(type) {
      case 'Video': return <Video className="h-4 w-4" />;
      case 'Audio': return <Mic className="h-4 w-4" />;
      case 'Text': return <TextIcon className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const QuestionItem = (question: Question, index: number) => (
    <div 
      key={index} 
      className="border p-3 rounded-xl bg-indigo-50 hover:shadow-md transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {getQuestionTypeIcon(question.type)}
            <span className="text-sm font-medium text-indigo-700">{question.type}</span>
            {question.required && (
              <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded">
                Required
              </span>
            )}
          </div>
          <p className="font-medium mb-1">{question.text}</p>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <Clock className="inline w-3 h-3 mr-1" />
            <span>{question.timeLimit} seconds</span>
          </div>
        </div>
        <div className="flex gap-2 shrink-0 ml-2">
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => {
              setQuestionText(question.text);
              setQuestionType(question.type);
              setRequired(question.required);
              setTimeLimit(question.timeLimit);
              setEditingIndex(index);
              if (window.innerWidth < 768) {
                setSheetOpen(true);
              }
            }}
            className="hover:bg-indigo-200 hover:scale-110 transition-all"
          >
            <PencilLine className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => setQuestions(questions.filter((_, i) => i !== index))}
            className="hover:bg-red-200 hover:scale-110 transition-all"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-full md:max-w-6xl mx-auto p-3 md:p-6 space-y-6 md:space-y-8 bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 min-h-screen">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-indigo-700 animate-fade-in">Interview Question Builder</h2>

      {/* Job Details */}
      <div className="space-y-4 bg-white p-3 md:p-4 rounded-lg shadow animate-fade-in">
        <h3 className="text-lg md:text-xl font-semibold text-indigo-600">Job Details</h3>
        <Input placeholder="Job Title" value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
        <Select value={experience} onValueChange={setExperience}>
          <SelectTrigger>
            <SelectValue placeholder="Years of Experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="<1 year">Less than 1 year</SelectItem>
            <SelectItem value="1-3 years">1-3 years</SelectItem>
            <SelectItem value=">3 years">More than 3 years</SelectItem>
          </SelectContent>
        </Select>
        <Textarea 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          placeholder="Job Description..." 
        />
      </div>

      {/* Mobile: Action Buttons */}
      <div className="block md:hidden space-y-3 animate-fade-in">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-[1.02] transition-transform">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Question
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Add New Question</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <div className="space-y-4 bg-white p-4 rounded-lg shadow animate-fade-in">
                <Textarea 
                  value={questionText} 
                  onChange={e => setQuestionText(e.target.value)} 
                  placeholder="Enter your question" 
                  className="min-h-[100px]"
                />
                <Select value={questionType} onValueChange={setQuestionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Video">Video</SelectItem>
                    <SelectItem value="Audio">Audio</SelectItem>
                    <SelectItem value="Text">Text</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <Checkbox checked={required} onCheckedChange={checked => setRequired(!!checked)} id="required" />
                  <Label htmlFor="required">Required</Label>
                </div>
                <Input 
                  type="number" 
                  value={timeLimit.toString()} 
                  onChange={e => setTimeLimit(parseInt(e.target.value) || 0)} 
                  placeholder="Time Limit (seconds)" 
                />
                <Button 
                  onClick={addQuestion} 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-[1.02] transition-transform"
                >
                  {editingIndex !== null ? 'Update Question' : '+ Add Question'}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <Button 
          className="w-full bg-purple-600 hover:bg-purple-700 text-white hover:scale-[1.02] transition-transform"
          onClick={() => setAIModalOpen(true)}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Generate with AI
        </Button>
      </div>

      {/* Desktop: Main Content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column (Desktop only) */}
        <div className="hidden md:block md:w-2/5 space-y-6">
          {/* Manual Question Form */}
          <div className="space-y-4 bg-white p-4 rounded-lg shadow animate-fade-in">
            <h3 className="text-xl font-semibold text-indigo-600">Add Question Manually</h3>
            <div className="space-y-4 bg-white p-4 rounded-lg shadow animate-fade-in">
              <Textarea 
                value={questionText} 
                onChange={e => setQuestionText(e.target.value)} 
                placeholder="Enter your question" 
                className="min-h-[100px]"
              />
              <Select value={questionType} onValueChange={setQuestionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Video">Video</SelectItem>
                  <SelectItem value="Audio">Audio</SelectItem>
                  <SelectItem value="Text">Text</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Checkbox checked={required} onCheckedChange={checked => setRequired(!!checked)} id="required" />
                <Label htmlFor="required">Required</Label>
              </div>
              <Input 
                type="number" 
                value={timeLimit.toString()} 
                onChange={e => setTimeLimit(parseInt(e.target.value) || 0)} 
                placeholder="Time Limit (seconds)" 
              />
              <Button 
                onClick={addQuestion} 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-[1.02] transition-transform"
              >
                {editingIndex !== null ? 'Update Question' : '+ Add Question'}
              </Button>
            </div>
          </div>

          {/* AI Question Generator Button */}
          <Button 
            className="w-full py-6 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2 text-lg hover:scale-[1.02] transition-transform animate-fade-in"
            onClick={() => setAIModalOpen(true)}
          >
            <Sparkles className="h-5 w-5" />
            Generate with AI
          </Button>
        </div>

        {/* Right Column (Full width on mobile, 3/5 on desktop) */}
        <div className="w-full md:w-3/5 space-y-4">
          {/* Questions List with Pagination */}
          <div className="bg-white p-3 md:p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg md:text-xl font-semibold text-indigo-600">
                Questions List ({questions.length})
              </h3>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant={viewMode === 'card' ? "default" : "outline"} 
                  onClick={() => setViewMode('card')}
                  className="hover:scale-110 transition-transform"
                >
                  Cards
                </Button>
                <Button 
                  size="sm" 
                  variant={viewMode === 'table' ? "default" : "outline"} 
                  onClick={() => setViewMode('table')}
                  className="hover:scale-110 transition-transform"
                >
                  Table
                </Button>
              </div>
            </div>

            {viewMode === 'card' ? (
              <QuestionPagination 
                questions={questions}
                renderQuestion={QuestionItem}
              />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Type</TableHead>
                      <TableHead>Question</TableHead>
                      <TableHead className="w-[100px]">Time</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questions.map((q, index) => (
                      <TableRow key={index} className="animate-fade-in" style={{ animationDelay: `${index * 30}ms` }}>
                        <TableCell>
                          <div className="flex items-center">
                            {getQuestionTypeIcon(q.type)}
                            <span className="ml-1 hidden md:inline">{q.type}</span>
                            {q.required && (
                              <span className="ml-1 bg-red-100 text-red-700 text-xs px-1 rounded">
                                *
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{q.text}</TableCell>
                        <TableCell>{q.timeLimit}s</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => {
                                setQuestionText(q.text);
                                setQuestionType(q.type);
                                setRequired(q.required);
                                setTimeLimit(q.timeLimit);
                                setEditingIndex(index);
                                if (window.innerWidth < 768) {
                                  setSheetOpen(true);
                                }
                              }}
                              className="hover:bg-indigo-200 hover:scale-110 transition-all"
                            >
                              <PencilLine className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => setQuestions(questions.filter((_, i) => i !== index))}
                              className="hover:bg-red-200 hover:scale-110 transition-all"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* Enhanced Interview Summary Card */}
          <div className="bg-white p-3 md:p-4 rounded-lg shadow">
            <InterviewSummaryCard 
              jobTitle={jobTitle} 
              experience={experience} 
              questions={questions} 
            />
          </div>
        </div>
      </div>

      {/* Save & Load Forms */}
      <Button 
        className="w-full bg-green-600 hover:bg-green-700 text-white hover:scale-[1.01] transition-transform animate-fade-in" 
        onClick={saveForm}
      >
        <Save className="mr-2 h-4 w-4" /> Save Form
      </Button>

      {savedForms.length > 0 && (
        <div className="bg-white p-3 md:p-4 rounded-lg shadow">
          <h4 className="text-lg font-semibold text-indigo-600 mb-2">Saved Forms</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {savedForms.map((form, i) => (
              <Card key={i} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => loadForm(i)}>
                <CardContent className="p-3">
                  <h5 className="font-medium">{form.jobTitle}</h5>
                  <div className="text-sm text-gray-500">
                    <p>{form.experience}</p>
                    <p>{form.questions.length} questions</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* AI Generation Modal */}
      <AIGenerationModal
        isOpen={aiModalOpen}
        onOpenChange={setAIModalOpen}
        onGenerate={handleGeneratedQuestions}
        jobTitle={jobTitle}
        experience={experience}
        description={description}
      />
    </div>
  );
}
