import { AuditReport, ReconProfile, ExposureItem } from '@/types/audit';

export function getMockAuditReport(profile: ReconProfile): AuditReport {
  const handle = profile.targetHandle.trim() || 'target_user';
  const name = profile.targetName?.trim() || handle;
  const email = profile.targetEmail?.trim() || `${handle.toLowerCase().replace(/[^a-z0-9]/g, '')}@gmail.com`;

  const items: ExposureItem[] = [
    {
      id: 'leak-01',
      title: 'Hardcoded Personal API Key & Personal Gmail in Public GitHub Repo',
      category: 'code_secret',
      severity: 'critical',
      summary: `Found commit commit history referencing "${email}" alongside an exposed developer environment file on GitHub.`,
      leakDetails: `Git commit commit msg 'Initial config' contained .env.local with personal secondary email ${email} and Discord webhook credentials.`,
      citation: {
        sourceUrl: `https://github.com/${handle}/dotfiles-legacy`,
        sourceDomain: 'github.com',
        pageTitle: `${handle}/dotfiles-legacy: Developer environment and shell backups`,
        publishedDate: '2023-04-18',
        snippet: `...config USER_EMAIL="${email}" DISCORD_NOTIFY_HOOK="https://discord.com/api/webhooks/..."...`,
        directEvidenceSnippet: `USER_EMAIL="${email}"`,
        searchEngine: 'Exa Neural Search'
      },
      actionableTakedown: {
        recommendedAction: 'Rotate exposed credentials immediately and purge git commit cache via BFG Repo-Cleaner or GitHub Support.',
        targetRecipient: 'GitHub Support / Security Operations',
        takedownEmailSubject: `[Security Takedown Request] Exposed Personal Secret in public repo of ${handle}`,
        takedownEmailBody: `Dear GitHub Security Team,\n\nI am contacting you to request expedited redaction of private identifiable credentials publicly visible at https://github.com/${handle}/dotfiles-legacy.\n\nThe repository contains personal contact credentials (${email}). I have already rotated the active tokens, but request purge of the historical cache.\n\nThank you,\n${name}`,
        dpoContact: 'security@github.com',
        removalPortalUrl: 'https://support.github.com/contact'
      }
    },
    {
      id: 'leak-02',
      title: 'Aggregated Phone & Physical City on People-Search Data Broker',
      category: 'broker_profile',
      severity: 'high',
      summary: `People search aggregator indexing full name "${name}" linked with relative records, historical Boston/Cambridge addresses, and VOIP/mobile numbers.`,
      leakDetails: `Data broker record links username ${handle} with personal phone (+1-617-***-4921) and past addresses compiled from voter registries and domain WHOIS records.`,
      citation: {
        sourceUrl: `https://radaris.com/p/${encodeURIComponent(name.replace(/\s+/g, '-'))}`,
        sourceDomain: 'radaris.com',
        pageTitle: `${name} Public Records, Current Address & Phone Directory`,
        publishedDate: '2024-01-12',
        snippet: `Public records index for ${name}: Current City, Age, Phone Numbers, Associated Online Handles: @${handle}, Known Relatives...`,
        directEvidenceSnippet: `Associated Handles: @${handle} | Verified Resident`,
        searchEngine: 'Tavily Deep Extract'
      },
      actionableTakedown: {
        recommendedAction: 'Submit automated CCPA/GDPR opt-out request to scrub broker record.',
        targetRecipient: 'privacy@radaris.com',
        takedownEmailSubject: `CCPA / GDPR Data Erasure Request - ${name}`,
        takedownEmailBody: `To Data Protection Officer,\n\nI am exercising my statutory rights under CCPA/GDPR to demand the immediate deletion of all personal records, phone numbers, and associated online profiles under the name "${name}" and handle "${handle}" hosted at https://radaris.com/p/${encodeURIComponent(name.replace(/\s+/g, '-'))}.\n\nPlease confirm deletion within 30 days.\n\nSincerely,\n${name}`,
        dpoContact: 'privacy@radaris.com',
        removalPortalUrl: 'https://radaris.com/control/privacy'
      }
    },
    {
      id: 'leak-03',
      title: 'Abandoned Forum Account with Same Username & Leaked MD5 Hash',
      category: 'ghost_account',
      severity: 'high',
      summary: `Historical forum profile on HackForums / vBulletin clone dating back to 2019 using handle "${handle}".`,
      leakDetails: `Indexed profile reveals early gaming/tech interests, historical skype username, and links to an old personal blogspot site.`,
      citation: {
        sourceUrl: `https://community.spigotmc.org/members/${handle}.104928/`,
        sourceDomain: 'spigotmc.org',
        pageTitle: `Profile of member: ${handle} - SpigotMC Community Forums`,
        publishedDate: '2019-11-04',
        snippet: `...Member since 2019. Location: Massachusetts. Bio: Developer and student. Skype: live:${handle}_1...`,
        directEvidenceSnippet: `Member since Nov 2019 - Skype: live:${handle}_1`,
        searchEngine: 'Exa Neural Search'
      },
      actionableTakedown: {
        recommendedAction: 'Log in and permanently close the legacy forum account, or request admin deletion under GDPR right-to-erasure.',
        targetRecipient: 'admin@spigotmc.org',
        takedownEmailSubject: `GDPR Right to Erasure - Account Deletion for user ${handle}`,
        takedownEmailBody: `Hello Administrator,\n\nI am requesting permanent deletion of my legacy user profile '${handle}' (https://community.spigotmc.org/members/${handle}.104928/) and anonymization of historical posts referencing my personal identifiers.\n\nThank you,\n${name}`,
        dpoContact: 'privacy@spigotmc.org'
      }
    },
    {
      id: 'leak-04',
      title: 'Exposed Resume / PDF Slide Deck with Personal Phone on Google Drive',
      category: 'pii_leak',
      severity: 'medium',
      summary: `Publicly accessible Google Slides / PDF indexed from a college hackathon or presentation mentioning ${name}.`,
      leakDetails: `PDF slide #1 contains unredacted phone number (+1 617-***-****) and personal Gmail address intended for recruiters.`,
      citation: {
        sourceUrl: `https://devpost.com/software/${handle}-hackathon-project`,
        sourceDomain: 'devpost.com',
        pageTitle: `Hackathon Project Showcase by ${name} (@${handle})`,
        publishedDate: '2023-10-22',
        snippet: `...Submitted by ${name}. Contact: ${email}. Pitch deck and slide presentation available in public drive folder...`,
        directEvidenceSnippet: `Contact: ${email} | Northeastern ACM Hackathon`,
        searchEngine: 'Tavily Deep Extract'
      },
      actionableTakedown: {
        recommendedAction: 'Edit submission permissions on Devpost/Drive to restrict contact phone numbers and replace with an anonymized email alias.',
        targetRecipient: 'help@devpost.com',
        takedownEmailSubject: `Contact Information Redaction - Devpost Project ${handle}`,
        takedownEmailBody: `Hi Devpost Team,\n\nPlease assist in updating or masking the direct contact information visible on my legacy hackathon submission page (https://devpost.com/software/${handle}-hackathon-project).\n\nBest,\n${name}`,
        dpoContact: 'privacy@devpost.com'
      }
    },
    {
      id: 'leak-05',
      title: 'Public LinkedIn Profile & Educational Chronology Accessible Unauthenticated',
      category: 'social_osint',
      severity: 'low',
      summary: `Public crawler profile reveals educational enrollment, expected graduation date, and employer associations.`,
      leakDetails: `Search engine snippets expose college location, graduation year, and past internship team associations without login wall.`,
      citation: {
        sourceUrl: `https://www.linkedin.com/in/${handle}`,
        sourceDomain: 'linkedin.com',
        pageTitle: `${name} - Computer Science Student | LinkedIn Profile`,
        publishedDate: '2024-09-01',
        snippet: `${name} | Student at Northeastern University | Experienced in Full-Stack, AI, and Systems...`,
        directEvidenceSnippet: `Student at Northeastern University - Boston, MA`,
        searchEngine: 'Exa Neural Search'
      },
      actionableTakedown: {
        recommendedAction: 'Adjust LinkedIn Public Profile Visibility settings to restrict off-network search engine indexation.',
        targetRecipient: 'User Settings Privacy Panel',
        takedownEmailSubject: `LinkedIn Search Visibility Config Guide`,
        takedownEmailBody: `To turn off search engine visibility on LinkedIn:\n1. Go to Settings & Privacy > Visibility.\n2. Click 'Edit your public profile'.\n3. Switch 'Your profile's public visibility' to Off or toggle off specific sections like Education and Current Experience.`,
        removalPortalUrl: 'https://www.linkedin.com/public-profile/settings'
      }
    }
  ];

  return {
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    target: {
      targetHandle: handle,
      targetName: name,
      targetEmail: email,
      targetDomain: profile.targetDomain
    },
    exposureScore: 78,
    threatLevel: 'CRITICAL',
    summarySentence: `Found 5 distinct digital exposure vectors linking handle "@${handle}" to personal contact information, public code repositories, and an indexed data broker profile.`,
    totalFindings: 5,
    criticalCount: 1,
    highCount: 2,
    mediumCount: 1,
    lowCount: 1,
    items,
    doxxingRiskVectors: [
      `Handle reuse across platforms enables correlation from high-security accounts to legacy 2019 forums.`,
      `Phone and partial physical location are indexed on data brokers via public voter and registration aggregations.`,
      `Public code repository history contains personal environment variables and personal secondary email.`
    ],
    remediationRoadmap: [
      {
        phase: 'Immediate (Next 1 Hour)',
        timeframe: 'Immediate',
        steps: [
          'Rotate all API tokens and git credentials found in dotfiles repository.',
          'Send 1-click CCPA removal email to Radaris privacy desk using the generated template below.'
        ]
      },
      {
        phase: 'Within 24 Hours',
        timeframe: 'Day 1',
        steps: [
          'Deactivate or request erasure of the legacy SpigotMC / vBulletin forum handle.',
          'Update Devpost and public project repositories to use an email alias instead of primary personal Gmail.'
        ]
      },
      {
        phase: 'Long-term Hygiene',
        timeframe: 'Weekly Maintenance',
        steps: [
          'Enable Google Alerts or recurring ShadowTrace audits for personal handle.',
          'Toggle LinkedIn off-network search visibility.'
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
}
