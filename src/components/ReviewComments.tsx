
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, ThumbsUp, Send, User, Globe } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface Review {
  id: string;
  reviewerName: string;
  comment: string;
  isAnonymous: boolean;
  timestamp: string;
}

interface ReviewCommentsProps {
  interviewId: string;
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'timestamp'>) => void;
}

export function ReviewComments({ interviewId, reviews, onAddReview }: ReviewCommentsProps) {
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [reviewerName, setReviewerName] = useState('John Doe'); // This would come from user profile
  const isMobile = useIsMobile();
  
  const handleSubmitReview = () => {
    if (!comment.trim()) return;
    
    onAddReview({
      reviewerName: isAnonymous ? 'Anonymous' : reviewerName,
      comment,
      isAnonymous
    });
    
    setComment('');
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5 text-indigo-600" />
            Reviews & Feedback
            <Badge variant="secondary" className="ml-2 bg-indigo-100 text-indigo-700">
              {reviews.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center p-6 bg-gray-50 border">
                <p className="text-gray-500">No reviews yet. Be the first to provide feedback!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="p-4 bg-gray-50 border animate-fade-in">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {review.isAnonymous ? (
                          <Globe className="h-5 w-5 text-gray-500" />
                        ) : (
                          <User className="h-5 w-5 text-indigo-600" />
                        )}
                        <span className="font-medium">{review.reviewerName}</span>
                      </div>
                      <span className="text-xs text-gray-500">{review.timestamp}</span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                    <div className="flex justify-end mt-2">
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-indigo-600">
                        <ThumbsUp className="h-4 w-4 mr-1" /> Helpful
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">Add Your Feedback</h4>
              <Textarea
                placeholder="Write your review here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px] mb-3 animate-fade-in"
              />
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={isAnonymous}
                    onChange={() => setIsAnonymous(!isAnonymous)}
                    className="mr-2"
                  />
                  <label htmlFor="anonymous" className="text-sm text-gray-600">Submit anonymously</label>
                </div>
                
                <Button 
                  onClick={handleSubmitReview} 
                  className="bg-indigo-600 hover:bg-indigo-700 animate-fade-in"
                  disabled={!comment.trim()}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Submit Feedback
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
