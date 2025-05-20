
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEmails, Email } from "@/services/api";
import { SummaryCard } from "@/components/SummaryCard";
import { Inbox, AlertCircle, AlertTriangle, Check } from "lucide-react";
import { EmailList } from "@/components/EmailList";
import { AnalysisPanel } from "@/components/AnalysisPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { ThreatVisualization } from "@/components/ThreatVisualization";

function Dashboard() {
  const [selectedEmail, setSelectedEmail] = useState<Email | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("inbox");
  
  // Fetch emails using React Query - fixed the onSuccess property
  const { data: emails = [], isLoading } = useQuery({
    queryKey: ['emails'],
    queryFn: fetchEmails,
    // Moving the success handler to an options object
    meta: {
      onSuccess: (data: Email[]) => {
        // Show toast notification for phishing emails
        const phishingEmails = data.filter(email => email.status === 'phishing');
        if (phishingEmails.length > 0) {
          phishingEmails.forEach(email => {
            toast.error("Phishing email detected!", {
              description: `From: ${email.from}`,
              action: {
                label: "View",
                onClick: () => {
                  setSelectedEmail(email);
                  setActiveTab("inbox");
                }
              }
            });
          });
        }
      }
    },
    refetchInterval: 60000 // Refetch every minute
  });
  
  const emailStats = {
    total: emails.length,
    phishing: emails.filter(email => email.status === 'phishing').length,
    suspicious: emails.filter(email => email.status === 'suspicious').length,
    legitimate: emails.filter(email => email.status === 'legitimate').length,
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Security Dashboard</h1>
      
      {/* Stats Summary */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Emails"
          value={emailStats.total}
          icon={<Inbox className="text-primary" />}
          description="Total emails analyzed"
          className="card-gradient"
        />
        <SummaryCard
          title="Phishing Detected"
          value={emailStats.phishing}
          icon={<AlertCircle className="text-danger" />}
          description="Malicious emails identified"
          className={emailStats.phishing > 0 ? "border-danger/30 bg-danger/5" : ""}
          trend={emailStats.phishing > 0 ? { value: 12, positive: false } : undefined}
        />
        <SummaryCard
          title="Suspicious"
          value={emailStats.suspicious}
          icon={<AlertTriangle className="text-warning" />}
          description="Emails requiring review"
          className={emailStats.suspicious > 0 ? "border-warning/30 bg-warning/5" : ""}
        />
        <SummaryCard
          title="Legitimate"
          value={emailStats.legitimate}
          icon={<Check className="text-safe" />}
          description="Safe emails"
          className="border-safe/30 bg-safe/5"
          trend={{ value: 5, positive: true }}
        />
      </div>

      {/* Tab Navigation */}
      <Tabs defaultValue="inbox" value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="w-full grid grid-cols-3 md:w-auto md:inline-flex rounded-xl p-1">
          <TabsTrigger value="inbox" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary dark:data-[state=active]:bg-primary/20 rounded-lg">Email Inbox</TabsTrigger>
          <TabsTrigger value="analysis" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary dark:data-[state=active]:bg-primary/20 rounded-lg">Analysis</TabsTrigger>
          <TabsTrigger value="visualization" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary dark:data-[state=active]:bg-primary/20 rounded-lg">Visualization</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inbox" className="mt-6 grid gap-6 md:grid-cols-2">
          <EmailList 
            emails={emails} 
            onSelectEmail={setSelectedEmail} 
            selectedEmailId={selectedEmail?.id}
            isLoading={isLoading}
          />
          <AnalysisPanel selectedEmail={selectedEmail} />
        </TabsContent>
        
        <TabsContent value="analysis" className="mt-6">
          <AnalysisPanel selectedEmail={selectedEmail} />
        </TabsContent>
        
        <TabsContent value="visualization" className="mt-6">
          <ThreatVisualization />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Dashboard;
