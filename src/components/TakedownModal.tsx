'use client';

import React, { useState } from 'react';
import { ExposureItem } from '@/types/audit';
import { X, Copy, Check, Mail, ExternalLink, ShieldCheck, AlertTriangle } from 'lucide-react';

interface TakedownModalProps {
  item: ExposureItem | null;
  onClose: () => void;
}

export function TakedownModal({ item, onClose }: TakedownModalProps) {
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);

  if (!item) return null;

  const { actionableTakedown, citation } = item;

  const handleCopySubject = () => {
    navigator.clipboard.writeText(actionableTakedown.takedownEmailSubject);
    setCopiedSubject(true);
    setTimeout(() => setCopiedSubject(false), 2000);
  };

  const handleCopyBody = () => {
    navigator.clipboard.writeText(actionableTakedown.takedownEmailBody);
    setCopiedBody(true);
    setTimeout(() => setCopiedBody(false), 2000);
  };

  const handleOpenMailClient = () => {
    const mailto = `mailto:${encodeURIComponent(actionableTakedown.targetRecipient)}?subject=${encodeURIComponent(
      actionableTakedown.takedownEmailSubject
    )}&body=${encodeURIComponent(actionableTakedown.takedownEmailBody)}`;
    window.location.href = mailto;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0d131f] border border-blue-900/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#121929]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">1-Click Legal Takedown Generator</h3>
              <p className="text-xs text-gray-400">GDPR Art. 17 / CCPA Right to Erasure Request</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          
          {/* Target Finding */}
          <div className="bg-[#151c2e] p-3.5 rounded-xl border border-gray-800 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-200">{item.title}</p>
              <p className="text-xs text-gray-400 mt-1">Exposed at: <span className="text-blue-400 font-mono">{citation.sourceDomain}</span></p>
            </div>
          </div>

          {/* Destination */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Target Recipient / DPO</label>
            <div className="flex items-center justify-between bg-black/40 px-3.5 py-2.5 rounded-lg border border-gray-800 font-mono text-gray-300">
              <span>{actionableTakedown.targetRecipient}</span>
              {actionableTakedown.removalPortalUrl && (
                <a
                  href={actionableTakedown.removalPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-sans"
                >
                  Opt-out Portal <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Subject Line */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Subject</label>
              <button
                onClick={handleCopySubject}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
              >
                {copiedSubject ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSubject ? 'Copied' : 'Copy Subject'}
              </button>
            </div>
            <div className="bg-black/40 px-3.5 py-2.5 rounded-lg border border-gray-800 font-mono text-gray-300">
              {actionableTakedown.takedownEmailSubject}
            </div>
          </div>

          {/* Body */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Legal Request Letter Body</label>
              <button
                onClick={handleCopyBody}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
              >
                {copiedBody ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedBody ? 'Copied Body' : 'Copy Message'}
              </button>
            </div>
            <textarea
              readOnly
              rows={8}
              value={actionableTakedown.takedownEmailBody}
              className="w-full bg-black/40 p-3 rounded-lg border border-gray-800 font-mono text-xs text-gray-300 resize-none focus:outline-none"
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#121929] border-t border-gray-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition"
          >
            Close
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyBody}
              className="px-4 py-2 text-sm rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-200 flex items-center gap-2 transition"
            >
              <Copy className="w-4 h-4" />
              Copy Letter
            </button>
            <button
              onClick={handleOpenMailClient}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-2 shadow-lg shadow-blue-600/30 transition"
            >
              <Mail className="w-4 h-4" />
              Open in Mail Client
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
