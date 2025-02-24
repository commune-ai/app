'use client';

import { useState, useRef } from 'react';
import { Separator } from '@/components/ui/separator';
import { Link2, AlertCircle, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Image from 'next/image';
import { signMessage } from '@/utils/backend-login';
import { useWalletStore } from '@/store/use-wallet-state';
import { WalletType } from '@/types/wallet-types';
import { useAppReportStore } from '@/store/use-app-report-state';

export const AppTab = ({ name }: { name: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    moduleworking: false,
    description: '',
    modulename: name,
  });
  const [evidenceImage, setEvidenceImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { wallet, walletConnected } = useWalletStore();
  const { isReporting, sendReport } = useAppReportStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceImage) {
      toast.error('Please upload an evidence image.');
      return;
    }
    try {
      if (!walletConnected) {
        toast.error('Please connect your wallet to submit report.');
        return;
      }
      const signResponse = await signMessage(wallet?.name as WalletType);
      if (signResponse.success) {
        const formDataToSend = new FormData();
        formDataToSend.append('moduleworking', formData.moduleworking.toString());
        formDataToSend.append('description', formData.description);
        formDataToSend.append('modulename', formData.modulename);
        formDataToSend.append('image', evidenceImage);
        formDataToSend.append('signature', signResponse.signature as string);
        formDataToSend.append('type', signResponse.wallet as string);
        const response = await sendReport(formDataToSend);
        if (response.success) {
          toast.success('Report submitted successfully.');
        } else {
          toast.error(response.error);
        }
      } else {
        toast.error(signResponse.error);
      }
    } catch {
      toast.error('Failed to submit report. Please try again later.');
    } finally {
      setIsOpen(false);
      setFormData({
        moduleworking: false,
        description: '',
        modulename: name,
      });
      setEvidenceImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEvidenceImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setEvidenceImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  return (
    <div className="space-y-6">
      <Link
        href="https://bettertherapy.ai/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-white text-sm hover:underline hover:text-blue-600 flex items-center gap-2"
      >
        Go to App Url <Link2 className="w-4 h-4" />
      </Link>

      <Separator className="bg-white/10" />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <AlertCircle className="mr-2 h-4 w-4" />
            Proof of Interaction(App)
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[300px] md:max-w-[500px] bg-[#0F0F0F] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Proof of Interaction(App)</DialogTitle>
            <DialogDescription>
              Please provide details about the issue you&apos;re experiencing with the app. All fields are required.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="modulename">Module Name</Label>
              <Input
                id="modulename"
                name="modulename"
                value={formData.modulename}
                onChange={handleChange}
                disabled={true}
                className="bg-background text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label>Is the module working?</Label>
              <RadioGroup
                name="moduleworking"
                value={formData.moduleworking ? 'true' : 'false'}
                onValueChange={(value) => setFormData(prev => ({ ...prev, moduleworking: value === 'true' }))}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="working-yes" className='text-green-600' />
                  <Label htmlFor="working-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="working-no" className='text-green-600' />
                  <Label htmlFor="working-no">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Describe the Problem</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="bg-background text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="evidenceImage">Evidence Image (Required)</Label>
              <Input
                id="evidenceImage"
                name="evidenceImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={fileInputRef}
                required
                className="bg-background text-foreground"
              />
              {imagePreview && (
                <div className="relative mt-2">
                  <Image src={imagePreview || "/placeholder.svg"} alt="Evidence" className="max-w-full h-auto rounded-md" width={300} height={300} />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={!evidenceImage || isReporting}>Submit Report</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Separator className="bg-white/10" />
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">App Preview</h3>
        <div className="aspect-video w-full overflow-hidden rounded-lg border border-white/10">
          <iframe
            src="https://bettertherapy.ai/"
            className="w-full h-full"
            style={{ minHeight: '400px' }}
            title="Module Application Preview"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}
AppTab.displayName = 'AppTab';
