
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GenerationSourceButtonProps {
  isActive: boolean;
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
}

export function GenerationSourceButton({ 
  isActive, 
  icon: Icon, 
  title, 
  description, 
  onClick 
}: GenerationSourceButtonProps) {
  const buttonClass = cn(`
    flex flex-col items-center p-4 h-auto space-y-2 transition-all duration-200 
    hover:scale-[1.02] animate-fade-in rounded-lg w-full
    ${isActive 
      ? 'bg-purple-600 hover:bg-purple-700 text-white' 
      : 'bg-white border-2 border-purple-200 hover:border-purple-400'
    }
  `);

  return (
    <button onClick={onClick} className={buttonClass}>
      <Icon className="h-8 w-8 mb-2" />
      <span className="text-sm font-medium">{title}</span>
      <span className="text-xs opacity-75">{description}</span>
    </button>
  );
}
