import { toast } from "@/components/ui/sonner";

// Interfaces for API responses
export interface Email {
  id: string;
  from: string;
  subject: string;
  date: string;
  status: 'phishing' | 'suspicious' | 'legitimate';
  content?: string;
}

export interface AnalysisResult {
  verdict: 'phishing' | 'suspicious' | 'legitimate';
  confidence: number;
  triggeredRules: {
    id: string;
    name: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
  }[];
  threatIntelligence?: {
    domain: string;
    maliciousScore: number;
    detections: number;
    lastSeen: string;
    ipAddresses: string[];
  };
}

export interface TimeSeriesData {
  date: string;
  phishing: number;
  suspicious: number;
  legitimate: number;
}

export interface AttackPattern {
  name: string;
  count: number;
}

export interface DomainAnalysis {
  domain: string;
  count: number;
  threatLevel: number;
}

// Mock data for development
const mockEmails: Email[] = [
  {
    id: '1',
    from: 'security@appletrust.com',
    subject: 'Your Apple ID was used to sign in to iCloud on a new device',
    date: '2023-05-14T10:30:00Z',
    status: 'phishing',
    content: 'Dear Customer, Your Apple ID was used to sign in to iCloud on a Windows device. Time: May 14, 2023. If you did not authorize this, please verify your identity at: http://apple-verify.suspicious-domain.com'
  },
  {
    id: '2',
    from: 'paypal-service@mail.paypal.com',
    subject: 'Unusual activity detected in your account',
    date: '2023-05-12T08:45:00Z',
    status: 'suspicious',
    content: 'We noticed unusual activity in your PayPal account. Please review and confirm if this transaction for $750 was authorized by you. If not, log in to secure-paypal.com immediately.'
  },
  {
    id: '3',
    from: 'newsletter@dribbble.com',
    subject: 'Discover new design trends',
    date: '2023-05-10T15:20:00Z',
    status: 'legitimate',
    content: 'This week on Dribbble: Check out the latest UI design trends, new portfolio features, and upcoming community events for designers.'
  },
  {
    id: '4',
    from: 'no-reply@microsoftonline.team',
    subject: 'Your Office 365 password will expire today',
    date: '2023-05-13T09:15:00Z',
    status: 'phishing',
    content: 'URGENT: Your Microsoft Office 365 password will expire in 24 hours. To continue using your account without interruption, click here: http://office365-renewal.malicious-site.org'
  },
  {
    id: '5',
    from: 'billing@amazon.com',
    subject: 'Your Amazon order #12345 has shipped',
    date: '2023-05-11T12:30:00Z',
    status: 'legitimate',
    content: 'Thank you for your order! Your package with order #12345 has shipped and is expected to arrive on May 15, 2023. Track your package with the following link: [Tracking Link]'
  },
  {
    id: '6',
    from: 'account-verify@bankofamerica-secure.co',
    subject: 'Urgent: Your account access has been limited',
    date: '2023-05-14T11:45:00Z',
    status: 'phishing',
    content: 'Dear valued customer, Your Bank of America account access has been limited due to failed verification attempts. Restore your access now: http://bank-verify.scam-site.com'
  }
];

const mockTimeSeriesData: TimeSeriesData[] = [
  { date: '2023-05-01', phishing: 5, suspicious: 3, legitimate: 42 },
  { date: '2023-05-02', phishing: 3, suspicious: 2, legitimate: 38 },
  { date: '2023-05-03', phishing: 8, suspicious: 4, legitimate: 45 },
  { date: '2023-05-04', phishing: 4, suspicious: 6, legitimate: 40 },
  { date: '2023-05-05', phishing: 7, suspicious: 5, legitimate: 37 },
  { date: '2023-05-06', phishing: 9, suspicious: 3, legitimate: 41 },
  { date: '2023-05-07', phishing: 6, suspicious: 4, legitimate: 39 },
];

const mockAttackPatterns: AttackPattern[] = [
  { name: 'Account Verification', count: 18 },
  { name: 'Payment Fraud', count: 12 },
  { name: 'Credential Harvest', count: 24 },
  { name: 'Malware Delivery', count: 9 },
  { name: 'CEO Fraud', count: 6 }
];

