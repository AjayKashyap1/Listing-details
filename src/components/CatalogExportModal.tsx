import React, { useState } from "react";
import { X, Copy, Check, Download, FileText, Code2, FileSpreadsheet, Sparkles } from "lucide-react";
import { CatalogAnalysisResult } from "../types";

interface CatalogExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: CatalogAnalysisResult;
}

export const CatalogExportModal: React.FC<CatalogExportModalProps> = ({
  isOpen,
  onClose,
  analysis,
}) => {
  const [activeTab, setActiveTab] = useState<"listing_details" | "prompts_only" | "markdown" | "json">("listing_details");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateListingDetailsText = () => {
    const listing = analysis.listingSpecs;
    return `=== COMPLETE PRODUCT LISTING DETAILS ===
PRODUCT TITLE:
${listing?.marketplaceTitle || analysis.productTitle}

SUGGESTED SKU:
${listing?.skuSuggested || "IND-ETHNIC-01"}

FABRICS & CUT SPECIFICATIONS:
- Top Fabric: ${listing?.topFabric || analysis.fabricDetails?.primaryFabric} (Length: ${listing?.topLength || "2.50 Mtr"})
- Bottom Fabric: ${listing?.bottomFabric || "Heavy Santoon Silk"} (Length: ${listing?.bottomLength || "2.50 Mtr"})
- Dupatta Fabric: ${listing?.dupattaFabric || "Organza Tissue Silk"} (Length: ${listing?.dupattaLength || "2.50 Mtr"})
- Inner Lining: ${listing?.innerLining || "Not Included"}

WORK & DESIGN:
- Work Type: ${listing?.workType || analysis.embroideryAndEmbellishments?.types?.join(", ")}
- Pattern: ${listing?.patternPrint || analysis.motifs?.map((m) => m.name).join(", ")}
- Stitch Type: ${listing?.stitchType || "Unstitched Dress Material"}
- Neck & Sleeve: ${listing?.neckStyle || "Round Neck"} | ${listing?.sleeveLength || "Full Sleeves"}

ATTRIBUTES:
- Color Family: ${listing?.colorFamily || analysis.colorPalette?.primaryBase?.name}
- Occasion: ${listing?.occasion || analysis.targetOccasions?.join(", ")}
- Wash Care: ${listing?.washCare || "Dry Clean Only"}
- Package Contents: ${listing?.packageContents || "1 Top, 1 Bottom, 1 Dupatta"}
- Country of Origin: ${listing?.countryOfOrigin || "India"}
- HSN Code: ${listing?.hsnCode || "5407"}
- GST Rate: ${listing?.gstRate || "5%"}
- Suggested Price: ${listing?.priceRangeSuggestion || "Meesho: ₹1,199 | Amazon: ₹2,199"}

AMAZON / MYNTRA 5 BULLET POINTS:
${(listing?.bulletPoints || analysis.ecommerceGuidelines?.bulletPoints || []).map((b, i) => `${i + 1}. ${b}`).join("\n")}

BACKEND SEARCH KEYWORDS:
${(listing?.backendKeywords || analysis.ecommerceGuidelines?.searchKeywords || []).join(", ")}
`;
  };

  const generatePromptsOnlyText = () => {
    return `=== 4-PHOTO E-COMMERCE CATALOG PROMPTS ===
Product: ${analysis.productTitle}
Category: ${analysis.category}
Base Color: ${analysis.colorPalette?.primaryBase?.name} (${analysis.colorPalette?.primaryBase?.hex})

--- IMAGE 1 (HERO STUDIO CATALOG SHOT) ---
${analysis.prompts.heroStudioShot.prompt}
Parameters: ${analysis.prompts.heroStudioShot.midjourneyFlags}

--- IMAGE 2 (FULL-BODY MODEL SHOT) ---
${analysis.prompts.fullBodyModelShot.prompt}
Parameters: ${analysis.prompts.fullBodyModelShot.midjourneyFlags}

--- IMAGE 3 (TEXTURE & EMBROIDERY MACRO CLOSE-UP) ---
${analysis.prompts.textureMacroShot.prompt}
Parameters: ${analysis.prompts.textureMacroShot.midjourneyFlags}

--- IMAGE 4 (CURATED LIFESTYLE / FESTIVE FLAT-LAY) ---
${analysis.prompts.curatedLifestyleShot.prompt}
Parameters: ${analysis.prompts.curatedLifestyleShot.midjourneyFlags}
`;
  };

  const generateMarkdown = () => {
    return `# E-Commerce Listing Catalog: ${analysis.productTitle}

**Category:** ${analysis.category}  
**Recommended Silhouette:** ${analysis.recommendedSilhouette}  
**Primary Color:** ${analysis.colorPalette?.primaryBase?.name} (\`${analysis.colorPalette?.primaryBase?.hex}\`)  
**Fabric:** ${analysis.fabricDetails?.primaryFabric} (${analysis.fabricDetails?.textureAndWeave})  
**Embellishments:** ${analysis.embroideryAndEmbellishments?.types?.join(", ")}  

---

## Product Listing Specifications
- **SKU:** \`${analysis.listingSpecs?.skuSuggested || "IND-ETHNIC-01"}\`
- **Top:** ${analysis.listingSpecs?.topFabric || analysis.fabricDetails?.primaryFabric} (${analysis.listingSpecs?.topLength || "2.5m"})
- **Bottom:** ${analysis.listingSpecs?.bottomFabric || "Heavy Santoon"} (${analysis.listingSpecs?.bottomLength || "2.5m"})
- **Dupatta:** ${analysis.listingSpecs?.dupattaFabric || "Organza"} (${analysis.listingSpecs?.dupattaLength || "2.5m"})
- **HSN Code:** ${analysis.listingSpecs?.hsnCode || "5407"} (GST: ${analysis.listingSpecs?.gstRate || "5%"})

---

## 1. Hero Studio Catalog Shot
- **Framing:** Seamless Pure White #FFFFFF Background, Centered
- **Camera:** ${analysis.prompts.heroStudioShot.cameraSettings}
- **Prompt:**
\`\`\`text
${analysis.prompts.heroStudioShot.prompt}
\`\`\`

## 2. Full-Body Model Shot
- **Model:** Indian Female Model, Standing Front Silhouette
- **Camera:** ${analysis.prompts.fullBodyModelShot.cameraSettings}
- **Prompt:**
\`\`\`text
${analysis.prompts.fullBodyModelShot.prompt}
\`\`\`

## 3. Texture & Embroidery Macro Close-Up
- **Focal Detail:** Weave, zari threadwork, micro textures
- **Camera:** ${analysis.prompts.textureMacroShot.cameraSettings}
- **Prompt:**
\`\`\`text
${analysis.prompts.textureMacroShot.prompt}
\`\`\`

## 4. Curated Lifestyle / Festive Flat-Lay
- **Styling:** Indian ethnic props, temple jewellery, festive backdrop
- **Camera:** ${analysis.prompts.curatedLifestyleShot.cameraSettings}
- **Prompt:**
\`\`\`text
${analysis.prompts.curatedLifestyleShot.prompt}
\`\`\`

---
*Generated by Indian E-Commerce Catalog Stylist & AI Prompt Engineer*
`;
  };

  const getContent = () => {
    if (activeTab === "listing_details") return generateListingDetailsText();
    if (activeTab === "prompts_only") return generatePromptsOnlyText();
    if (activeTab === "markdown") return generateMarkdown();
    return JSON.stringify(analysis, null, 2);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = getContent();
    const ext = activeTab === "json" ? "json" : activeTab === "markdown" ? "md" : "txt";
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `catalog_${activeTab}_${analysis.category.toLowerCase().replace(/\s+/g, "_")}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-stone-200 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-bold text-stone-900 font-serif">
              Export Listing &amp; Catalog Prompts
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 pt-4 pb-3 overflow-x-auto scrollbar-none">
          {[
            { id: "listing_details", label: "Product Listing Specs", icon: FileSpreadsheet },
            { id: "prompts_only", label: "4 Studio Prompts", icon: Sparkles },
            { id: "markdown", label: "Markdown Documentation", icon: FileText },
            { id: "json", label: "Raw JSON", icon: Code2 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-rose-600 text-white shadow-xs"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Box */}
        <div className="flex-1 overflow-hidden my-2">
          <textarea
            readOnly
            value={getContent()}
            className="w-full h-full min-h-[300px] p-3.5 font-mono text-xs bg-stone-900 text-stone-100 rounded-xl border border-stone-800 focus:outline-hidden selection:bg-rose-600 selection:text-white resize-none"
          />
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs text-stone-500">
            Formatted for Meesho, Amazon India, Myntra, Flipkart, Midjourney &amp; Flux.1
          </span>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              id="export-download-file-btn"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
            <button
              id="export-copy-all-btn"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-200" />
                  <span>Copy Content</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
