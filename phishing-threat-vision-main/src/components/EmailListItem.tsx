
import { useState } from 'react';
import { Check, AlertCircle, AlertTriangle } from "lucide-react";
import { Email, quarantineEmail } from "@/services/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

interface EmailListItemProps {
  email: Email;
  onSelect: (email: Email) => void;
  isSelected: boolean;
}

export function EmailListItem({ email, onSelect, isSelected }: EmailListItemProps) {
  const [isQuarantining, setIsQuarantining] = useState(false);
  
  const handleQuarantine = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsQuarantining(true);
      await quarantineEmail(email.id);
      toast.success(`Email from ${email.from} has been quarantined`);
    } catch (error) {
      console.error('Failed to quarantine email:', error);
      toast.error('Failed to quarantine email');
    } finally {
      setIsQuarantining(false);
    }
  };
  
  const statusIcon = () => {
    switch (email.status) {
      case 'phishing':
        return <AlertCircle className="h-4 w-4 text-danger" />;
      case 'suspicious':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'legitimate':
        return <Check className="h-4 w-4 text-safe" />;
    }
  };
  
  const statusBadge = () => {
    switch (email.status) {
      case 'phishing':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-danger/10 text-danger">Phishing</span>;
      case 'suspicious':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">Suspicious</span>;
      case 'legitimate':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-safe/10 text-safe">Legitimate</span>;
    }
  };
  
  return (
    <div 
      onClick={() => onSelect(email)}
      className={cn(
        "cursor-pointer p-4 hover:bg-muted/30 relative transition-all animate-fade-in",
        isSelected ? "bg-primary/5 dark:bg-primary/10" : "",
        email.status === 'phishing' ? "border-l-4 border-l-danger" : 
        email.status === 'suspicious' ? "border-l-4 border-l-warning" : "",
        "border-b"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={cn(
            "w-2 h-2 rounded-full", 
            email.status === 'phishing' ? "bg-danger" : 
            email.status === 'suspicious' ? "bg-warning" : "bg-safe"
          )}></div>
          <div className="font-medium">{email.from}</div>
        </div>
        <div>{statusBadge()}</div>
      </div>
      <div className="mt-2 text-sm font-medium">{email.subject}</div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-muted-foreground">
          {new Date(email.date).toLocaleDateString()}
        </span>
        {(email.status === 'phishing' || email.status === 'suspicious') && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleQuarantine} 
            disabled={isQuarantining}
            className="text-xs h-7 px-2"
          >
            Quarantine
          </Button>
        )}
      </div>
    </div>
  );
}
