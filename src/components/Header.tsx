import React from "react";
import { Sparkles, ShieldCheck, FileText, Key, FileSpreadsheet, Zap } from "lucide-react";

interface HeaderProps {
  onOpenGuidelines: () => void;
  onOpenExport?: () => void;
  onOpenApiSettings: () => void;
  onScrollToListing?: () => void;
  hasResults: boolean;
  hasCustomKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGuidelines,
  onOpenExport,
  onOpenApiSettings,
  onScrollToListing,
  hasResults,
  hasCustomKey,
}) => {
  return (
    <header className="border-b border-amber-900/10 bg-gradient-to-r from-amber-50/90 via-rose-50/60 to-orange-50/90 backdrop-blur sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-900/10 shrink-0">
            <Sparkles className="w-5 h-5 text-amber-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-stone-900 font-serif">
                Indian Catalog Stylist &amp; Listing Generator
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                100% Design Fidelity
              </span>
            </div>
            <p className="text-xs text-stone-600">
              4-Photo Studio Prompts &amp; Full Product Listing Details for Meesho • Amazon India • Myntra • Flipkart
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
          {/* Custom API Key Button */}
          <button
            id="api-settings-btn"
            onClick={onOpenApiSettings}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border shadow-2xs transition ${
              hasCustomKey
                ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                : "bg-white/80 text-stone-700 border-stone-200 hover:bg-white hover:text-stone-900"
            }`}
            title="Configure Custom Gemini API Key"
          >
            <Key className={`w-3.5 h-3.5 ${hasCustomKey ? "text-emerald-600" : "text-amber-600"}`} />
            <span>{hasCustomKey ? "Custom API (Active)" : "Custom API"}</span>
          </button>

          {/* Platform Specs */}
          <button
            id="view-guidelines-btn"
            onClick={onOpenGuidelines}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-700 bg-white/80 hover:bg-white border border-stone-200 shadow-2xs transition hover:text-rose-700"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden md:inline">Platform Specs</span>
            <span className="md:hidden">Specs</span>
          </button>

          {/* Quick jump to Listing Details */}
          {hasResults && onScrollToListing && (
            <button
              onClick={onScrollToListing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-800 bg-amber-100/80 hover:bg-amber-200/80 border border-amber-300 shadow-2xs transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-700" />
              <span>Listing Details</span>
            </button>
          )}

          {/* Export Catalog Prompts & Details */}
          {hasResults && onOpenExport && (
            <button
              id="export-catalog-btn"
              onClick={onOpenExport}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 shadow-sm transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export Prompts</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
