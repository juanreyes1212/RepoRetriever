'use client';

import * as React from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { AnalyticsService } from '@/lib/analytics';
import { useToast } from '@/hooks/use-toast';

interface FeedbackDialogProps {
  userId: string;
}

export function FeedbackDialog({ userId }: FeedbackDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [feedbackType, setFeedbackType] = React.useState<'bug' | 'feature_request' | 'general'>('general');
  const [rating, setRating] = React.useState<number | undefined>();
  const [message, setMessage] = React.useState('');
  const [email, setEmail] = React.useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast({
        title: 'Message required',
        description: 'Please enter your feedback message.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    const success = await AnalyticsService.submitFeedback({
      user_id: userId,
      feedback_type: feedbackType,
      rating,
      message: message.trim(),
      contact_email: email.trim() || undefined,
    });

    setLoading(false);

    if (success) {
      toast({
        title: 'Feedback submitted',
        description: 'Thank you for your feedback!',
      });
      setOpen(false);
      setMessage('');
      setEmail('');
      setRating(undefined);
      setFeedbackType('general');
    } else {
      toast({
        title: 'Submission failed',
        description: 'Failed to submit feedback. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          Send Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Send Feedback</DialogTitle>
            <DialogDescription>
              Help us improve RepoRetriever by sharing your thoughts, reporting bugs, or suggesting new features.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="feedback-type">Feedback Type</Label>
              <Select
                value={feedbackType}
                onValueChange={(value: any) => setFeedbackType(value)}
              >
                <SelectTrigger id="feedback-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Feedback</SelectItem>
                  <SelectItem value="bug">Bug Report</SelectItem>
                  <SelectItem value="feature_request">Feature Request</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="rating">Rating (Optional)</Label>
              <Select
                value={rating?.toString()}
                onValueChange={(value) => setRating(parseInt(value))}
              >
                <SelectTrigger id="rating">
                  <SelectValue placeholder="Select a rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">⭐⭐⭐⭐⭐ Excellent</SelectItem>
                  <SelectItem value="4">⭐⭐⭐⭐ Good</SelectItem>
                  <SelectItem value="3">⭐⭐⭐ Average</SelectItem>
                  <SelectItem value="2">⭐⭐ Below Average</SelectItem>
                  <SelectItem value="1">⭐ Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Tell us what you think..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Provide your email if you&apos;d like us to follow up with you.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                'Sending...'
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Feedback
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
