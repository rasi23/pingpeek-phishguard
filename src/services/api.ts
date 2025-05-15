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

// Environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// Utility to generate dynamic mock emails
const generateMockEmails = (count: number): Email[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${i + 1}`,
    from: `sender${i}@example.com`,
    subject: `Email ${i + 1}: ${['Urgent Action Required', 'Order Confirmation', 'Account Verification'][Math.floor(Math.random() * 3)]}`,
    date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: ['phishing', 'suspicious', 'legitimate'][Math.floor(Math.random() * 3)] as Email['status'],
    content: `This is a mock email content for testing purposes. ${Math.random() > 0.5 ? 'Click here: https://example.com' : ''}`,
  }));
};

// Mock data for development
const mockEmails: Email[] = generateMockEmails(6);
const mockTimeSeriesData: TimeSeriesData[] = Array.from({ length: 7 }, (_, i) => ({
  date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  phishing: Math.floor(Math.random() * 10),
  suspicious: Math.floor(Math.random() * 7),
  legitimate: Math.floor(Math.random() * 50) + 30,
}));
const mockAttackPatterns: AttackPattern[] = [
  { name: 'Account Verification', count: 18 },
  { name: 'Payment Fraud', count: 12 },
  { name: 'Credential Harvest', count: 24 },
  { name: 'Malware Delivery', count: 9 },
  { name: 'CEO Fraud', count: 6 },
];
const mockDomainAnalysis: DomainAnalysis[] = [
  { domain: 'apple-verify.com', count: 15, threatLevel: 85 },
  { domain: 'secure-paypal.co', count: 12, threatLevel: 90 },
  { domain: 'microsoft-refresh.net', count: 10, threatLevel: 75 },
  { domain: 'amazon-delivery.info', count: 8, threatLevel: 80 },
  { domain: 'banking-secure.co', count: 7, threatLevel: 95 },
];

// CSRF token handling
const getCsrfToken = async (): Promise<string> => {
  try {
    const url = `${API_BASE_URL}/csrf-token`;
    console.log(`[API] Fetching CSRF token from: ${url}`);
    const headers = {
      'Accept': 'application/json',
    };
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers,
    });
    console.log(`[API] CSRF fetch status: ${response.status}, URL: ${response.url}, Headers:`, headers);
    if (!response.ok) {
      const contentType = response.headers.get('content-type') || 'unknown';
      const errorText = await response.text();
      console.error(`[API] CSRF fetch failed with content-type: ${contentType}, body: ${errorText.slice(0, 500)}`);
      throw new Error(`Failed to fetch CSRF token: ${response.status} ${errorText.slice(0, 100)}`);
    }
    if (!response.headers.get('content-type')?.includes('application/json')) {
      const errorText = await response.text();
      throw new Error(`Expected JSON, received: ${errorText.slice(0, 100)}`);
    }
    const data = await response.json();
    const token = data.token;
    if (!token) throw new Error('CSRF token missing in response');
    console.log(`[API] CSRF token received: ${token}`);
    return token;
  } catch (error) {
    console.error('[API] CSRF token fetch error:', error);
    throw new Error(`CSRF token fetch failed: ${error.message}`);
  }
};

// Centralized toast notification
const showToast = (message: string, type: 'error' | 'success') => {
  if (toast) {
    toast[type](message);
  } else {
    console[type === 'error' ? 'error' : 'log'](message);
  }
};

// Centralized error handling
const handleApiError = (error: any, context: string): never => {
  const message = error.message || `An error occurred during ${context}`;
  showToast(message, 'error');
  console.error(`${context} Error:`, error);
  throw error;
};

/**
 * Fetches a list of emails from the API or mock data.
 * @param limit - Number of emails to fetch (default: 10).
 * @returns A promise resolving to an array of Email objects.
 */
export const fetchEmails = async (limit: number = 10): Promise<Email[]> => {
  try {
    if (typeof limit !== 'number' || isNaN(limit) || limit < 1) {
      console.warn(`[API] Invalid limit parameter: ${limit}. Using default limit=10.`);
      limit = 10;
    }
    if (USE_MOCK) {
      console.log('[API] Using mock emails');
      return new Promise(resolve => setTimeout(() => resolve(mockEmails.slice(0, limit)), 500));
    }
    const url = `${API_BASE_URL}/fetch-emails?limit=${encodeURIComponent(limit)}`;
    console.log(`[API] Fetching emails from: ${url}`);
    const headers = {
      'X-CSRF-Protection': '1',
      'X-CSRF-Token': await getCsrfToken(),
      'Accept': 'application/json',
    };
    const response = await fetch(url, {
      credentials: 'include',
      headers,
    });
    console.log(`[API] Emails fetch status: ${response.status}, URL: ${response.url}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch emails: ${response.status} ${errorText}`);
    }
    const data = await response.json();
    return data.emails;
  } catch (error) {
    return handleApiError(error, 'fetching emails');
  }
};

/**
 * Analyzes raw email content for potential threats.
 * @param rawEmail - The raw email content to analyze.
 * @returns A promise resolving to an AnalysisResult with verdict and threat details.
 */
export const analyzeEmail = async (rawEmail: string): Promise<AnalysisResult> => {
  try {
    if (USE_MOCK) {
      console.log('[API] Using mock email analysis');
      return new Promise(resolve => {
        setTimeout(() => {
          const hasPhishingWords = /password|verify|urgent|account|click|link|suspended|unusual/i.test(rawEmail.toLowerCase());
          const hasSuspiciousWords = /confirm|security|update|login|access|important/i.test(rawEmail.toLowerCase());
          const containsLink = /http|www|\.com|\.net/i.test(rawEmail.toLowerCase());

          let verdict: 'phishing' | 'suspicious' | 'legitimate';
          let confidence: number;

          if (hasPhishingWords && containsLink) {
            verdict = 'phishing';
            confidence = 85 + Math.random() * 15;
          } else if (hasSuspiciousWords || containsLink) {
            verdict = 'suspicious';
            confidence = 50 + Math.random() * 30;
          } else {
            verdict = 'legitimate';
            confidence = 70 + Math.random() * 25;
          }

          resolve({
            verdict,
            confidence,
            triggeredRules: verdict === 'legitimate' ? [] : [
              {
                id: 'RULE001',
                name: 'Suspicious Link Pattern',
                description: 'Email contains URLs with suspicious patterns or domains',
                severity: verdict === 'phishing' ? 'high' : 'medium',
              },
              {
                id: 'RULE002',
                name: 'Urgent Action Required',
                description: 'Email creates a sense of urgency to trick users into taking immediate action',
                severity: verdict === 'phishing' ? 'high' : 'low',
              },
              {
                id: 'RULE003',
                name: 'Brand Impersonation',
                description: 'Email attempts to impersonate a trusted brand or service',
                severity: verdict === 'phishing' ? 'high' : 'medium',
              },
            ],
            threatIntelligence: verdict === 'legitimate' ? undefined : {
              domain: 'example.com',
              maliciousScore: verdict === 'phishing' ? 85 : 60,
              detections: verdict === 'phishing' ? 16 : 8,
              lastSeen: new Date().toISOString().split('T')[0],
              ipAddresses: ['192.168.1.1', '10.0.0.1'],
            },
          });
        }, 800);
      });
    }
    const url = `${API_BASE_URL}/analyze`;
    console.log(`[API] Analyzing email at: ${url}`);
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Protection': '1',
        'X-CSRF-Token': await getCsrfToken(),
        'Accept': 'application/json',
      },
      body: JSON.stringify({ raw_email: rawEmail }),
    });
    console.log(`[API] Analyze email status: ${response.status}, URL: ${response.url}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to analyze email: ${response.status} ${errorText}`);
    }
    const data = await response.json();
    return {
      verdict: data.verdict,
      confidence: data.confidence,
      triggeredRules: data.triggered_rules,
      threatIntelligence: data.threat_data ? {
        domain: data.threat_data.virustotal?.domain || 'unknown',
        maliciousScore: data.threat_data.virustotal?.malicious_score || 0,
        detections: data.threat_data.virustotal?.detections || 0,
        lastSeen: data.threat_data.virustotal?.last_seen || '',
        ipAddresses: data.threat_data.virustotal?.ip_addresses || [],
      } : undefined,
    };
  } catch (error) {
    return handleApiError(error, 'email analysis');
  }
};

/**
 * Fetches time-series data for email threat trends.
 * @returns A promise resolving to an array of TimeSeriesData objects.
 */
export const fetchThreatTimeSeriesData = async (): Promise<TimeSeriesData[]> => {
  try {
    if (USE_MOCK) {
      console.log('[API] Using mock time series data');
      return new Promise(resolve => setTimeout(() => resolve(mockTimeSeriesData), 800));
    }
    const url = `${API_BASE_URL}/threat-time-series`;
    console.log(`[API] Fetching time series data from: ${url}`);
    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        'X-CSRF-Token': await getCsrfToken(),
        'Accept': 'application/json',
      },
    });
    console.log(`[API] Time series fetch status: ${response.status}, URL: ${response.url}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch threat time series data: ${response.status} ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'fetching threat time series data');
  }
};

