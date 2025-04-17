
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Copy, Share2, Users, Link, User, Check, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InterviewShareOptionsProps {
  interviewId: string;
  jobTitle: string;
}

export function InterviewShareOptions({ interviewId, jobTitle }: InterviewShareOptionsProps) {
  const [isPublic, setIsPublic] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const { toast } = useToast();
  
  const shareableLink = `https://interviews.example.com/shared/${interviewId}${isAnonymous ? '?anon=1' : ''}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    toast({
      title: "Link Copied!",
      description: "The shareable link has been copied to your clipboard.",
      duration: 3000,
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const handleShareByEmail = () => {
    if (!shareEmail) return;
    
    toast({
      title: "Sharing via Email",
      description: `Invitation sent to ${shareEmail}`,
      duration: 3000,
    });
    
    setShareEmail('');
  };
  
  const handleShareWithCommunity = () => {
    toast({
      title: isPublic ? "Shared with Community" : "Removed from Community",
      description: isPublic 
        ? "Your interview is now visible to the community" 
        : "Your interview is no longer visible to the community",
      duration: 3000,
    });
  };
  
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Share2 className="mr-2 h-5 w-5 text-indigo-600" />
          Share Your Interview Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Share as Anonymous</Label>
                <p className="text-sm text-muted-foreground">Hide your name and personal details</p>
              </div>
              <Switch
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
              />
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-indigo-600" />
                  <Label>Share with Community</Label>
                </div>
                <p className="text-sm text-muted-foreground">Make your interview visible to the community</p>
              </div>
              <Switch
                checked={isPublic}
                onCheckedChange={(checked) => {
                  setIsPublic(checked);
                  if (checked) {
                    handleShareWithCommunity();
                  }
                }}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="shareableLink">Shareable Link</Label>
            <div className="flex mt-1.5">
              <Input
                id="shareableLink"
                value={shareableLink}
                className="flex-1"
                readOnly
              />
              <Button 
                onClick={handleCopyLink} 
                className="ml-2 bg-indigo-600 hover:bg-indigo-700"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="shareEmail">Share via Email</Label>
            <div className="flex mt-1.5">
              <Input
                id="shareEmail"
                type="email"
                placeholder="colleague@example.com"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleShareByEmail} 
                className="ml-2 bg-indigo-600 hover:bg-indigo-700"
                disabled={!shareEmail}
              >
                <Mail className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <Button 
              variant="outline" 
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            >
              <User className="mr-2 h-4 w-4" />
              Share with Specific HR
            </Button>
            
            <Button 
              variant="outline"
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            >
              <Link className="mr-2 h-4 w-4" />
              More Sharing Options
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