const mockDomainAnalysis: DomainAnalysis[] = [
  { domain: 'apple-verify.com', count: 15, threatLevel: 85 },
  { domain: 'secure-paypal.co', count: 12, threatLevel: 90 },
  { domain: 'microsoft-refresh.net', count: 10, threatLevel: 75 },
  { domain: 'amazon-delivery.info', count: 8, threatLevel: 80 },
  { domain: 'banking-secure.co', count: 7, threatLevel: 95 },
];

// Add CSRF token to all requests
const getCsrfToken = (): string => {
  // In a real implementation, this would get the token from a cookie or other secure source
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
};

const handleApiError = (error: any): never => {
  const message = error.message || 'An unexpected error occurred';
  toast.error(message);
  console.error('API Error:', error);
  throw error;
};

// API functions
export const fetchEmails = async (): Promise<Email[]> => {
  try {
    // In a real implementation, this would be an actual API call
    // const response = await fetch('/fetch-emails', {
    //   headers: {
    //     'X-CSRF-Token': getCsrfToken(),
    //   },
    // });
    // if (!response.ok) throw new Error('Failed to fetch emails');
    // return await response.json();
    
    // Using mock data for now
    return new Promise(resolve => {
      setTimeout(() => resolve(mockEmails), 500);
    });
  } catch (error) {
    return handleApiError(error);
  }
};

