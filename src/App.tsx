import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { ImageUploader } from "./components/ImageUploader";
import { AnalysisBreakdown } from "./components/AnalysisBreakdown";
import { ProductListingDetailsCard } from "./components/ProductListingDetailsCard";
import { PromptCard } from "./components/PromptCard";
import { ComplianceGuideModal } from "./components/ComplianceGuideModal";
import { CatalogExportModal } from "./components/CatalogExportModal";
import { ApiSettingsModal } from "./components/ApiSettingsModal";
import {
  CatalogAnalysisResult,
  CatalogPrompt,
  PlatformPreset,
  GeneratorPreset,
  ModelPosePreference,
  JewelleryPreference,
  CustomApiConfig,
} from "./types";
import {
  Sparkles,
  AlertCircle,
  RefreshCw,
  Layers,
  CheckCircle2,
  ChevronRight,
  Wand2,
  RotateCw,
  FileSpreadsheet,
  Key,
} from "lucide-react";

export default function App() {
  const [analysisResult, setAnalysisResult] = useState<CatalogAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>("");

  // Custom API Configuration Management (OpenRouter, AgentRouter, Gemini, Custom)
  const [apiConfig, setApiConfig] = useState<CustomApiConfig>(() => {
    try {
      const stored = localStorage.getItem("custom_api_config_v2");
      if (stored) {
        return JSON.parse(stored);
      }
      // Backward compatibility check
      const oldKey = localStorage.getItem("custom_gemini_api_key");
      if (oldKey) {
        return {
          provider: "gemini",
          apiKey: oldKey,
          baseUrl: "",
          modelName: "gemini-3.7-flash",
        };
      }
    } catch (e) {
      console.warn("Error reading apiConfig from localStorage:", e);
    }
    return {
      provider: "openrouter",
      apiKey: "",
      baseUrl: "https://openrouter.ai/api/v1",
      modelName: "google/gemini-2.5-flash",
    };
  });

  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState(false);

  const [lastRequest, setLastRequest] = useState<{
    imageBase64: string;
    options: {
      platformPreset: PlatformPreset;
      generatorPreset: GeneratorPreset;
      modelPose: ModelPosePreference;
      jewellery: JewelleryPreference;
    };
  } | null>(null);

  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [generatingPreviewId, setGeneratingPreviewId] = useState<CatalogPrompt["id"] | null>(null);

  const handleSaveConfig = (newConfig: CustomApiConfig) => {
    setApiConfig(newConfig);
    try {
      localStorage.setItem("custom_api_config_v2", JSON.stringify(newConfig));
      if (newConfig.apiKey) {
        localStorage.setItem("custom_gemini_api_key", newConfig.apiKey);
      } else {
        localStorage.removeItem("custom_gemini_api_key");
      }
    } catch (e) {
      console.warn("Could not access localStorage:", e);
    }
  };

  const handleAnalyze = async (
    imageBase64: string,
    options: {
      platformPreset: PlatformPreset;
      generatorPreset: GeneratorPreset;
      modelPose: ModelPosePreference;
      jewellery: JewelleryPreference;
    }
  ) => {
    setLastRequest({ imageBase64, options });
    setIsLoading(true);
    setError(null);
    setLoadingStep("Extracting exact Hex colors, fabric weave and motifs...");

    try {
      const timer1 = setTimeout(() => {
        setLoadingStep("Formulating product listing specifications (SKU, fabrics, cuts, HSN)...");
      }, 1500);

      const timer2 = setTimeout(() => {
        setLoadingStep("Synthesizing 4-shot studio prompts for " + options.platformPreset.toUpperCase() + "...");
      }, 3200);

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (apiConfig.apiKey.trim()) {
        headers["x-custom-api-key"] = apiConfig.apiKey.trim();
        headers["x-custom-base-url"] = apiConfig.baseUrl.trim();
        headers["x-custom-model-name"] = apiConfig.modelName.trim();
        headers["x-custom-provider"] = apiConfig.provider;
      }

      const response = await fetch("/api/analyze-catalog", {
        method: "POST",
        headers,
        body: JSON.stringify({
          imageBase64,
          options,
          customApiConfig: apiConfig.apiKey.trim() ? apiConfig : undefined,
        }),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        let message = errData.error || `Analysis failed (status ${response.status})`;
        if (typeof message === "object") {
          message = JSON.stringify(message);
        }
        if (response.status === 503 || message.includes("503") || message.includes("high demand")) {
          message = "The AI service is experiencing high demand. Please click 'Try Again Now' to re-run with our fallback models.";
        }
        throw new Error(message);
      }

      const data: CatalogAnalysisResult = await response.json();
      setAnalysisResult(data);
    } catch (err: any) {
      console.error("Analysis failed:", err);
      let formattedMsg = err.message || "Failed to analyze product photo. Please try again.";
      if (formattedMsg.includes("503") || formattedMsg.includes("high demand") || formattedMsg.includes("UNAVAILABLE")) {
        formattedMsg = "The AI model is experiencing a temporary spike in traffic. Please click 'Try Again Now' to retry.";
      }
      setError(formattedMsg);
    } finally {
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  const handleRetryLast = () => {
    if (lastRequest) {
      handleAnalyze(lastRequest.imageBase64, lastRequest.options);
    }
  };

  const handleGeneratePreview = async (shotId: CatalogPrompt["id"], promptText: string) => {
    if (!analysisResult) return;
    setGeneratingPreviewId(shotId);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (apiConfig.apiKey.trim()) {
        headers["x-custom-api-key"] = apiConfig.apiKey.trim();
        headers["x-custom-base-url"] = apiConfig.baseUrl.trim();
        headers["x-custom-model-name"] = apiConfig.modelName.trim();
        headers["x-custom-provider"] = apiConfig.provider;
      }

      const response = await fetch("/api/generate-preview", {
        method: "POST",
        headers,
        body: JSON.stringify({
          prompt: promptText,
          aspectRatio: "3:4",
          customApiKey: apiConfig.apiKey.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to generate image preview.");
      }

      const data = await response.json();
      if (data.imageUrl) {
        setAnalysisResult((prev) => {
          if (!prev) return prev;
          const updated = { ...prev };
          if (shotId === "shot1_hero") updated.prompts.heroStudioShot.previewImageUrl = data.imageUrl;
          if (shotId === "shot2_model") updated.prompts.fullBodyModelShot.previewImageUrl = data.imageUrl;
          if (shotId === "shot3_macro") updated.prompts.textureMacroShot.previewImageUrl = data.imageUrl;
          if (shotId === "shot4_lifestyle") updated.prompts.curatedLifestyleShot.previewImageUrl = data.imageUrl;
          return updated;
        });
      }
    } catch (err: any) {
      console.warn("Preview generation status:", err);
    } finally {
      setGeneratingPreviewId(null);
    }
  };

  const handleScrollToListing = () => {
    const el = document.getElementById("product-listing-details-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const hasCustomKeyActive = !!apiConfig.apiKey.trim();

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans selection:bg-rose-600 selection:text-white">
      {/* Top Navigation */}
      <Header
        onOpenGuidelines={() => setIsGuidelinesOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenApiSettings={() => setIsApiSettingsOpen(true)}
        onScrollToListing={handleScrollToListing}
        hasResults={!!analysisResult}
        hasCustomKey={hasCustomKeyActive}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Error Notification with Direct 1-Click Retry */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold block text-sm mb-0.5">Notice</span>
                <p className="text-stone-700">{error}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              {lastRequest && (
                <button
                  id="retry-analysis-btn"
                  onClick={handleRetryLast}
                  disabled={isLoading}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                  <span>Try Again Now</span>
                </button>
              )}
              <button
                onClick={() => setError(null)}
                className="text-stone-500 hover:text-stone-800 text-xs px-2 py-1"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Upload & Configure Section */}
        <ImageUploader onAnalyze={handleAnalyze} isLoading={isLoading} />

        {/* Loading Spinner with Progress Steps */}
        {isLoading && (
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8 text-center my-8 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 mb-4 relative">
              <RefreshCw className="w-7 h-7 animate-spin text-rose-600" />
            </div>
            <h3 className="text-base font-bold text-stone-900 font-serif mb-1">
              Indian Catalog Stylist Analyzing Garment
            </h3>
            <p className="text-xs text-rose-700 font-medium animate-pulse mb-4">
              {loadingStep || "Analyzing weave, zari, listing specs and motifs..."}
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-stone-500 bg-stone-50 px-4 py-2 rounded-full border border-stone-200">
              <span>Extracting Colors</span>
              <ChevronRight className="w-3 h-3 text-stone-400" />
              <span>Weave &amp; Motifs</span>
              <ChevronRight className="w-3 h-3 text-stone-400" />
              <span>Listing Specs (SKU, Cuts, HSN)</span>
              <ChevronRight className="w-3 h-3 text-stone-400" />
              <span>4-Shot Prompts</span>
            </div>
          </div>
        )}

        {/* Analysis Results View */}
        {analysisResult && !isLoading && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* 1. Deep Extraction Breakdown */}
            <AnalysisBreakdown analysis={analysisResult} />

            {/* 2. Full Marketplace Product Listing Details */}
            <ProductListingDetailsCard analysis={analysisResult} />

            {/* 3. The 4 E-Commerce Catalog Prompts Header */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-stone-200 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                    <h2 className="text-xl font-bold text-stone-900 font-serif">
                      4-Photo Production Catalog Prompts
                    </h2>
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5">
                    100% design fidelity for Midjourney v6, Flux.1, Imagen 3, and SDXL
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsExportOpen(true)}
                    className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white shadow-xs transition flex items-center gap-1.5"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                    <span>Export Package</span>
                  </button>
                </div>
              </div>

              {/* 4 Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Image 1: Hero Studio Catalog Shot */}
                <PromptCard
                  promptData={analysisResult.prompts.heroStudioShot}
                  index={0}
                  onGeneratePreview={handleGeneratePreview}
                  isGeneratingPreview={generatingPreviewId === "shot1_hero"}
                />

                {/* Image 2: Full-Body Model Shot */}
                <PromptCard
                  promptData={analysisResult.prompts.fullBodyModelShot}
                  index={1}
                  onGeneratePreview={handleGeneratePreview}
                  isGeneratingPreview={generatingPreviewId === "shot2_model"}
                />

                {/* Image 3: Texture & Embroidery Macro Close-up */}
                <PromptCard
                  promptData={analysisResult.prompts.textureMacroShot}
                  index={2}
                  onGeneratePreview={handleGeneratePreview}
                  isGeneratingPreview={generatingPreviewId === "shot3_macro"}
                />

                {/* Image 4: Curated Lifestyle / Festive Flat-Lay */}
                <PromptCard
                  promptData={analysisResult.prompts.curatedLifestyleShot}
                  index={3}
                  onGeneratePreview={handleGeneratePreview}
                  isGeneratingPreview={generatingPreviewId === "shot4_lifestyle"}
                />

              </div>
            </div>

          </div>
        )}

      </main>

      {/* Modals */}
      <ComplianceGuideModal
        isOpen={isGuidelinesOpen}
        onClose={() => setIsGuidelinesOpen(false)}
      />

      <ApiSettingsModal
        isOpen={isApiSettingsOpen}
        onClose={() => setIsApiSettingsOpen(false)}
        apiConfig={apiConfig}
        onSaveConfig={handleSaveConfig}
      />

      {analysisResult && (
        <CatalogExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          analysis={analysisResult}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-stone-500">
          <p className="font-serif font-bold text-stone-800 mb-1">
            Indian E-commerce Catalog Stylist &amp; Listing Generator
          </p>
          <p>
            Engineered for high catalog conversions on Meesho, Amazon India, Myntra, Flipkart &amp; Ajio.
          </p>
        </div>
      </footer>
    </div>
  );
}
