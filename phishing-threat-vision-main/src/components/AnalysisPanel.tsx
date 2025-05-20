
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { analyzeEmail, AnalysisResult, Email } from "@/services/api";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, AlertTriangle, Check, ExternalLink, Shield, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface AnalysisPanelProps {
  selectedEmail?: Email;
}

export function AnalysisPanel({ selectedEmail }: AnalysisPanelProps) {
  const { toast } = useToast();
  const [rawEmail, setRawEmail] = useState<string>(selectedEmail?.content || "");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  
  const handleAnalyze = async () => {
    if (!rawEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter email content to analyze",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsAnalyzing(true);
      const analysisResult = await analyzeEmail(rawEmail);
      setResult(analysisResult);
      toast({
        title: `Analysis Complete: ${analysisResult.verdict.charAt(0).toUpperCase() + analysisResult.verdict.slice(1)}`,
        description: `Confidence: ${Math.round(analysisResult.confidence)}%`,
        variant: analysisResult.verdict === "phishing" ? "destructive" : 
                 analysisResult.verdict === "suspicious" ? "default" : 
                 "default",
      });
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        title: "Analysis failed",
        description: "Could not analyze the email content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const getResultIcon = () => {
    if (!result) return null;
    
    switch (result.verdict) {
      case "phishing":
        return <AlertCircle className="w-6 h-6 text-danger" />;
      case "suspicious":
        return <AlertTriangle className="w-6 h-6 text-warning" />;
      case "legitimate":
        return <Check className="w-6 h-6 text-safe" />;
    }
  };
  
  const getResultBadge = () => {
    if (!result) return null;
    
    switch (result.verdict) {
      case "phishing":
        return (
          <div className="bg-danger/10 text-danger border border-danger/20 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Phishing Detected
          </div>
        );
      case "suspicious":
        return (
          <div className="bg-warning/10 text-warning border border-warning/20 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Suspicious Content
          </div>
        );
      case "legitimate":
        return (
          <div className="bg-safe/10 text-safe border border-safe/20 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
            <Check className="w-4 h-4" />
            Legitimate Email
          </div>
        );
    }
  };
  
  const getConfidenceColor = () => {
    if (!result) return "bg-muted";
    
    if (result.confidence >= 80) {
      return result.verdict === "legitimate" ? "bg-safe" : "bg-danger";
    } else if (result.confidence >= 50) {
      return "bg-warning";
    } else {
      return "bg-muted-foreground";
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Email Analysis
            </CardTitle>
            <CardDescription>
              Analyze raw email content for potential threats
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste raw email content here..."
              value={rawEmail}
              onChange={(e) => setRawEmail(e.target.value)}
              rows={8}
              className="font-mono text-xs"
            />
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing || !rawEmail.trim()}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : "Analyze"}
            </Button>
          </CardContent>
        </Card>
        
        {result && (
          <Card className={cn(
            "animate-fade-in",
            result.verdict === "phishing" ? "border-danger/50" : 
            result.verdict === "suspicious" ? "border-warning/50" : 
            "border-safe/50"
          )}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  {getResultIcon()}
                  Analysis Results
                </CardTitle>
                {getResultBadge()}
              </div>
              <CardDescription>
                {result.verdict === "phishing"
                  ? "This email shows strong indicators of a phishing attempt"
                  : result.verdict === "suspicious"
                  ? "This email contains suspicious elements but may not be malicious"
                  : "This email appears to be legitimate"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Confidence Meter */}
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Confidence Score</span>
                  <span className="font-medium">{Math.round(result.confidence)}%</span>
                </div>
                <Progress 
                  value={result.confidence} 
                  max={100}
                  className={cn("h-2", getConfidenceColor())}
                />
              </div>
              
              {/* Email Characteristics */}
              <div>
                <h4 className="text-sm font-medium mb-2">Email Characteristics</h4>
                <div className="flex flex-wrap gap-2">
                  {result.verdict === "legitimate" && (
                    <>
                      <Badge variant="outline" className="bg-safe/10 text-safe border-safe/20">
                        Proper Structure
                      </Badge>
                      <Badge variant="outline" className="bg-safe/10 text-safe border-safe/20">
                        No Urgent Requests
                      </Badge>
                      <Badge variant="outline" className="bg-safe/10 text-safe border-safe/20">
                        No Personal Data Requests
                      </Badge>
                    </>
                  )}
                </div>
              </div>
              
              {/* Triggered Rules */}
              {result.triggeredRules.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Triggered Rules</h4>
                  <div className="space-y-2">
                    {result.triggeredRules.map((rule) => (
                      <div 
                        key={rule.id} 
                        className={cn(
                          "text-sm p-2 rounded-md",
                          rule.severity === "high" ? "bg-danger/10 border-l-2 border-danger" :
                          rule.severity === "medium" ? "bg-warning/10 border-l-2 border-warning" :
                          "bg-muted/50 border-l-2 border-muted-foreground"
                        )}
                      >
                        <div className="font-medium">{rule.name}</div>
                        <div className="text-xs text-muted-foreground">{rule.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Threat Intelligence */}
              {result.threatIntelligence && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Threat Intelligence</h4>
                  <Card>
                    <CardContent className="p-3 text-sm">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-medium">{result.threatIntelligence.domain}</span>
                        <div className={cn(
                          "px-2 py-0.5 rounded text-xs",
                          result.threatIntelligence.maliciousScore > 70 ? "bg-danger/10 text-danger" :
                          "bg-warning/10 text-warning"
                        )}>
                          Malicious Score: {result.threatIntelligence.maliciousScore}%
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>Detections: {result.threatIntelligence.detections}</div>
                        <div>Last Seen: {result.threatIntelligence.lastSeen}</div>
                      </div>
                      <Separator className="my-2" />
                      <div className="text-xs">
                        <strong>Associated IPs:</strong> {result.threatIntelligence.ipAddresses.join(", ")}
                      </div>
                      <div className="mt-2 text-xs">
                        <Button size="sm" variant="outline" className="text-xs h-7" asChild>
                          <a href="#" className="flex items-center gap-1">
                            <span>View in VirusTotal</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