export const analyzeEmail = async (rawEmail: string): Promise<AnalysisResult> => {
  try {
    // In a real implementation, this would be an actual API call
    // const response = await fetch('/analyze', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'X-CSRF-Token': getCsrfToken(),
    //   },
    //   body: JSON.stringify({ raw_email: rawEmail }),
    // });
    // if (!response.ok) throw new Error('Failed to analyze email');
    // return await response.json();
    
    // Generate mock results based on content - improved algorithm for more accurate detection
    return new Promise(resolve => {
      setTimeout(() => {
        // Extract key parts from the email for analysis
        const lowerEmail = rawEmail.toLowerCase();
        
        // Common legitimate email characteristics
        const hasUnsubscribeLink = /unsubscribe|opt.?out|manage preferences/i.test(rawEmail);
        const hasPrivacyPolicy = /privacy policy|terms|conditions/i.test(rawEmail);
        const isNewsletter = /newsletter|weekly|monthly|update|digest/i.test(rawEmail);
        const hasProperSignature = /regards|sincerely|team|thanks|thank you/i.test(rawEmail);
        const hasLegitSender = /(@amazon\.com|@apple\.com|@microsoft\.com|@google\.com|@spotify\.com)$/i.test(lowerEmail);
        
        // Phishing indicators - strengthened patterns
        const hasPhishingWords = /password|verify|urgent|security alert|account suspended|unusual activity|click here immediately|update your information|account access|limited access|blocked|unauthorized|update details|confirm identity|verify account|unusual login|immediately|urgent action|security issue|compromise|unusual sign-in|sign-in attempt/i.test(lowerEmail);
        const hasSuspiciousLinks = /bit\.ly|goo\.gl|tinyurl|click here to|login now at|hxxp|verify-|secure-|account-verify|\.info\/|\.co\/verify|\.net\/secure/i.test(lowerEmail);
        const createsFear = /suspended|disabled|unauthorized|illegal|fraud|limited access|blocked|violation|compromised|unusual|notification|immediate action|risk|suspicious|locked|deactivated|restricted access/i.test(lowerEmail);
        const requestsPersonalInfo = /ssn|social security|credit card|update your account|confirm your details|verify your identity|password|username|login credentials|payment information|billing details|security question|birth date|mother's maiden name|pin code/i.test(lowerEmail);
        
        // Domain mismatch detection (e.g., email claims to be from apple but domain is different)
        const claimsToBeApple = /apple|icloud|itunes/i.test(lowerEmail) && !/@apple\.com/i.test(lowerEmail);
        const claimsToBeMicrosoft = /microsoft|office365|outlook|azure|onedrive/i.test(lowerEmail) && !/@microsoft\.com/i.test(lowerEmail);
        const claimsToBePayPal = /paypal|payment|transaction/i.test(lowerEmail) && !/@paypal\.com/i.test(lowerEmail);
        const claimsToBeBank = /bank|banking|account|transfer|statement/i.test(lowerEmail) && !/@[a-z]+bank\.com/i.test(lowerEmail);
        
        // Suspicious but not definitive indicators
        const hasSuspiciousWords = /confirm|security|update|login|access|important/i.test(lowerEmail);
        const containsLink = /http|www|\.com|\.net|\.org/i.test(lowerEmail);
        
        // Domain reputation check - mocked for demonstration
        const suspiciousDomains = ['suspicious-domain.com', 'secure-paypal.co', 'apple-verify.com', 'secure-login.net', 'account-verify.info'];
        const hasSuspiciousDomain = suspiciousDomains.some(domain => lowerEmail.includes(domain));
        
        // Count legitimate indicators - weighted
        let legitimateScore = 0;
        if (hasUnsubscribeLink) legitimateScore += 3;
        if (hasPrivacyPolicy) legitimateScore += 3;
        if (isNewsletter) legitimateScore += 2;
        if (hasProperSignature) legitimateScore += 2;
        if (hasLegitSender && !hasSuspiciousDomain) legitimateScore += 4;
        
        // Count phishing indicators - weighted
        let phishingScore = 0;
        if (hasPhishingWords) phishingScore += 3;
        if (hasSuspiciousLinks || hasSuspiciousDomain) phishingScore += 4;
        if (createsFear) phishingScore += 3;
        if (requestsPersonalInfo) phishingScore += 5;
        if (hasSuspiciousWords && containsLink) phishingScore += 2;
        if (claimsToBeApple || claimsToBeMicrosoft || claimsToBePayPal || claimsToBeBank) phishingScore += 5;
        
        // Make final decision
        let verdict: 'phishing' | 'suspicious' | 'legitimate';
        let confidence: number;
        
        // More strict classification rules
        if (phishingScore >= 3) {
          if (phishingScore > legitimateScore) {
            verdict = 'phishing';
            confidence = 70 + Math.min((phishingScore - legitimateScore) * 3, 25);
          } else {
            verdict = 'suspicious';
            confidence = 50 + Math.min(phishingScore * 3, 40);
          }
        } else if (phishingScore > 0) {
          if (legitimateScore > phishingScore * 2) {
            verdict = 'legitimate';
            confidence = 70 + Math.min(legitimateScore * 2, 25);
          } else {
            verdict = 'suspicious';
            confidence = 60;
          }
        } else {
          verdict = 'legitimate';
          confidence = 70 + Math.min(legitimateScore * 3, 25);
        }
        
        // Generate triggered rules based on verdict
        const rules = [];
        
        if (verdict === 'phishing') {
          if (hasPhishingWords) {
            rules.push({
              id: 'RULE001',
              name: 'Suspicious Language Patterns',
              description: 'Email contains language commonly used in phishing attempts',
              severity: 'high',
            });
          }
          if (hasSuspiciousLinks || hasSuspiciousDomain) {
            rules.push({
              id: 'RULE002',
              name: 'Suspicious Link/Domain Pattern',
              description: 'Email contains URLs or domains with suspicious patterns',
              severity: 'high',
            });
          }
          if (createsFear) {
            rules.push({
              id: 'RULE003',
              name: 'Urgency or Fear Tactics',
              description: 'Email creates a sense of urgency or fear to pressure user action',
              severity: 'medium',
            });
          }
          if (requestsPersonalInfo) {
            rules.push({
              id: 'RULE004',
              name: 'Requests Sensitive Information',
              description: 'Email asks for personal or sensitive information',
              severity: 'high',
            });
          }
          if (claimsToBeApple || claimsToBeMicrosoft || claimsToBePayPal || claimsToBeBank) {
            rules.push({
              id: 'RULE007',
              name: 'Brand Impersonation',
              description: 'Email claims to be from a well-known company but uses an inconsistent domain',
              severity: 'high',
            });
          }
        } else if (verdict === 'suspicious') {
          if (hasSuspiciousWords) {
            rules.push({
              id: 'RULE005',
              name: 'Potentially Misleading Content',
              description: 'Email contains words that could indicate misleading intent',
              severity: 'medium',
            });
          }
          if (containsLink && !hasUnsubscribeLink) {
            rules.push({
              id: 'RULE006',
              name: 'Unmarked External Links',
              description: 'Email contains links without proper context or identification',
              severity: 'low',
            });
          }
        } else {
          // For legitimate verdicts, add positive rules
          if (hasUnsubscribeLink && hasPrivacyPolicy) {
            rules.push({
              id: 'RULE008',
              name: 'Proper Email Structure',
              description: 'Email contains proper unsubscribe links and privacy notices',
              severity: 'low',
            });
          }
          if (hasLegitSender) {
            rules.push({
              id: 'RULE009',
              name: 'Verified Sender Domain',
              description: 'Email is from a known legitimate domain',
              severity: 'low',
            });
          }
        }
        
        // Only include threat intelligence for phishing or suspicious emails
        const threatIntelligence = (verdict !== 'legitimate') ? {
          domain: hasSuspiciousDomain ? suspiciousDomains.find(domain => lowerEmail.includes(domain)) || 'suspicious-domain.com' : 'suspicious-domain.com',
          maliciousScore: verdict === 'phishing' ? 85 : 60,
          detections: verdict === 'phishing' ? 16 : 8,
          lastSeen: '2023-05-10',
          ipAddresses: ['192.168.1.1', '10.0.0.1'],
        } : undefined;
        
        resolve({
          verdict,
          confidence,
          triggeredRules: rules,
          threatIntelligence,
        });
      }, 800);
    });
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchThreatTimeSeriesData = async (): Promise<TimeSeriesData[]> => {
  try {
    // In a real implementation, this would be an actual API call
    // const response = await fetch('/threat-time-series', {
    //   headers: {
    //     'X-CSRF-Token': getCsrfToken(),
    //   },
    // });
    // if (!response.ok) throw new Error('Failed to fetch threat time series data');
    // return await response.json();
    
    // Using mock data for now
    return new Promise(resolve => {
      setTimeout(() => resolve(mockTimeSeriesData), 800);
    });
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchAttackPatterns = async (): Promise<AttackPattern[]> => {
  try {
    // In a real implementation, this would be an actual API call
    // const response = await fetch('/attack-patterns', {
    //   headers: {
    //     'X-CSRF-Token': getCsrfToken(),
    //   },
    // });
    // if (!response.ok) throw new Error('Failed to fetch attack patterns');
    // return await response.json();
    
    // Using mock data for now
    return new Promise(resolve => {
      setTimeout(() => resolve(mockAttackPatterns), 600);
    });
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchDomainAnalysis = async (): Promise<DomainAnalysis[]> => {
  try {
    // In a real implementation, this would be an actual API call
    // const response = await fetch('/domain-analysis', {
    //   headers: {
    //     'X-CSRF-Token': getCsrfToken(),
    //   },
    // });
    // if (!response.ok) throw new Error('Failed to fetch domain analysis');
    // return await response.json();
    
    // Using mock data for now
    return new Promise(resolve => {
      setTimeout(() => resolve(mockDomainAnalysis), 700);
    });
  } catch (error) {
    return handleApiError(error);
  }
};

export const quarantineEmail = async (emailId: string): Promise<void> => {
  try {
    // In a real implementation, this would be an actual API call
    // const response = await fetch(`/quarantine/${emailId}`, {
    //   method: 'POST',
    //   headers: {
    //     'X-CSRF-Token': getCsrfToken(),
    //   },
    // });
    // if (!response.ok) throw new Error('Failed to quarantine email');
    // return;
    
    // Mock success for now
    return new Promise(resolve => {
      setTimeout(() => {
        toast.success('Email quarantined successfully');
        resolve();
      }, 500);
    });
  } catch (error) {
    return handleApiError(error);
  }
};
