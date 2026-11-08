import React from 'react';
import { ExposureItem, ExposureSeverity } from '@/types/audit';
import { 
  ShieldAlert, 
  ExternalLink, 
  Search, 
  Send, 
  FileText, 
  Key, 
  UserCheck, 
  Globe, 
  Database,
  Calendar,
  Sparkles
} from 'lucide-react';

interface ExposureCardProps {
  item: ExposureItem;
  onOpenTakedown: (item: ExposureItem) => void;
}

export function ExposureCard({ item, onOpenTakedown }: ExposureCardProps) {
  const { title, category, severity, summary, citation, actionableTakedown } = item;

  const getSeverityBadge = (sev: ExposureSeverity) => {
    switch (sev) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            CRITICAL
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-500/15 text-orange-400 border border-orange-500/30">
            HIGH
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            LOW
          </span>
        );
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'code_secret':
        return <Key className="w-4 h-4 text-rose-400" />;
      case 'broker_profile':
        return <Database className="w-4 h-4 text-amber-400" />;
      case 'ghost_account':
        return <UserCheck className="w-4 h-4 text-purple-400" />;
      case 'pii_leak':
        return <FileText className="w-4 h-4 text-orange-400" />;
      default:
        return <Globe className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="group relative rounded-xl border border-gray-800 bg-[#0e1422]/90 hover:border-blue-500/50 hover:bg-[#121929] transition-all duration-300 p-5 flex flex-col justify-between shadow-lg">
      
      {/* Top Bar */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gray-800/80 border border-gray-700/60">
              {getCategoryIcon(category)}
            </div>
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400">
              {category.replace('_', ' ')}
            </span>
          </div>
          {getSeverityBadge(severity)}
        </div>

        {/* Title */}
        <h4 className="text-base font-semibold text-gray-100 group-hover:text-blue-300 transition-colors line-clamp-2">
          {title}
        </h4>

        {/* Summary Description */}
        <p className="mt-2 text-sm text-gray-400 leading-relaxed">
          {summary}
        </p>

        {/* Verifiable Citation Section (SURGE TRACK CRITERION) */}
        <div className="mt-4 p-3 rounded-lg bg-black/40 border border-gray-800/90 text-xs space-y-2">
          <div className="flex items-center justify-between gap-2 border-b border-gray-800/70 pb-2">
            <div className="flex items-center gap-1.5 text-blue-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{citation.searchEngine}</span>
            </div>
            {citation.publishedDate && (
              <div className="flex items-center gap-1 text-gray-500 text-[11px]">
                <Calendar className="w-3 h-3" />
                <span>{citation.publishedDate}</span>
              </div>
            )}
          </div>

          <p className="text-gray-300 italic font-mono text-[11px] leading-relaxed line-clamp-2 bg-gray-900/50 p-2 rounded border border-gray-800">
            &ldquo;{citation.directEvidenceSnippet || citation.snippet}&rdquo;
          </p>

          <div className="flex items-center justify-between pt-1">
            <span className="text-gray-400 text-[11px] truncate max-w-[200px]">
              Domain: <strong className="text-gray-300">{citation.sourceDomain}</strong>
            </span>
            <a
              href={citation.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 hover:underline transition"
            >
              Verify Source Receipt
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-5 pt-4 border-t border-gray-800/80 flex items-center justify-between gap-3">
        <span className="text-xs text-gray-400 truncate">
          Target: <span className="font-mono text-gray-300">{actionableTakedown.targetRecipient}</span>
        </span>
        <button
          onClick={() => onOpenTakedown(item)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
        >
          <Send className="w-3.5 h-3.5" />
          1-Click Takedown
        </button>
      </div>

    </div>
  );
}
