import React, { useState } from "react";
import {
  FileSpreadsheet,
  Copy,
  Check,
  Tag,
  ShoppingBag,
  ListOrdered,
  Search,
  Code2,
  Sparkles,
  Info,
  CheckCircle2,
  Download,
  Share2,
  Edit3,
} from "lucide-react";
import { CatalogAnalysisResult, ProductListingSpec } from "../types";

interface ProductListingDetailsCardProps {
  analysis: CatalogAnalysisResult;
}

export const ProductListingDetailsCard: React.FC<ProductListingDetailsCardProps> = ({ analysis }) => {
  const [activeTab, setActiveTab] = useState<"specs" | "bullets" | "keywords" | "description">("specs");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Fallback defaults if listingSpecs is partially present
  const listing: ProductListingSpec = analysis.listingSpecs || {
    skuSuggested: "IND-ETHNIC-" + (analysis.category.replace(/[^a-zA-Z]/g, "").slice(0, 4).toUpperCase() || "SUIT") + "-01",
    marketplaceTitle: analysis.ecommerceGuidelines?.recommendedTitle || analysis.productTitle,
    topFabric: analysis.fabricDetails?.primaryFabric || "Pure Silk Fabric",
    topLength: "2.50 Meters",
    bottomFabric: analysis.accompanyingElements?.find((e) => e.component.toLowerCase().includes("bottom"))?.fabricType || "Santoon Silk Blend",
    bottomLength: "2.50 Meters",
    dupattaFabric: analysis.accompanyingElements?.find((e) => e.component.toLowerCase().includes("dupatta"))?.fabricType || "Organza Tissue Silk",
    dupattaLength: "2.50 Meters",
    innerLining: "Not Included / Santoon bottom can be used as lining",
    workType: analysis.embroideryAndEmbellishments?.types?.join(", ") || "Embroidered Zari Work",
    patternPrint: analysis.motifs?.map((m) => m.name).join(", ") || "Woven Floral Jaal",
    stitchType: "Unstitched Dress Material",
    neckStyle: "Pre-crafted Round Neck with Embroidered Yoke",
    sleeveLength: "Fabric accommodates up to Full Sleeves",
    colorFamily: analysis.colorPalette?.primaryBase?.name || "Festive Pink",
    occasion: analysis.targetOccasions?.join(", ") || "Festive, Wedding, Party Wear",
    washCare: "Dry Clean Only to maintain metallic zari luster and fabric sheen",
    packageContents: "1 Unstitched Kurta Top (2.5m), 1 Bottom Fabric (2.5m), 1 Dupatta (2.5m)",
    countryOfOrigin: "India",
    hsnCode: "5407 (Woven fabrics of synthetic / artificial filament)",
    gstRate: "5% GST",
    priceRangeSuggestion: "Meesho: ₹999 - ₹1,499 | Amazon/Flipkart: ₹1,899 - ₹2,699 | Myntra: ₹2,499 - ₹3,499",
    bulletPoints: analysis.ecommerceGuidelines?.bulletPoints || [
      `Fabric: ${analysis.fabricDetails?.primaryFabric} with premium handfeel`,
      `Work: ${analysis.embroideryAndEmbellishments?.types?.join(", ")}`,
      `Occasion: ${analysis.targetOccasions?.join(", ")}`,
      "Includes matching top, bottom, and dupatta material",
      "Care: Dry Clean Only",
    ],
    backendKeywords: analysis.ecommerceGuidelines?.searchKeywords || [
      "ethnic wear women",
      "unstitched salwar suit",
      "party wear suit material",
      "festive dress material meesho",
      "amazon india suit set",
    ],
    productDescriptionHtml: `<p>Elevate your ethnic wardrobe with this <strong>${analysis.productTitle}</strong>. Features premium <em>${analysis.fabricDetails?.primaryFabric}</em> fabric adorned with authentic <em>${analysis.embroideryAndEmbellishments?.types?.[0] || "zari embroidery"}</em>.</p>`,
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const copyAllListingSpecs = () => {
    const formatted = `=== E-COMMERCE PRODUCT LISTING DETAILS ===
PRODUCT TITLE / NAME:
${listing.marketplaceTitle}

SUGGESTED SKU:
${listing.skuSuggested}

FABRIC & CUT DETAILS:
- Top Fabric: ${listing.topFabric} (Length: ${listing.topLength})
- Bottom Fabric: ${listing.bottomFabric} (Length: ${listing.bottomLength})
- Dupatta Fabric: ${listing.dupattaFabric} (Length: ${listing.dupattaLength})
- Inner / Lining: ${listing.innerLining}

WORK & PATTERN:
- Work Type: ${listing.workType}
- Pattern / Motifs: ${listing.patternPrint}
- Stitch Type: ${listing.stitchType}
- Neck Style: ${listing.neckStyle}
- Sleeve: ${listing.sleeveLength}

ATTRIBUTES:
- Color Family: ${listing.colorFamily}
- Occasion: ${listing.occasion}
- Wash Care: ${listing.washCare}
- Package Contents: ${listing.packageContents}
- Country of Origin: ${listing.countryOfOrigin}
- HSN Code: ${listing.hsnCode}
- GST Rate: ${listing.gstRate}
- Suggested Price: ${listing.priceRangeSuggestion}

AMAZON / MYNTRA BULLET POINTS:
${listing.bulletPoints.map((b, i) => `${i + 1}. ${b}`).join("\n")}

BACKEND SEARCH KEYWORDS:
${listing.backendKeywords.join(", ")}
`;
    copyText(formatted, "all_specs");
  };

  const downloadListingJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(listing, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${listing.skuSuggested || "product"}-listing-details.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const specRows = [
    { label: "Suggested SKU Code", value: listing.skuSuggested, key: "sku" },
    { label: "Marketplace Title", value: listing.marketplaceTitle, key: "title" },
    { label: "Top / Kurta Fabric & Cut", value: `${listing.topFabric} • ${listing.topLength}`, key: "top" },
    { label: "Bottom Fabric & Cut", value: `${listing.bottomFabric} • ${listing.bottomLength}`, key: "bottom" },
    { label: "Dupatta Fabric & Cut", value: `${listing.dupattaFabric} • ${listing.dupattaLength}`, key: "dupatta" },
    { label: "Inner / Lining Fabric", value: listing.innerLining, key: "lining" },
    { label: "Work / Weave Type", value: listing.workType, key: "work" },
    { label: "Pattern / Motif Design", value: listing.patternPrint, key: "pattern" },
    { label: "Stitch Type", value: listing.stitchType, key: "stitch" },
    { label: "Neck Style & Sleeve", value: `${listing.neckStyle} | ${listing.sleeveLength}`, key: "neck" },
    { label: "Color Family & Shade", value: listing.colorFamily, key: "color" },
    { label: "Occasion", value: listing.occasion, key: "occasion" },
    { label: "Wash Care", value: listing.washCare, key: "care" },
    { label: "Package Contents", value: listing.packageContents, key: "package" },
    { label: "Country of Origin", value: listing.countryOfOrigin, key: "origin" },
    { label: "HSN Code & GST Rate", value: `${listing.hsnCode} | GST: ${listing.gstRate}`, key: "hsn" },
    { label: "Suggested Selling Price", value: listing.priceRangeSuggestion, key: "price" },
  ];

  return (
    <div id="product-listing-details-section" className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden mb-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Listing Ready
            </span>
            <span className="text-xs text-stone-300">
              Meesho • Amazon India • Flipkart • Myntra
            </span>
          </div>
          <h2 className="text-xl font-bold font-serif tracking-tight text-stone-50">
            Product Listing Details &amp; Specifications
          </h2>
          <p className="text-xs text-stone-300 mt-1 max-w-2xl">
            Complete, ready-to-copy fields required when listing this product on Indian seller portals (SKU, fabrics, cuts, HSN, GST, bullets &amp; keywords).
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={copyAllListingSpecs}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-md shadow-rose-950/20 transition"
          >
            {copiedKey === "all_specs" ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Copied All Specs!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy All Listing Details</span>
              </>
            )}
          </button>

          <button
            onClick={downloadListingJSON}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-700 hover:bg-stone-600 text-stone-100 border border-stone-600 transition"
            title="Download Listing Data as JSON"
          >
            <Download className="w-3.5 h-3.5 text-stone-300" />
            <span>Download JSON</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200 bg-stone-50 px-4 sm:px-6 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("specs")}
          className={`py-3.5 px-3 border-b-2 text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "specs"
              ? "border-rose-600 text-rose-700"
              : "border-transparent text-stone-600 hover:text-stone-900"
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Product Specifications Table ({specRows.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("bullets")}
          className={`py-3.5 px-3 border-b-2 text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "bullets"
              ? "border-rose-600 text-rose-700"
              : "border-transparent text-stone-600 hover:text-stone-900"
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5" />
          <span>Amazon / Myntra Bullet Points ({listing.bulletPoints?.length || 5})</span>
        </button>

        <button
          onClick={() => setActiveTab("keywords")}
          className={`py-3.5 px-3 border-b-2 text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "keywords"
              ? "border-rose-600 text-rose-700"
              : "border-transparent text-stone-600 hover:text-stone-900"
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Backend Search Keywords ({listing.backendKeywords?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("description")}
          className={`py-3.5 px-3 border-b-2 text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === "description"
              ? "border-rose-600 text-rose-700"
              : "border-transparent text-stone-600 hover:text-stone-900"
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>HTML Description</span>
        </button>
      </div>

      {/* Tab 1: Product Specifications Table */}
      {activeTab === "specs" && (
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Exact Listing Attributes (Click copy button next to any field)
            </span>
            <span className="text-xs text-stone-500">
              Preset for: <strong className="text-stone-800">Unstitched Salwar Suit / Ethnic Dress Material</strong>
            </span>
          </div>

          <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden shadow-2xs">
            {specRows.map((row, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:py-3 sm:px-4 hover:bg-stone-50/80 transition group gap-2"
              >
                <div className="sm:w-1/3 text-xs font-bold text-stone-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500/70 shrink-0" />
                  <span>{row.label}</span>
                </div>

                <div className="sm:w-3/5 text-xs text-stone-900 font-medium break-words leading-relaxed select-all">
                  {row.value || "—"}
                </div>

                <div className="sm:w-1/12 flex justify-end shrink-0">
                  <button
                    onClick={() => copyText(row.value, row.key)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-200/80 transition"
                    title={`Copy ${row.label}`}
                  >
                    {copiedKey === row.key ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Amazon / Myntra 5 Bullet Points */}
      {activeTab === "bullets" && (
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                Amazon India &amp; Myntra Listing Bullet Points
              </h3>
              <p className="text-xs text-stone-500">
                SEO-optimized, high-converting feature highlights ready to paste into listing backend.
              </p>
            </div>

            <button
              onClick={() => copyText(listing.bulletPoints.map((b, i) => `${i + 1}. ${b}`).join("\n"), "all_bullets")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition self-start sm:self-auto"
            >
              {copiedKey === "all_bullets" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied All Bullets!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy All 5 Bullets</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-3">
            {listing.bulletPoints.map((bullet, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between bg-stone-50 p-3.5 rounded-xl border border-stone-200 gap-3 group hover:border-stone-300 transition"
              >
                <div className="flex items-start gap-2.5 flex-1">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-stone-800 leading-relaxed font-medium select-all">
                    {bullet}
                  </p>
                </div>

                <button
                  onClick={() => copyText(bullet, `bullet_${idx}`)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-white transition shrink-0"
                  title="Copy this bullet point"
                >
                  {copiedKey === `bullet_${idx}` ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Backend Search Keywords */}
      {activeTab === "keywords" && (
        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                High-Volume Marketplace Search Keywords
              </h3>
              <p className="text-xs text-stone-500">
                Paste directly into Meesho search tags or Amazon Generic Keywords backend tab.
              </p>
            </div>

            <button
              onClick={() => copyText(listing.backendKeywords.join(", "), "all_keywords")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition self-start sm:self-auto"
            >
              {copiedKey === "all_keywords" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied (Comma-Separated)!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy All (Comma-Separated)</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {listing.backendKeywords.map((kw, idx) => (
              <button
                key={idx}
                onClick={() => copyText(kw, `kw_${idx}`)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-100 hover:bg-rose-50 text-stone-800 hover:text-rose-800 border border-stone-200 hover:border-rose-200 transition group"
                title="Click to copy keyword"
              >
                <span>{kw}</span>
                {copiedKey === `kw_${idx}` ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3 text-stone-400 group-hover:text-rose-600 opacity-60" />
                )}
              </button>
            ))}
          </div>

          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
            <span className="text-[11px] font-bold text-stone-600 block mb-1">
              Raw Comma-Separated String:
            </span>
            <p className="text-xs text-stone-700 font-mono select-all break-words">
              {listing.backendKeywords.join(", ")}
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: HTML Description */}
      {activeTab === "description" && (
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                HTML Formatted Description
              </h3>
              <p className="text-xs text-stone-500">
                Formatted HTML code ready for portals that support rich text or HTML descriptions.
              </p>
            </div>

            <button
              onClick={() => copyText(listing.productDescriptionHtml, "html_desc")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition"
            >
              {copiedKey === "html_desc" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied HTML!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy HTML Code</span>
                </>
              )}
            </button>
          </div>

          <pre className="bg-stone-900 text-stone-100 p-4 rounded-xl text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {listing.productDescriptionHtml}
          </pre>
        </div>
      )}
    </div>
  );
};
