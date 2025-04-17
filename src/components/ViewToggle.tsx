
import { Button } from "@/components/ui/button";
import { LayoutGrid, Table as TableIcon } from "lucide-react";

interface ViewToggleProps {
  viewMode: 'card' | 'table';
  onViewModeChange: (mode: 'card' | 'table') => void;
  className?: string;
}

export function ViewToggle({ viewMode, onViewModeChange, className }: ViewToggleProps) {
  return (
    <div className={`flex gap-2 animate-fade-in ${className}`}>
      <Button 
        size="sm" 
        variant={viewMode === 'card' ? "default" : "outline"} 
        onClick={() => onViewModeChange('card')}
        className="hover:scale-110 transition-transform animate-fade-in"
      >
        <LayoutGrid className="h-4 w-4 mr-2" />
        Cards
      </Button>
      <Button 
        size="sm" 
        variant={viewMode === 'table' ? "default" : "outline"} 
        onClick={() => onViewModeChange('table')}
        className="hover:scale-110 transition-transform animate-fade-in"
      >
        <TableIcon className="h-4 w-4 mr-2" />
        Table
      </Button>
    </div>
  );
}
