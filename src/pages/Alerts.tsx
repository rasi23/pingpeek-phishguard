
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchEmails } from "@/services/api";
import { AlertTriangle, AlertCircle, Clock, Calendar, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { Separator } from "@/components/ui/separator";

function Alerts() {
  const { data: emails = [] } = useQuery({
    queryKey: ['emails'],
    queryFn: fetchEmails,
  });

  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  // Filter only phishing and suspicious emails
  const alerts = emails
    .filter(email => (email.status === 'phishing' || email.status === 'suspicious'))
    .filter(email => !dismissedAlerts.has(email.id));

  const handleDismiss = (id: string) => {
    setDismissedAlerts(prev => new Set(prev).add(id));
    toast.success("Alert dismissed");
  };

  const handleDismissAll = () => {
    const newDismissed = new Set(dismissedAlerts);
    alerts.forEach(alert => newDismissed.add(alert.id));
    setDismissedAlerts(newDismissed);
    toast.success("All alerts dismissed");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Alerts</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage detected threats</p>
        </div>
        
        {alerts.length > 0 && (
          <Button 
            variant="outline" 
            onClick={handleDismissAll}
            className="self-start sm:self-center"
          >
            Dismiss All
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="bg-danger/5 border-danger/20">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-danger/10">
                <AlertCircle className="h-5 w-5 text-danger" />
              </div>
              <div>
                <CardTitle>Phishing</CardTitle>
                <CardDescription>Malicious emails detected</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {emails.filter(email => email.status === 'phishing').length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-warning/5 border-warning/20">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-warning/10">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <CardTitle>Suspicious</CardTitle>
                <CardDescription>Emails requiring review</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {emails.filter(email => email.status === 'suspicious').length}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Separator className="my-6" />
      
      {alerts.length > 0 ? (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card 
              key={alert.id} 
              className={`border-l-4 ${
                alert.status === 'phishing' ? 'border-l-danger' : 'border-l-warning'
              } hover:shadow-md transition-all animate-fade-in`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {alert.status === 'phishing' ? (
                        <AlertCircle className="h-5 w-5 text-danger" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-warning" />
                      )}
                      {alert.subject}
                    </CardTitle>
                    <CardDescription>From: {alert.from}</CardDescription>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={alert.status === 'phishing' ? 
                      'bg-danger/10 text-danger border-danger/30' : 
                      'bg-warning/10 text-warning border-warning/30'
                    }
                  >
                    {alert.status === 'phishing' ? 'Phishing' : 'Suspicious'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground mb-3 gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(alert.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(alert.date).toLocaleTimeString()}</span>
                  </div>
                </div>
                
                <div className="text-sm border-l-2 border-muted pl-3 py-1 mb-4 bg-gray-50 dark:bg-gray-900/40 rounded">
                  {alert.content && alert.content.length > 150 
                    ? `${alert.content.substring(0, 150)}...` 
                    : alert.content}
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" variant="destructive">Quarantine</Button>
                  <Button size="sm" variant="outline">View Details</Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleDismiss(alert.id)}
                  >
                    Dismiss
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-green-50 dark:bg-green-900/20 p-4 mb-4">
              <ShieldAlert className="h-8 w-8 text-safe" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Active Alerts</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              There are currently no phishing or suspicious emails that require your attention.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Alerts;
