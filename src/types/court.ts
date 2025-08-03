export interface CaseQuery {
  id?: string;
  caseType: string;
  caseNumber: string;
  filingYear: string;
  court: string;
  timestamp?: Date;
}

export interface CaseDetails {
  parties: {
    petitioner: string[];
    respondent: string[];
  };
  filingDate?: string;
  nextHearingDate?: string;
  lastOrderDate?: string;
  status?: string;
  caseType: string;
  caseNumber: string;
  filingYear: string;
  court: string;
  orders: OrderDocument[];
  rawData?: any;
}

export interface OrderDocument {
  title: string;
  date: string;
  url?: string;
  type: 'order' | 'judgment' | 'notice';
  isLatest?: boolean;
}

export interface CourtSiteConfig {
  name: string;
  baseUrl: string;
  searchUrl: string;
  caseTypes: string[];
  captchaStrategy: 'manual' | 'bypass' | 'service';
}

export interface ScrapingResult {
  success: boolean;
  data?: CaseDetails;
  error?: string;
  captchaRequired?: boolean;
  captchaImageUrl?: string;
}

export interface CaptchaChallenge {
  imageUrl: string;
  sessionId: string;
  challenge: string;
}