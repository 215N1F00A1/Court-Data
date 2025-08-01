import { CaseQuery, CaseDetails, ScrapingResult, CourtSiteConfig, CaptchaChallenge } from '@/types/court';

// Court configurations
export const SUPPORTED_COURTS: CourtSiteConfig[] = [
  {
    name: "Delhi High Court",
    baseUrl: "https://delhihighcourt.nic.in",
    searchUrl: "https://delhihighcourt.nic.in/case_search.asp",
    caseTypes: [
      "Civil Appeal", "Criminal Appeal", "Civil Writ Petition", 
      "Criminal Writ Petition", "Company Petition", "Arbitration Petition",
      "Tax Appeal", "Service Matter", "Land Acquisition"
    ],
    captchaStrategy: 'manual'
  },
  {
    name: "Faridabad District Court",
    baseUrl: "https://districts.ecourts.gov.in/faridabad",
    searchUrl: "https://districts.ecourts.gov.in/faridabad/case_search",
    caseTypes: [
      "Civil Suit", "Criminal Case", "Matrimonial", "Recovery",
      "Motor Accident Claims", "Labour Dispute", "Revenue"
    ],
    captchaStrategy: 'manual'
  }
];

export class CourtDataService {
  private static instance: CourtDataService;
  private currentCaptcha: CaptchaChallenge | null = null;

  static getInstance(): CourtDataService {
    if (!CourtDataService.instance) {
      CourtDataService.instance = new CourtDataService();
    }
    return CourtDataService.instance;
  }

  async searchCase(query: CaseQuery, captchaSolution?: string): Promise<ScrapingResult> {
    console.log('🔍 Searching case:', query);
    
    try {
      // For demo purposes, we'll simulate the court data fetching
      // In a real implementation, this would use Firecrawl or similar scraping
      await this.delay(2000); // Simulate network request

      // Check if we need CAPTCHA for this query
      if (!captchaSolution && this.requiresCaptcha(query)) {
        const captcha = await this.generateCaptchaChallenge();
        this.currentCaptcha = captcha;
        
        return {
          success: false,
          captchaRequired: true,
          captchaImageUrl: captcha.imageUrl,
          error: "CAPTCHA verification required"
        };
      }

      // Validate CAPTCHA if provided
      if (captchaSolution && this.currentCaptcha) {
        const isValid = await this.validateCaptcha(captchaSolution, this.currentCaptcha);
        if (!isValid) {
          return {
            success: false,
            error: "Invalid CAPTCHA. Please try again.",
            captchaRequired: true,
            captchaImageUrl: this.currentCaptcha.imageUrl
          };
        }
        this.currentCaptcha = null; // Clear after successful validation
      }

      // Simulate scraping the court website
      const mockData = await this.mockCourtDataFetch(query);
      
      return {
        success: true,
        data: mockData
      };

    } catch (error) {
      console.error('❌ Error searching case:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private requiresCaptcha(query: CaseQuery): boolean {
    // For demo, require CAPTCHA for certain case types or randomly
    const captchaRequiredTypes = ['Civil Appeal', 'Criminal Appeal'];
    return captchaRequiredTypes.includes(query.caseType) || Math.random() > 0.7;
  }

  private async generateCaptchaChallenge(): Promise<CaptchaChallenge> {
    // In real implementation, this would call the court's CAPTCHA endpoint
    // For demo, we'll use a placeholder CAPTCHA service or generate one
    return {
      imageUrl: `https://dummyimage.com/200x80/cccccc/000000.png&text=${this.generateRandomCaptcha()}`,
      sessionId: `sess_${Date.now()}`,
      challenge: this.generateRandomCaptcha()
    };
  }

  private generateRandomCaptcha(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private async validateCaptcha(solution: string, challenge: CaptchaChallenge): Promise<boolean> {
    // For demo purposes, accept any 5-character solution
    // In real implementation, this would validate against the actual CAPTCHA
    return solution.length === 5 && /^[A-Z0-9]+$/i.test(solution);
  }

  private async mockCourtDataFetch(query: CaseQuery): Promise<CaseDetails> {
    // Simulate realistic court data
    const caseNumber = `${query.caseNumber}/${query.filingYear}`;
    
    return {
      parties: {
        petitioner: [
          "M/s ABC Corporation Ltd.",
          "Shri Ram Kumar"
        ],
        respondent: [
          "State of Delhi",
          "Union of India",
          "Delhi Development Authority"
        ]
      },
      filingDate: this.generateRandomDate(-365, -30),
      nextHearingDate: this.generateRandomDate(1, 60),
      lastOrderDate: this.generateRandomDate(-30, -1),
      status: "Pending",
      caseType: query.caseType,
      caseNumber: caseNumber,
      filingYear: query.filingYear,
      court: query.court,
      orders: [
        {
          title: "Order dated " + this.generateRandomDate(-15, -1),
          date: this.generateRandomDate(-15, -1),
          url: `#order-${Date.now()}-1`,
          type: 'order',
          isLatest: true
        },
        {
          title: "Notice dated " + this.generateRandomDate(-45, -16),
          date: this.generateRandomDate(-45, -16),
          url: `#notice-${Date.now()}-2`,
          type: 'notice'
        },
        {
          title: "Order dated " + this.generateRandomDate(-90, -46),
          date: this.generateRandomDate(-90, -46),
          url: `#order-${Date.now()}-3`,
          type: 'order'
        }
      ],
      rawData: {
        scraped_at: new Date().toISOString(),
        source_url: `${query.court}/case/${caseNumber}`,
        method: 'mock_scraping'
      }
    };
  }

  private generateRandomDate(minDays: number, maxDays: number): string {
    const today = new Date();
    const randomDays = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
    const targetDate = new Date(today.getTime() + randomDays * 24 * 60 * 60 * 1000);
    return targetDate.toLocaleDateString('en-IN');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async downloadDocument(url: string, filename: string): Promise<void> {
    // In real implementation, this would handle PDF downloads
    console.log(`📄 Downloading document: ${filename} from ${url}`);
    
    // For demo, create a mock download
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO4w6XCoA==`; // Minimal PDF header
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}