
import { useState } from "react";
import { Email } from "@/services/api";
import { Button } from "@/components/ui/button";
import { EmailListItem } from "./EmailListItem";
import { Search, ArrowUpDown, Inbox } from "lucide-react";
import { Input } from "@/components/ui/input";

interface EmailListProps {
  emails: Email[];
  onSelectEmail: (email: Email) => void;
  selectedEmailId?: string;
  isLoading: boolean;
}

export function EmailList({ emails, onSelectEmail, selectedEmailId, isLoading }: EmailListProps) {
  const [sortField, setSortField] = useState<'date' | 'status'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSort = (field: 'date' | 'status') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const filteredEmails = emails.filter(email => 
    email.from.toLowerCase().includes(searchQuery.toLowerCase()) || 
    email.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const sortedEmails = [...filteredEmails].sort((a, b) => {
    if (sortField === 'date') {
      return sortDirection === 'asc' 
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      // Sort by status priority: phishing (highest) > suspicious > legitimate
      const statusPriority = { phishing: 3, suspicious: 2, legitimate: 1 };
      return sortDirection === 'asc'
        ? statusPriority[a.status] - statusPriority[b.status]
        : statusPriority[b.status] - statusPriority[a.status];
    }
  });
  
  if (isLoading) {
    return (
      <div className="border rounded-xl overflow-hidden bg-card">
        <div className="p-4 border-b bg-muted/30">
          <div className="h-10 bg-muted/50 rounded-lg animate-pulse"></div>
        </div>
        <div className="divide-y">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-5 bg-muted/50 rounded w-1/3 animate-pulse"></div>
                  <div className="h-5 bg-muted/50 rounded w-1/4 animate-pulse"></div>
                </div>
                <div className="h-5 bg-muted/50 rounded w-2/3 animate-pulse"></div>
                <div className="h-4 bg-muted/50 rounded w-1/4 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="border rounded-xl overflow-hidden bg-card/50 backdrop-blur-sm transition-all hover:shadow-md">
      <div className="p-4 border-b bg-muted/30">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg border-gray-200 dark:border-gray-700"
            />
          </div>
        </div>
        <div className="flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSort('date')}
            className="text-xs"
          >
            Date
            {sortField === 'date' && (
              <ArrowUpDown className="ml-1 h-3 w-3" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSort('status')}
            className="text-xs"
          >
            Status
            {sortField === 'status' && (
              <ArrowUpDown className="ml-1 h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
      <div className="max-h-[500px] overflow-y-auto">
        {sortedEmails.length > 0 ? (
          sortedEmails.map((email) => (
            <EmailListItem
              key={email.id}
              email={email}
              onSelect={onSelectEmail}
              isSelected={email.id === selectedEmailId}
            />
          ))
        ) : (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
            <div className="rounded-full bg-muted/30 p-4 mb-3">
              <Inbox className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-medium mb-1">No emails found</p>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "Try adjusting your search" : "Your inbox is empty"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
