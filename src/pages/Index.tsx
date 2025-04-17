
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AIGenerationModal } from '@/components/AIGenerationModal';
import { QuestionPagination } from '@/components/QuestionPagination';
import { InterviewSummaryCard } from '@/components/InterviewSummaryCard';
import { PlusCircle, PencilLine, Trash2, Save, FileText, Clock, Video, Mic, Text as TextIcon, Sparkles, Play, ArrowLeft } from 'lucide-react';
import { InterviewSession } from '@/components/InterviewSession';
import { InterviewResultsAnalysis } from '@/components/InterviewResultsAnalysis';
import { InterviewFilters } from '@/components/InterviewFilters';
import { InterviewCardsPagination } from '@/components/InterviewCardsPagination';
import { InterviewCard } from '@/components/InterviewCard';

interface Question {
  text: string;
  type: string;
  required: boolean;
  timeLimit: number;
}

interface Answer {
  questionId: number;
  questionText: string;
  answerText: string;
  timeSpent: number;
  type: string;
}

interface SavedInterview {
  id: string;
  jobTitle: string;
  experience: string;
  description: string;
  questions: Question[];
  status?: 'draft' | 'ongoing' | 'completed';
  attemptsCount?: number;
}

export default function InterviewQuestionForm() {
  const [jobTitle, setJobTitle] = useState('');
  const [experience, setExperience] = useState('');
  const [description, setDescription] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('Video');
  const [required, setRequired] = useState(true);
  const [timeLimit, setTimeLimit] = useState(60);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    experience: 'all',
  });
  
  const [savedForms, setSavedForms] = useState<SavedInterview[]>([
    {
      id: '1',
      jobTitle: 'Frontend Developer',
      experience: '1-3 years',
      description: 'We are looking for a skilled Frontend Developer with experience in React, TypeScript, and modern web technologies...',
      questions: [
        {
          text: 'Explain the difference between state and props in React',
          type: 'Video',
          required: true,
          timeLimit: 60
        },
        {
          text: 'How would you optimize the performance of a React application?',
          type: 'Audio',
          required: true,
          timeLimit: 90
        }
      ],
      status: 'completed',
      attemptsCount: 3
    },
    {
      id: '2',
      jobTitle: 'UX Designer',
      experience: '>3 years',
      description: 'Experienced UX Designer needed to create intuitive user experiences for our digital products...',
      questions: [
        {
          text: 'Describe your design process from research to implementation',
          type: 'Video',
          required: true,
          timeLimit: 120
        },
        {
          text: 'How do you incorporate user feedback into your design iterations?',
          type: 'Text',
          required: true,
          timeLimit: 180
        }
      ],
      status: 'ongoing',
      attemptsCount: 1
    },
    {
      id: '3',
      jobTitle: 'Backend Engineer',
      experience: '<1 year',
      description: 'Entry-level Backend Engineer position for someone passionate about building robust APIs...',
      questions: [
        {
          text: 'Explain RESTful API design principles',
          type: 'Video',
          required: true,
          timeLimit: 90
        }
      ],
      status: 'draft'
    }
  ]);
  
  const [sheetOpen, setSheetOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [aiModalOpen, setAIModalOpen] = useState(false);
  
  const [showForm, setShowForm] = useState(false);
  const [currentInterview, setCurrentInterview] = useState<SavedInterview | null>(null);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState('');

  const randomType = () => ['Video', 'Audio', 'Text'][Math.floor(Math.random() * 3)];

  const filteredForms = savedForms.filter(form => {
    const matchesSearch = form.jobTitle.toLowerCase().includes(filters.search.toLowerCase()) ||
                        form.description.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || form.status === filters.status;
    
    const matchesExperience = filters.experience === 'all' || form.experience === filters.experience;
    
    return matchesSearch && matchesStatus && matchesExperience;
  });
  
  const totalPages = Math.max(1, Math.ceil(filteredForms.length / itemsPerPage));
  const paginatedForms = filteredForms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

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
    setLoadingAction('save');
    setIsLoading(true);
    
    setTimeout(() => {
      const id = Date.now().toString();
      const form: SavedInterview = { 
        id, 
        jobTitle, 
        experience, 
        description, 
        questions,
        status: 'draft'
      };
      
      setSavedForms([...savedForms, form]);
      setShowForm(false);
      setCurrentInterview(form);
      resetForm();
      setIsLoading(false);
      setLoadingAction('');
    }, 800);
  };
  
  const saveDraft = () => {
    if (!currentInterview) return;
    
    setLoadingAction('save-draft');
    setIsLoading(true);
    
    setTimeout(() => {
      const updatedForms = savedForms.map(form => {
        if (form.id === currentInterview.id) {
          return {
            ...form,
            status: 'draft' as const,
            questions: form.questions
          };
        }
        return form;
      });
      
      setSavedForms(updatedForms);
      
      setIsLoading(false);
      setLoadingAction('');
    }, 600);
  };
  
  const resetForm = () => {
    setJobTitle('');
    setExperience('');
    setDescription('');
    setQuestions([]);
  };

  const loadForm = (interview: SavedInterview) => {
    setLoadingAction(`load-${interview.id}`);
    setIsLoading(true);
    
    setTimeout(() => {
      setJobTitle(interview.jobTitle);
      setExperience(interview.experience);
      setDescription(interview.description);
      setQuestions(interview.questions);
      setShowForm(true);
      setCurrentInterview(interview);
      setIsLoading(false);
      setLoadingAction('');
    }, 600);
  };
  
  const startInterview = (interview: SavedInterview) => {
    setLoadingAction(`start-${interview.id}`);
    setIsLoading(true);
    
    setTimeout(() => {
      setCurrentInterview(interview);
      setIsInterviewActive(true);
      setShowForm(false);
      setIsLoading(false);
      setLoadingAction('');
      
      const updatedForms = savedForms.map(form => {
        if (form.id === interview.id) {
          return { ...form, status: 'ongoing' as const };
        }
        return form;
      });
      
      setSavedForms(updatedForms);
    }, 800);
  };
  
  const handleInterviewComplete = (collectedAnswers: Answer[]) => {
    setLoadingAction('complete');
    setIsLoading(true);
    
    setTimeout(() => {
      setAnswers(collectedAnswers);
      setIsInterviewActive(false);
      setShowResults(true);
      setIsLoading(false);
      setLoadingAction('');
      
      const updatedForms = savedForms.map(form => {
        if (form.id === currentInterview?.id) {
          return { 
            ...form, 
            status: 'completed' as const,
            attemptsCount: (form.attemptsCount || 0) + 1
          };
        }
        return form;
      });
      
      setSavedForms(updatedForms);
    }, 1000);
  };
  
  const handleCreateNewInterview = () => {
    setLoadingAction('create');
    setIsLoading(true);
    
    setTimeout(() => {
      setShowForm(true);
      setCurrentInterview(null);
      setShowResults(false);
      resetForm();
      setIsLoading(false);
      setLoadingAction('');
    }, 600);
  };
  
  const handleBackToHome = () => {
    setLoadingAction('back');
    setIsLoading(true);
    
    setTimeout(() => {
      setIsInterviewActive(false);
      setShowForm(false);
      setShowResults(false);
      setIsLoading(false);
      setLoadingAction('');
      
      if (currentInterview && currentInterview.status === 'ongoing') {
        const updatedForms = savedForms.map(form => {
          if (form.id === currentInterview.id) {
            return { ...form, status: 'draft' as const };
          }
          return form;
        });
        
        setSavedForms(updatedForms);
      }
    }, 600);
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

  if (showResults && currentInterview) {
    return (
      <div className="max-w-full md:max-w-6xl mx-auto p-3 md:p-6 space-y-6 md:space-y-8 bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 min-h-screen">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBackToHome}
            className="mb-4"
            isLoading={isLoading && loadingAction === 'back'}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
        
        <InterviewResultsAnalysis 
          interview={currentInterview} 
          answers={answers} 
          onBackToList={() => {
            setIsLoading(true);
            setTimeout(() => {
              setShowResults(false);
              setCurrentInterview(null);
              setIsLoading(false);
            }, 600);
          }}
          onEditInterview={() => {
            setIsLoading(true);
            setTimeout(() => {
              loadForm(currentInterview);
              setShowResults(false);
              setIsLoading(false);
            }, 600);
          }}
          onRetakeInterview={() => {
            setIsLoading(true);
            setTimeout(() => {
              startInterview(currentInterview);
              setShowResults(false);
              setIsLoading(false);
            }, 600);
          }}
        />
      </div>
    );
  }
  
  if (isInterviewActive && currentInterview) {
    return (
      <div className="max-w-full md:max-w-6xl mx-auto p-3 md:p-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 min-h-screen">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            onClick={handleBackToHome}
            className="mb-2"
            isLoading={isLoading && loadingAction === 'back'}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <Button
            variant="outline"
            onClick={saveDraft}
            className="mb-2"
            isLoading={isLoading && loadingAction === 'save-draft'}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
        </div>
        
        <InterviewSession 
          interview={currentInterview} 
          onComplete={handleInterviewComplete}
        />
      </div>
    );
  }

  return (
    <div className="max-w-full md:max-w-6xl mx-auto p-3 md:p-6 space-y-6 md:space-y-8 bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 min-h-screen">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-indigo-700 animate-fade-in">Interview Question Builder</h2>

      {showForm ? (
        <>
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
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                onClick={handleBackToHome} 
                className="mr-2"
                isLoading={isLoading && loadingAction === 'back'}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </div>
          </div>

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

          <div className="flex flex-col md:flex-row gap-6">
            <div className="hidden md:block md:w-2/5 space-y-6">
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

              <Button 
                className="w-full py-6 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2 text-lg hover:scale-[1.02] transition-transform animate-fade-in"
                onClick={() => setAIModalOpen(true)}
              >
                <Sparkles className="h-5 w-5" />
                Generate with AI
              </Button>
            </div>

            <div className="w-full md:w-3/5 space-y-4">
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

              <div className="bg-white p-3 md:p-4 rounded-lg shadow">
                <InterviewSummaryCard 
                  jobTitle={jobTitle} 
                  experience={experience} 
                  questions={questions} 
                />
              </div>
            </div>
          </div>

          <Button 
            className="w-full bg-green-600 hover:bg-green-700 text-white hover:scale-[1.01] transition-transform animate-fade-in" 
            onClick={saveForm}
            disabled={questions.length === 0 || !jobTitle || isLoading}
            isLoading={isLoading && loadingAction === 'save'}
          >
            <Save className="mr-2 h-4 w-4" /> Save Interview
          </Button>
        </>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <h3 className="text-xl md:text-2xl font-semibold text-indigo-700">Saved Interviews</h3>
            <Button 
              onClick={handleCreateNewInterview}
              className="bg-indigo-600 hover:bg-indigo-700"
              isLoading={isLoading && loadingAction === 'create'}
              disabled={isLoading}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New
            </Button>
          </div>
          
          <InterviewFilters onFilterChange={setFilters} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedForms.length > 0 ? (
              paginatedForms.map((interview, index) => (
                <InterviewCard
                  key={interview.id}
                  interview={interview}
                  onStartInterview={startInterview}
                  onEditInterview={loadForm}
                  isLoading={isLoading}
                  loadingAction={loadingAction}
                />
              ))
            ) : (
              <div className="col-span-full text-center p-8 bg-white rounded-lg shadow">
                {filters.search || filters.status !== 'all' || filters.experience !== 'all' ? (
                  <p className="text-gray-500">No interviews match your filters. Try adjusting your search criteria.</p>
                ) : (
                  <p className="text-gray-500">No saved interviews yet. Create a new interview to get started.</p>
                )}
              </div>
            )}
          </div>
          
          {filteredForms.length > itemsPerPage && (
            <InterviewCardsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      )}
      
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
