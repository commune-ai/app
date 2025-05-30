'use client';

import { useState, useCallback, JSX } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ModuleReportDialogProps {
  moduleName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ModuleReportDialog({
  moduleName,
  open,
  onOpenChange,
}: ModuleReportDialogProps): JSX.Element {
  const [problem, setProblem] = useState<string>('');

  const handleSubmit = useCallback(() => {
    const trimmedProblem = problem.trim();
    if (trimmedProblem) {
      // Here you would typically send the report data to your backend
      console.log('Report submitted:', { problem: trimmedProblem, moduleName });
      setProblem('');
      onOpenChange(false);
    }
  }, [problem, moduleName, onOpenChange]);

  const handleCancel = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProblem(e.target.value);
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-[#1a1b1e] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            Report Agent
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Submit a report for {moduleName}. Please provide detailed information about the issue.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">Describe the problem</label>
            <Textarea
              value={problem}
              onChange={handleTextChange}
              className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder-gray-400"
              placeholder="What issues are you experiencing with this module?"
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="border-white/10 bg-white/5 text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-blue-500 text-white hover:bg-blue-600"
            disabled={!problem.trim()}
          >
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
