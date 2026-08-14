import React, { useState } from "react";
import { Copy, Check, Palette, Sparkles, Feather, Layers, Award, Tag, Info, ArrowUpRight } from "lucide-react";
import { CatalogAnalysisResult } from "../types";

interface AnalysisBreakdownProps {
  analysis: CatalogAnalysisResult;
}

export const AnalysisBreakdown: React.FC<AnalysisBreakdownProps> = ({ analysis }) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedTitle, setCopiedTitle] = useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    if (id.startsWith("#")) {
      setCopiedHex(id);
      setTimeout(() => setCopiedHex(null), 2000);
    } else if (id === "title") {
      setCopiedTitle(true);
      setTimeout(() => setCopiedTitle(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 md:p-6 mb-8">
      {/* Top Banner: Product Identity & Score */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-stone-200 gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
              {analysis.category}
            </span>
            <span className="text-xs text-stone-500 font-medium">
              Silhouette: {analysis.recommendedSilhouette}
            </span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 font-serif">
            {analysis.productTitle}
          </h2>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {analysis.targetOccasions?.map((occasion, i) => (
              <span
                key={i}
                className="text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200/80 px-2 py-0.5 rounded-md"
              >
                ✦ {occasion}
              </span>
            ))}
          </div>
        </div>

        {/* E-commerce Marketplace Readiness Scores */}
        <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200/80">
          <div className="text-center px-2">
            <div className="text-base font-extrabold text-pink-600">
              {analysis.ecommerceGuidelines?.meeshoScore || 98}%
            </div>
            <div className="text-[10px] uppercase font-bold text-stone-500">Meesho</div>
          </div>
          <div className="w-px h-7 bg-stone-300" />
          <div className="text-center px-2">
            <div className="text-base font-extrabold text-amber-600">
              {analysis.ecommerceGuidelines?.amazonScore || 96}%
            </div>
            <div className="text-[10px] uppercase font-bold text-stone-500">Amazon IN</div>
          </div>
          <div className="w-px h-7 bg-stone-300" />
          <div className="text-center px-2">
            <div className="text-base font-extrabold text-rose-600">
              {analysis.ecommerceGuidelines?.myntraScore || 99}%
            </div>
            <div className="text-[10px] uppercase font-bold text-stone-500">Myntra</div>
          </div>
        </div>
      </div>

      {/* Grid: 4 Essential Stylist Extraction Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        
        {/* 1. Color Palette */}
        <div className="bg-stone-50/70 rounded-xl p-4 border border-stone-200">
          <div className="flex items-center gap-2 mb-3 text-stone-900 font-semibold text-xs uppercase tracking-wider">
            <Palette className="w-4 h-4 text-rose-600" />
            <span>Exact Color Palette</span>
          </div>

          <div className="space-y-2.5">
            {/* Primary Base */}
            {analysis.colorPalette?.primaryBase && (
              <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-stone-200 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-md border border-stone-300 shadow-inner flex-shrink-0"
                    style={{ backgroundColor: analysis.colorPalette.primaryBase.hex }}
                  />
                  <div>
                    <div className="text-xs font-bold text-stone-800 leading-tight">
                      {analysis.colorPalette.primaryBase.name}
                    </div>
                    <div className="text-[10px] text-stone-500">
                      Primary Base ({analysis.colorPalette.primaryBase.hex})
                    </div>
                  </div>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(
                      analysis.colorPalette.primaryBase.hex,
                      analysis.colorPalette.primaryBase.hex
                    )
                  }
                  className="text-stone-400 hover:text-stone-700 p-1"
                  title="Copy Hex Code"
                >
                  {copiedHex === analysis.colorPalette.primaryBase.hex ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}

            {/* Secondary Colors */}
            {analysis.colorPalette?.secondaryColors?.map((sec, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-white p-2 rounded-lg border border-stone-200 shadow-2xs"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-6 h-6 rounded-md border border-stone-300 shadow-inner flex-shrink-0"
                    style={{ backgroundColor: sec.hex }}
                  />
                  <div>
                    <div className="text-xs font-semibold text-stone-800 leading-tight">
                      {sec.name}
                    </div>
                    <div className="text-[10px] text-stone-500 truncate max-w-[120px]">
                      {sec.type || "Accent"} ({sec.hex})
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(sec.hex, sec.hex)}
                  className="text-stone-400 hover:text-stone-700 p-1"
                  title="Copy Hex Code"
                >
                  {copiedHex === sec.hex ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}

            {/* Zari / Metallic */}
            {analysis.colorPalette?.zariMetallic && (
              <div className="flex items-center justify-between bg-amber-50/60 p-2 rounded-lg border border-amber-200 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-6 h-6 rounded-md border border-amber-400 shadow-inner flex-shrink-0"
                    style={{ backgroundColor: analysis.colorPalette.zariMetallic.hex }}
                  />
                  <div>
                    <div className="text-xs font-bold text-amber-900 leading-tight">
                      {analysis.colorPalette.zariMetallic.name}
                    </div>
                    <div className="text-[10px] text-amber-700">
                      Metallic Zari ({analysis.colorPalette.zariMetallic.hex})
                    </div>
                  </div>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(
                      analysis.colorPalette.zariMetallic!.hex,
                      analysis.colorPalette.zariMetallic!.hex
                    )
                  }
                  className="text-amber-700 hover:text-amber-900 p-1"
                  title="Copy Hex Code"
                >
                  {copiedHex === analysis.colorPalette.zariMetallic.hex ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 2. Fabric & Drape Dynamics */}
        <div className="bg-stone-50/70 rounded-xl p-4 border border-stone-200">
          <div className="flex items-center gap-2 mb-3 text-stone-900 font-semibold text-xs uppercase tracking-wider">
            <Feather className="w-4 h-4 text-amber-600" />
            <span>Fabric & Texture Finish</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="bg-white p-2.5 rounded-lg border border-stone-200">
              <span className="font-bold text-stone-900 block text-xs mb-0.5">
                {analysis.fabricDetails?.primaryFabric}
              </span>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                {analysis.fabricDetails?.finishAndSheen}
              </p>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-stone-200">
              <span className="font-semibold text-stone-700 block text-[11px] mb-0.5">
                Weave & Surface Texture:
              </span>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                {analysis.fabricDetails?.textureAndWeave}
              </p>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-stone-200">
              <span className="font-semibold text-stone-700 block text-[11px] mb-0.5">
                Drape & Silhouette Behavior:
              </span>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                {analysis.fabricDetails?.fallAndDrape}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Embroidery & Surface Work */}
        <div className="bg-stone-50/70 rounded-xl p-4 border border-stone-200">
          <div className="flex items-center gap-2 mb-3 text-stone-900 font-semibold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-rose-600" />
            <span>Embroidery & Motifs</span>
          </div>

          <div className="space-y-2">
            <div className="bg-white p-2.5 rounded-lg border border-stone-200">
              <span className="font-semibold text-stone-700 block text-[11px] mb-1">
                Detected Techniques:
              </span>
              <div className="flex flex-wrap gap-1">
                {analysis.embroideryAndEmbellishments?.types?.map((item, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-stone-200">
              <span className="font-semibold text-stone-700 block text-[11px] mb-1">
                Detected Motifs:
              </span>
              <div className="space-y-1.5">
                {analysis.motifs?.map((motif, i) => (
                  <div key={i} className="text-[11px] border-b border-stone-100 pb-1 last:border-0 last:pb-0">
                    <span className="font-bold text-stone-800">{motif.name}</span>
                    <span className="text-stone-500 block text-[10px]">
                      {motif.placement} • {motif.technique}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Accompanying Pieces & Borders */}
        <div className="bg-stone-50/70 rounded-xl p-4 border border-stone-200">
          <div className="flex items-center gap-2 mb-3 text-stone-900 font-semibold text-xs uppercase tracking-wider">
            <Layers className="w-4 h-4 text-amber-700" />
            <span>Accompanying Elements</span>
          </div>

          <div className="space-y-2 text-xs">
            {analysis.accompanyingElements?.map((elem, i) => (
              <div key={i} className="bg-white p-2.5 rounded-lg border border-stone-200">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold text-stone-900">{elem.component}</span>
                  <span className="text-[10px] font-medium text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                    {elem.fabricType}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 leading-snug">
                  {elem.details}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* E-commerce Listing Optimization Bar */}
      {analysis.ecommerceGuidelines && (
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-rose-950 text-white rounded-xl p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-400" />
                <span className="text-xs uppercase font-bold text-amber-300 tracking-wider">
                  Recommended Marketplace Listing Title
                </span>
              </div>
              <p className="text-sm font-semibold text-stone-100 font-serif">
                {analysis.ecommerceGuidelines.recommendedTitle}
              </p>
            </div>

            <button
              id="copy-recommended-title-btn"
              onClick={() =>
                copyToClipboard(
                  analysis.ecommerceGuidelines.recommendedTitle,
                  "title"
                )
              }
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition self-start lg:self-auto shrink-0"
            >
              {copiedTitle ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied Title!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-300" />
                  <span>Copy Title</span>
                </>
              )}
            </button>
          </div>

          {/* Search Keywords */}
          {analysis.ecommerceGuidelines.searchKeywords && (
            <div className="mt-3 pt-3 border-t border-stone-700/80 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-stone-400 font-medium mr-1">
                High-converting Search Tags:
              </span>
              {analysis.ecommerceGuidelines.searchKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 text-[10px] border border-stone-700"
                >
                  #{kw}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
