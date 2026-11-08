export type ExposureSeverity = 'critical' | 'high' | 'medium' | 'low' | 'safe';

export type ExposureCategory = 
  | 'credentials' 
  | 'pii_leak' 
  | 'ghost_account' 
  | 'social_osint' 
  | 'code_secret' 
  | 'broker_profile';

export interface CitationEvidence {
  sourceUrl: string;
  sourceDomain: string;
  pageTitle: string;
  publishedDate?: string;
  snippet: string;
  directEvidenceSnippet: string;
  searchEngine: 'Exa Neural Search' | 'Tavily Deep Extract' | 'OSINT Cross-Engine';
}

export interface ExposureItem {
  id: string;
  title: string;
  category: ExposureCategory;
  severity: ExposureSeverity;
  summary: string;
  leakDetails: string;
  citation: CitationEvidence;
  actionableTakedown: {
    recommendedAction: string;
    targetRecipient: string;
    takedownEmailSubject: string;
    takedownEmailBody: string;
    dpoContact?: string;
    removalPortalUrl?: string;
  };
}

export interface ReconProfile {
  targetHandle: string;
  targetName?: string;
  targetEmail?: string;
  targetDomain?: string;
}

export interface AuditReport {
  id: string;
  timestamp: string;
  target: ReconProfile;
  exposureScore: number; // 0 (impenetrable/safe) to 100 (critical risk)
  threatLevel: 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'LOW';
  summarySentence: string;
  totalFindings: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  items: ExposureItem[];
  doxxingRiskVectors: string[];
  remediationRoadmap: {
    phase: string;
    timeframe: string;
    steps: string[];
  }[];
  auditorCredits: {
    creator: string;
    project: string;
    track: string;
    event: string;
  };
}
