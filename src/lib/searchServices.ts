import { ReconProfile, ExposureItem, CitationEvidence, ExposureCategory, ExposureSeverity } from '@/types/audit';

interface ExaResult {
  title?: string;
  url: string;
  publishedDate?: string;
  author?: string;
  text?: string;
  highlights?: string[];
  score?: number;
}

interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score?: number;
  published_date?: string;
}

export async function searchWithExa(query: string, apiKey: string): Promise<ExaResult[]> {
  try {
    const res = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        query,
        type: 'neural',
        numResults: 5,
        contents: {
          text: { maxCharacters: 1000 },
          highlights: { numSentences: 2 }
        }
      })
    });

    if (!res.ok) {
      console.warn(`Exa search failed (${res.status}):`, await res.text());
      return [];
    }

    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error('Error fetching from Exa API:', err);
    return [];
  }
}

export async function searchWithTavily(query: string, apiKey: string): Promise<TavilyResult[]> {
  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: 'advanced',
        include_raw_content: false,
        max_results: 5
      })
    });

    if (!res.ok) {
      console.warn(`Tavily search failed (${res.status}):`, await res.text());
      return [];
    }

    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error('Error fetching from Tavily API:', err);
    return [];
  }
}

function parseDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return 'web-source.com';
  }
}

export function synthesizeLiveFindings(
  profile: ReconProfile,
  exaResults: ExaResult[],
  tavilyResults: TavilyResult[]
): ExposureItem[] {
  const items: ExposureItem[] = [];
  const handle = profile.targetHandle.trim();
  const name = profile.targetName?.trim() || handle;

  // Process Exa Results
  exaResults.forEach((res, index) => {
    const domain = parseDomain(res.url);
    const snippet = res.highlights?.[0] || res.text?.slice(0, 220) || 'Public indexed record associated with search term.';
    
    let category: ExposureCategory = 'social_osint';
    let severity: ExposureSeverity = 'medium';

    if (domain.includes('github') || domain.includes('gitlab') || domain.includes('pastebin')) {
      category = 'code_secret';
      severity = 'critical';
    } else if (domain.includes('radaris') || domain.includes('whitepages') || domain.includes('beenverified') || domain.includes('fastpeoplesearch')) {
      category = 'broker_profile';
      severity = 'high';
    } else if (domain.includes('forum') || domain.includes('community') || domain.includes('board')) {
      category = 'ghost_account';
      severity = 'high';
    } else if (res.url.endsWith('.pdf') || domain.includes('drive') || domain.includes('doc')) {
      category = 'pii_leak';
      severity = 'medium';
    }

    const citation: CitationEvidence = {
      sourceUrl: res.url,
      sourceDomain: domain,
      pageTitle: res.title || `Public Web Record on ${domain}`,
      publishedDate: res.publishedDate?.slice(0, 10),
      snippet: snippet,
      directEvidenceSnippet: res.highlights?.[0] || snippet.slice(0, 90),
      searchEngine: 'Exa Neural Search'
    };

    items.push({
      id: `live-exa-${index + 1}`,
      title: `${category.toUpperCase().replace('_', ' ')}: Indexed presence on ${domain}`,
      category,
      severity,
      summary: `Exa neural search uncovered indexed content linked to "${handle}" / "${name}" on ${domain}.`,
      leakDetails: snippet,
      citation,
      actionableTakedown: {
        recommendedAction: `Inspect the live URL and submit an erasure or opt-out notice to ${domain}.`,
        targetRecipient: `privacy@${domain}`,
        takedownEmailSubject: `[GDPR / CCPA Data Removal] Request for ${name} (${handle})`,
        takedownEmailBody: `Dear Data Protection Officer,\n\nI am contacting you to request the permanent deletion and un-indexing of my personal records hosted at:\n${res.url}\n\nUnder applicable data privacy regulations, I request prompt removal.\n\nSincerely,\n${name}`,
        dpoContact: `privacy@${domain}`,
        removalPortalUrl: `https://${domain}`
      }
    });
  });

  // Process Tavily Results
  tavilyResults.forEach((res, index) => {
    const domain = parseDomain(res.url);
    // Avoid exact duplicate URLs
    if (items.some(it => it.citation.sourceUrl === res.url)) return;

    let category: ExposureCategory = 'social_osint';
    let severity: ExposureSeverity = 'medium';

    if (domain.includes('linkedin') || domain.includes('twitter') || domain.includes('x.com')) {
      category = 'social_osint';
      severity = 'low';
    } else if (domain.includes('broker') || domain.includes('lookup') || domain.includes('people')) {
      category = 'broker_profile';
      severity = 'high';
    }

    const citation: CitationEvidence = {
      sourceUrl: res.url,
      sourceDomain: domain,
      pageTitle: res.title || `Deep Extract Record on ${domain}`,
      publishedDate: res.published_date?.slice(0, 10),
      snippet: res.content.slice(0, 220),
      directEvidenceSnippet: res.content.slice(0, 90),
      searchEngine: 'Tavily Deep Extract'
    };

    items.push({
      id: `live-tavily-${index + 1}`,
      title: `VERIFIED RECEIPT: Indexed presence on ${domain}`,
      category,
      severity,
      summary: `Tavily deep extraction detected public footprint for "${handle}" on ${domain}.`,
      leakDetails: res.content.slice(0, 280),
      citation,
      actionableTakedown: {
        recommendedAction: `Review information exposed on ${domain} and configure visibility settings.`,
        targetRecipient: `support@${domain}`,
        takedownEmailSubject: `Inquiry Regarding Indexed Personal Record - ${name}`,
        takedownEmailBody: `Hello,\n\nPlease remove personal identifier references associated with '${handle}' at ${res.url}.\n\nThank you,\n${name}`,
        dpoContact: `privacy@${domain}`
      }
    });
  });

  return items;
}
