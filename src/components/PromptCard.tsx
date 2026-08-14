import React, { useState } from "react";
import { Copy, Check, Sparkles, Camera, Sun, Image as ImageIcon, RefreshCw, Maximize2, ShieldCheck, Terminal, Edit3 } from "lucide-react";
import { CatalogPrompt } from "../types";

interface PromptCardProps {
  promptData: CatalogPrompt;
  index: number;
  onGeneratePreview: (id: CatalogPrompt["id"], promptText: string) => Promise<void>;
  isGeneratingPreview: boolean;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  promptData,
  index,
  onGeneratePreview,
  isGeneratingPreview,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editablePrompt, setEditablePrompt] = useState(promptData.prompt);
  const [showFullPreview, setShowFullPreview] = useState(false);

  const shotBadges = [
    { label: "Image 1: Hero Studio Shot", color: "bg-blue-100 text-blue-800 border-blue-200" },
    { label: "Image 2: Full-Body Model Shot", color: "bg-rose-100 text-rose-800 border-rose-200" },
    { label: "Image 3: Texture & Macro Close-up", color: "bg-amber-100 text-amber-800 border-amber-200" },
    { label: "Image 4: Curated Lifestyle Flat-Lay", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  ];

  const currentBadge = shotBadges[index] || shotBadges[0];

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyMidjourney = () => {
    const fullText = `${editablePrompt} ${promptData.midjourneyFlags || "--ar 3:4 --v 6.0 --style raw"}`;
    copyToClipboard(fullText, "midjourney");
  };

  const handleCopyFlux = () => {
    copyToClipboard(editablePrompt, "flux");
  };

  const handleTriggerPreview = () => {
    onGeneratePreview(promptData.id, editablePrompt);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-stone-300 transition-all">
      
      {/* Card Header */}
      <div className="p-4 sm:p-5 border-b border-stone-100 bg-stone-50/50">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${currentBadge.color}`}>
            {currentBadge.label}
          </span>
          <span className="text-[11px] font-semibold text-stone-500 bg-white px-2 py-0.5 rounded-md border border-stone-200">
            {promptData.aspectRatioRecommendation || "3:4 E-com"}
          </span>
        </div>
        <h3 className="text-base font-bold text-stone-900 font-serif">
          {promptData.title}
        </h3>
        <p className="text-xs text-stone-600 mt-0.5">
          {promptData.shotType}
        </p>
      </div>

      {/* Card Body: Prompt & Image Preview */}
      <div className="p-4 sm:p-5 space-y-4 flex-1">
        
        {/* Visual Preview / Generation Placeholder */}
        {promptData.previewImageUrl ? (
          <div className="relative group rounded-xl overflow-hidden border border-stone-200 bg-stone-100 max-h-64 flex items-center justify-center">
            <img
              src={promptData.previewImageUrl}
              alt={promptData.title}
              className="w-full h-64 object-contain bg-white"
            />
            <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 backdrop-blur-xs">
              <button
                onClick={() => setShowFullPreview(true)}
                className="px-3 py-1.5 rounded-lg bg-white text-stone-900 text-xs font-bold shadow-md hover:bg-stone-100 flex items-center gap-1.5"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>View Full Size</span>
              </button>
              <button
                onClick={handleTriggerPreview}
                disabled={isGeneratingPreview}
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold shadow-md hover:bg-rose-700 flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingPreview ? "animate-spin" : ""}`} />
                <span>Re-generate</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50/70 p-4 text-center flex flex-col items-center justify-center min-h-[140px]">
            <div className="w-9 h-9 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 mb-2">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-stone-800">
              AI Image Preview Ready
            </p>
            <p className="text-[11px] text-stone-500 max-w-xs mb-3">
              Generate a live visual catalog render from this exact styled prompt
            </p>
            <button
              id={`generate-preview-btn-${promptData.id}`}
              onClick={handleTriggerPreview}
              disabled={isGeneratingPreview}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition flex items-center gap-1.5"
            >
              {isGeneratingPreview ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating 8K Preview...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span>Generate AI Visual Preview</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Prompt Content Box */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-rose-600" />
              <span>Production Prompt</span>
            </label>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-[11px] text-stone-500 hover:text-rose-600 font-medium flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" />
              <span>{isEditing ? "Done" : "Customize"}</span>
            </button>
          </div>

          {isEditing ? (
            <textarea
              value={editablePrompt}
              onChange={(e) => setEditablePrompt(e.target.value)}
              rows={5}
              className="w-full text-xs font-mono p-3 bg-stone-900 text-stone-100 rounded-xl border border-stone-700 focus:ring-1 focus:ring-rose-500 focus:outline-hidden"
            />
          ) : (
            <div className="relative group">
              <div className="text-xs font-mono p-3.5 bg-stone-900 text-stone-100 rounded-xl border border-stone-800 leading-relaxed max-h-44 overflow-y-auto selection:bg-rose-500 selection:text-white">
                {editablePrompt}
              </div>
            </div>
          )}
        </div>

        {/* Photography Setup Specs */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="bg-stone-50 p-2 rounded-lg border border-stone-200">
            <div className="flex items-center gap-1 text-stone-700 font-semibold mb-0.5">
              <Camera className="w-3 h-3 text-stone-500" />
              <span>Lens & Camera</span>
            </div>
            <p className="text-stone-600 text-[10px] leading-tight">
              {promptData.cameraSettings}
            </p>
          </div>

          <div className="bg-stone-50 p-2 rounded-lg border border-stone-200">
            <div className="flex items-center gap-1 text-stone-700 font-semibold mb-0.5">
              <Sun className="w-3 h-3 text-amber-500" />
              <span>Lighting & BG</span>
            </div>
            <p className="text-stone-600 text-[10px] leading-tight">
              {promptData.lightingSetup}
            </p>
          </div>
        </div>

        {/* Platform Compliance Note */}
        {promptData.platformComplianceNotes && (
          <div className="flex items-start gap-1.5 text-[11px] text-emerald-800 bg-emerald-50/80 p-2 rounded-lg border border-emerald-200/80">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-tight font-medium">
              {promptData.platformComplianceNotes}
            </span>
          </div>
        )}

      </div>

      {/* Card Footer: Multi-Format Copy Actions */}
      <div className="p-4 sm:p-5 border-t border-stone-100 bg-stone-50/50 flex flex-wrap gap-2">
        <button
          id={`copy-mj-btn-${promptData.id}`}
          onClick={handleCopyMidjourney}
          className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white shadow-xs transition"
        >
          {copiedType === "midjourney" ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copied for MJ!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-amber-300" />
              <span>Copy Midjourney v6</span>
            </>
          )}
        </button>

        <button
          id={`copy-flux-btn-${promptData.id}`}
          onClick={handleCopyFlux}
          className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 shadow-xs transition"
        >
          {copiedType === "flux" ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-stone-500" />
              <span>Copy Flux / Imagen</span>
            </>
          )}
        </button>
      </div>

      {/* Full Size Image Modal */}
      {showFullPreview && promptData.previewImageUrl && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowFullPreview(false)}
        >
          <div className="max-w-3xl w-full bg-white rounded-2xl p-4 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-stone-900 text-sm">{promptData.title}</h4>
              <button
                onClick={() => setShowFullPreview(false)}
                className="text-stone-400 hover:text-stone-700 text-xs font-bold px-2 py-1"
              >
                ✕ Close
              </button>
            </div>
            <img
              src={promptData.previewImageUrl}
              alt={promptData.title}
              className="w-full max-h-[75vh] object-contain rounded-xl bg-stone-100"
            />
          </div>
        </div>
      )}

    </div>
  );
};
