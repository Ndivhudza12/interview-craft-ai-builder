
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Filter, X } from 'lucide-react';

interface InterviewFiltersProps {
  onFilterChange: (filters: {
    search: string;
    status: string;
    experience: string;
  }) => void;
}

export function InterviewFilters({ onFilterChange }: InterviewFiltersProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [experience, setExperience] = useState('all');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (field: string, value: string) => {
    let newSearch = search;
    let newStatus = status;
    let newExperience = experience;
    
    switch (field) {
      case 'search':
        newSearch = value;
        setSearch(value);
        break;
      case 'status':
        newStatus = value;
        setStatus(value);
        break;
      case 'experience':
        newExperience = value;
        setExperience(value);
        break;
    }
    
    onFilterChange({
      search: newSearch,
      status: newStatus,
      experience: newExperience
    });
  };
  
  const resetFilters = () => {
    setSearch('');
    setStatus('all');
    setExperience('all');
    
    onFilterChange({
      search: '',
      status: 'all',
      experience: 'all'
    });
  };

  return (
    <div className="space-y-3 bg-white p-3 rounded-lg shadow-sm border border-indigo-50">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search interviews..."
          value={search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="pl-9 pr-4 py-2 w-full"
        />
      </div>
      
      <div className="md:hidden">
        <Button 
          variant="outline" 
          className="w-full text-gray-600 border-gray-200 flex items-center justify-between"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </div>
          {(status !== 'all' || experience !== 'all') && (
            <span className="bg-indigo-100 text-indigo-800 rounded-full h-5 w-5 flex items-center justify-center text-xs">
              {(status !== 'all' ? 1 : 0) + (experience !== 'all' ? 1 : 0)}
            </span>
          )}
        </Button>
      </div>
      
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 ${isExpanded ? 'block' : 'hidden md:grid'}`}>
        <Select value={status} onValueChange={(value) => handleFilterChange('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="ongoing">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={experience} onValueChange={(value) => handleFilterChange('experience', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Experience</SelectItem>
            <SelectItem value="<1 year">Less than 1 year</SelectItem>
            <SelectItem value="1-3 years">1-3 years</SelectItem>
            <SelectItem value=">3 years">More than 3 years</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          variant="ghost" 
          className="text-gray-500 hover:text-gray-700" 
          onClick={resetFilters}
          disabled={search === '' && status === 'all' && experience === 'all'}
        >
          <X className="h-4 w-4 mr-2" /> Clear filters
        </Button>
      </div>
    </div>
  );
}
