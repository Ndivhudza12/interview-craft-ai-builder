
import { FileText, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FileUploadSectionProps {
  fileContent: File | null;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FileUploadSection({ fileContent, onFileUpload }: FileUploadSectionProps) {
  return (
    <div className="space-y-2 animate-fade-in">
      <Label className="text-purple-800 font-medium">Upload Resume/CV</Label>
      <div className="border-2 border-dashed border-purple-200 hover:border-purple-400 rounded-lg p-6 text-center transition-all">
        <Input
          id="fileUpload"
          type="file"
          onChange={onFileUpload}
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
  );
}
