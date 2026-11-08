import { NextRequest, NextResponse } from 'next/server';
import { ReconProfile, AuditReport } from '@/types/audit';
import { getMockAuditReport } from '@/lib/mockData';
import { searchWithExa, searchWithTavily, synthesizeLiveFindings } from '@/lib/searchServices';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const profile: ReconProfile = body.profile;
    const forceDemo: boolean = Boolean(body.forceDemo);

    if (!profile || !profile.targetHandle?.trim()) {
      return NextResponse.json({ error: 'Target handle is required' }, { status: 400 });
    }

    const exaKey = process.env.EXA_API_KEY || body.userExaKey;
    const tavilyKey = process.env.TAVILY_API_KEY || body.userTavilyKey;

    // If the user requested mock/demo mode or no API keys exist, return instant high-fidelity audit report
    if (forceDemo || (!exaKey && !tavilyKey)) {
      const mockReport = getMockAuditReport(profile);
      return NextResponse.json({ report: mockReport, mode: 'demo_fallback' });
    }

    const handle = profile.targetHandle.trim();
    const name = profile.targetName?.trim() || handle;

    // Run parallel live queries against Exa and Tavily
    const [exaResults, tavilyResults] = await Promise.all([
      exaKey ? searchWithExa(`personal profile username handle "${handle}" or "${name}"`, exaKey) : Promise.resolve([]),
      tavilyKey ? searchWithTavily(`"${handle}" public profile forum leaks social records`, tavilyKey) : Promise.resolve([])
    ]);

    // If live search returned zero items (e.g. rate limit / network error / fresh handle), fall back gracefully
    if (exaResults.length === 0 && tavilyResults.length === 0) {
      const fallbackReport = getMockAuditReport(profile);
      return NextResponse.json({ 
        report: fallbackReport, 
        mode: 'demo_fallback', 
        note: 'Live search returned no immediate results or rate-limit reached. Displaying simulated OSINT scenario.' 
      });
    }

    const liveItems = synthesizeLiveFindings(profile, exaResults, tavilyResults);

    const criticalCount = liveItems.filter(i => i.severity === 'critical').length;
    const highCount = liveItems.filter(i => i.severity === 'high').length;
    const mediumCount = liveItems.filter(i => i.severity === 'medium').length;
    const lowCount = liveItems.filter(i => i.severity === 'low').length;

    // Calculate dynamic exposure score 0-100
    const rawScore = (criticalCount * 30) + (highCount * 18) + (mediumCount * 10) + (lowCount * 4);
    const exposureScore = Math.min(100, Math.max(15, rawScore));

    let threatLevel: 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'LOW' = 'LOW';
    if (exposureScore >= 75) threatLevel = 'CRITICAL';
    else if (exposureScore >= 50) threatLevel = 'HIGH';
    else if (exposureScore >= 30) threatLevel = 'ELEVATED';

    const liveReport: AuditReport = {
      id: `audit-live-${Date.now()}`,
      timestamp: new Date().toISOString(),
      target: profile,
      exposureScore,
      threatLevel,
      summarySentence: `Discovered ${liveItems.length} verifiable online records linked to "${handle}" across Exa & Tavily neural queries.`,
      totalFindings: liveItems.length,
      criticalCount,
      highCount,
      mediumCount,
      lowCount,
      items: liveItems,
      doxxingRiskVectors: [
        `Public web pages expose profile handles and direct links on ${liveItems.length} distinct domains.`,
        `Neural search matched associated usernames without requiring authenticated credentials.`,
        `Digital footprint can be correlated using open search indices.`
      ],
      remediationRoadmap: [
        {
          phase: 'Immediate Action (0 - 24 Hours)',
          timeframe: 'Immediate',
          steps: [
            'Inspect highest severity findings and verify whether sensitive tokens or personal emails are exposed.',
            'Use the 1-Click Takedown Generator to dispatch GDPR / CCPA opt-out emails.'
          ]
        },
        {
          phase: 'Proactive Privacy Defense',
          timeframe: 'Ongoing',
          steps: [
            'Set up Google Alerts and repeat ShadowTrace scans periodically.',
            'Unlink personal email from secondary public forums.'
          ]
        }
      ],
      auditorCredits: {
        creator: 'Adarsh Panicker',
        project: 'ShadowTrace — Personal Footprint & Doxxing Audit Agent',
        track: 'Surge Track (Exa + Tavily)',
        event: 'Hack1984 Hackathon (Northeastern University)'
      }
    };

    return NextResponse.json({ report: liveReport, mode: 'live' });

  } catch (error) {
    console.error('Audit API handler error:', error);
    return NextResponse.json({ error: 'Failed to execute audit' }, { status: 500 });
  }
}