/**
 * Fetches common attack patterns and their counts.
 * @returns A promise resolving to an array of AttackPattern objects.
 */
export const fetchAttackPatterns = async (): Promise<AttackPattern[]> => {
  try {
    if (USE_MOCK) {
      console.log('[API] Using mock attack patterns');
      return new Promise(resolve => setTimeout(() => resolve(mockAttackPatterns), 600));
    }
    const url = `${API_BASE_URL}/attack-patterns`;
    console.log(`[API] Fetching attack patterns from: ${url}`);
    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        'X-CSRF-Token': await getCsrfToken(),
        'Accept': 'application/json',
      },
    });
    console.log(`[API] Attack patterns fetch status: ${response.status}, URL: ${response.url}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch attack patterns: ${response.status} ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'fetching attack patterns');
  }
};

/**
 * Fetches domain threat analysis data.
 * @returns A promise resolving to an array of DomainAnalysis objects.
 */
export const fetchDomainAnalysis = async (): Promise<DomainAnalysis[]> => {
  try {
    if (USE_MOCK) {
      console.log('[API] Using mock domain analysis');
      return new Promise(resolve => setTimeout(() => resolve(mockDomainAnalysis), 700));
    }
    const url = `${API_BASE_URL}/domain-analysis`;
    console.log(`[API] Fetching domain analysis from: ${url}`);
    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        'X-CSRF-Token': await getCsrfToken(),
        'Accept': 'application/json',
      },
    });
    console.log(`[API] Domain analysis fetch status: ${response.status}, URL: ${response.url}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch domain analysis: ${response.status} ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'fetching domain analysis');
  }
};

/**
 * Quarantines an email by ID.
 * @param emailId - The ID of the email to quarantine.
 * @returns A promise that resolves when the email is quarantined.
 */
export const quarantineEmail = async (emailId: string): Promise<void> => {
  try {
    if (USE_MOCK) {
      console.log('[API] Using mock quarantine');
      return new Promise(resolve => {
        setTimeout(() => {
          showToast('Email quarantined successfully', 'success');
          resolve();
        }, 500);
      });
    }
    const url = `${API_BASE_URL}/quarantine/${emailId}`;
    console.log(`[API] Quarantining email at: ${url}`);
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-CSRF-Token': await getCsrfToken(),
        'Accept': 'application/json',
      },
    });
    console.log(`[API] Quarantine email status: ${response.status}, URL: ${response.url}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to quarantine email: ${response.status} ${errorText}`);
    }
    showToast('Email quarantined successfully', 'success');
  } catch (error) {
    return handleApiError(error, 'quarantining email');
  }
};