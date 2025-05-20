
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { DeveloperTeam } from "@/components/DeveloperTeam";
import { toast } from "@/components/ui/sonner";

function Settings() {
  const [notifyOnPhishing, setNotifyOnPhishing] = useState(true);
  const [notifyOnSuspicious, setNotifyOnSuspicious] = useState(true);
  const [quarantineAuto, setQuarantineAuto] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(75);
  const [apiKey, setApiKey] = useState("");
  const [apiUrl, setApiUrl] = useState("https://api.phishing-detection.example.com");
  
  const handleSaveSettings = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Settings</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure how you want to be notified about threats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notify-phishing" className="font-medium">Notify on Phishing</Label>
                <p className="text-sm text-muted-foreground">Get immediate alerts when phishing emails are detected</p>
              </div>
              <Switch 
                id="notify-phishing" 
                checked={notifyOnPhishing} 
                onCheckedChange={setNotifyOnPhishing} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notify-suspicious" className="font-medium">Notify on Suspicious</Label>
                <p className="text-sm text-muted-foreground">Get alerts for emails flagged as suspicious</p>
              </div>
              <Switch 
                id="notify-suspicious" 
                checked={notifyOnSuspicious} 
                onCheckedChange={setNotifyOnSuspicious} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Configure security behavior for detected threats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-quarantine" className="font-medium">Auto-Quarantine</Label>
                <p className="text-sm text-muted-foreground">Automatically quarantine phishing emails</p>
              </div>
              <Switch 
                id="auto-quarantine" 
                checked={quarantineAuto} 
                onCheckedChange={setQuarantineAuto}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="threshold">Confidence Threshold: {confidenceThreshold}%</Label>
              <Slider
                id="threshold"
                value={[confidenceThreshold]}
                min={50}
                max={95}
                step={5}
                onValueChange={(value) => setConfidenceThreshold(value[0])}
              />
              <p className="text-xs text-muted-foreground">
                Emails with a phishing confidence score above this threshold will trigger alerts
              </p>
            </div>
          </CardContent>
        </Card>

        {/* API Configuration */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>Set up connection to the phishing detection backend</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-url">API Endpoint URL</Label>
              <Input 
                id="api-url" 
                value={apiUrl} 
                onChange={(e) => setApiUrl(e.target.value)} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input 
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
              />
              <p className="text-xs text-muted-foreground">
                The API key is stored securely and transmitted only over HTTPS
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </CardFooter>
        </Card>
      </div>

      <Separator className="my-8" />

      {/* Developer Team Section */}
      <DeveloperTeam />
    </div>
  );
}

export default Settings;
