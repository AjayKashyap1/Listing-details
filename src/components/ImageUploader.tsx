import React, { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, Sparkles, SlidersHorizontal, Check, RefreshCw, Layers, Zap } from "lucide-react";
import { SAMPLE_PRODUCTS, SampleProduct } from "../data/sampleProducts";
import { PlatformPreset, GeneratorPreset, ModelPosePreference, JewelleryPreference } from "../types";

interface ImageUploaderProps {
  onAnalyze: (imageBase64: string, options: {
    platformPreset: PlatformPreset;
    generatorPreset: GeneratorPreset;
    modelPose: ModelPosePreference;
    jewellery: JewelleryPreference;
  }) => void;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onAnalyze, isLoading }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeSampleId, setActiveSampleId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [platformPreset, setPlatformPreset] = useState<PlatformPreset>("meesho");
  const [generatorPreset, setGeneratorPreset] = useState<GeneratorPreset>("midjourney_v6");
  const [modelPose, setModelPose] = useState<ModelPosePreference>("standing_front");
  const [jewellery, setJewellery] = useState<JewelleryPreference>("temple_gold");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setActiveSampleId(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSelectSample = async (sample: SampleProduct) => {
    setActiveSampleId(sample.id);
    try {
      // Fetch image and convert to base64
      const response = await fetch(sample.thumbnailUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error("Error loading sample image:", err);
    }
  };

  const handleStartAnalysis = () => {
    if (!selectedImage) return;
    onAnalyze(selectedImage, {
      platformPreset,
      generatorPreset,
      modelPose,
      jewellery,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden p-5 md:p-6 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Upload Zone & Image Preview */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-rose-600" />
                Upload Ethnic Wear / Fabric Photo
              </label>
              {selectedImage && (
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setActiveSampleId(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="text-xs text-rose-600 hover:text-rose-800 font-medium"
                >
                  Clear Photo
                </button>
              )}
            </div>
            <p className="text-xs text-stone-500 mb-3">
              Supports unstitched fabrics, dress material, sarees, lehengas, or kurtis (JPG, PNG, WebP)
            </p>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[220px] relative ${
                isDragging
                  ? "border-rose-500 bg-rose-50/50"
                  : selectedImage
                  ? "border-amber-300 bg-stone-50/50"
                  : "border-stone-200 hover:border-rose-400 bg-stone-50/30 hover:bg-rose-50/20"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="fabric-file-input"
              />

              {selectedImage ? (
                <div className="relative group max-w-full">
                  <img
                    src={selectedImage}
                    alt="Uploaded Product"
                    className="max-h-56 w-auto object-contain rounded-lg shadow-sm mx-auto border border-stone-200"
                  />
                  <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center text-white text-xs font-medium backdrop-blur-xs">
                    Click or drop to replace image
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-rose-100/80 flex items-center justify-center text-rose-600 mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-stone-800">
                    Click to upload or drag & drop product photo
                  </span>
                  <span className="text-xs text-stone-500 mt-1">
                    AI will analyze weave, exact hex colors, zari embroidery & border motifs
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Sample Presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                Or try a curated Indian sample fabric:
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAMPLE_PRODUCTS.map((sample) => (
                <button
                  key={sample.id}
                  id={`sample-${sample.id}`}
                  onClick={() => handleSelectSample(sample)}
                  className={`flex flex-col text-left p-2 rounded-xl border transition-all text-xs ${
                    activeSampleId === sample.id
                      ? "border-rose-500 bg-rose-50/80 ring-1 ring-rose-500"
                      : "border-stone-200 hover:border-stone-300 bg-white"
                  }`}
                >
                  <div className="h-16 w-full rounded-lg overflow-hidden relative mb-1.5 bg-stone-100">
                    <img
                      src={sample.thumbnailUrl}
                      alt={sample.name}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border border-white shadow-xs"
                      style={{ backgroundColor: sample.baseColor }}
                      title={`Base Color: ${sample.baseColor}`}
                    />
                  </div>
                  <span className="font-semibold text-stone-900 truncate leading-snug">
                    {sample.name}
                  </span>
                  <span className="text-[10px] text-stone-500 truncate">
                    {sample.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Catalog Styling Parameters & CTA */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full bg-stone-50/80 rounded-xl p-4 sm:p-5 border border-stone-200/80">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-stone-700" />
                <h3 className="text-sm font-bold text-stone-900">
                  Catalog Stylist Configuration
                </h3>
              </div>
              <span className="text-[11px] font-medium text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
                4-Photo Spec
              </span>
            </div>

            {/* Platform Selection */}
            <div className="mb-3.5">
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Target E-commerce Marketplace
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: "meesho", label: "Meesho (High Contrast #FFF)" },
                  { id: "myntra", label: "Myntra (Editorial Studio)" },
                  { id: "amazon_in", label: "Amazon India (85% Zoom)" },
                  { id: "ajio", label: "Ajio / Flipkart (Festive)" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPlatformPreset(item.id as PlatformPreset)}
                    className={`py-1.5 px-2.5 rounded-lg text-xs font-medium text-left border transition-all ${
                      platformPreset === item.id
                        ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                        : "bg-white text-stone-700 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Generator Preset */}
            <div className="mb-3.5">
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                AI Image Generator Prompt Format
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: "midjourney_v6", label: "Midjourney v6 (--ar 3:4)" },
                  { id: "flux_dev", label: "Flux.1 Dev / Pro" },
                  { id: "imagen_3", label: "Google Imagen 3" },
                  { id: "sdxl", label: "SDXL / Photoreal" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setGeneratorPreset(item.id as GeneratorPreset)}
                    className={`py-1.5 px-2.5 rounded-lg text-xs font-medium text-left border transition-all ${
                      generatorPreset === item.id
                        ? "bg-stone-900 text-white border-stone-900 shadow-xs"
                        : "bg-white text-stone-700 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Model & Styling Options */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Model Shot Pose
                </label>
                <select
                  value={modelPose}
                  onChange={(e) => setModelPose(e.target.value as ModelPosePreference)}
                  className="w-full bg-white border border-stone-200 rounded-lg py-1.5 px-2.5 text-xs text-stone-800 font-medium focus:ring-1 focus:ring-rose-500 focus:outline-hidden"
                >
                  <option value="standing_front">Standing Front (Catalog Standard)</option>
                  <option value="three_quarter_twirl">3/4 Twirl (Shows Flare & Fall)</option>
                  <option value="walking_graceful">Graceful Walking Stride</option>
                  <option value="seated_regal">Regal Festive Seated</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Jewellery Pairing
                </label>
                <select
                  value={jewellery}
                  onChange={(e) => setJewellery(e.target.value as JewelleryPreference)}
                  className="w-full bg-white border border-stone-200 rounded-lg py-1.5 px-2.5 text-xs text-stone-800 font-medium focus:ring-1 focus:ring-rose-500 focus:outline-hidden"
                >
                  <option value="temple_gold">Traditional Temple Gold</option>
                  <option value="polki_kundan">Royal Polki & Kundan</option>
                  <option value="oxidised_silver">Antique Oxidised Silver</option>
                  <option value="minimal_pearl">Minimal Pearl Drop</option>
                  <option value="none">Clean / No Jewellery</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-2">
            <button
              id="analyze-catalog-btn"
              onClick={handleStartAnalysis}
              disabled={!selectedImage || isLoading}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                !selectedImage || isLoading
                  ? "bg-stone-300 text-stone-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white shadow-rose-900/20 active:scale-[0.99]"
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Analyzing Weave, Hex Colors & Generating 4 Prompts...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>Generate 4-Photo E-Commerce Prompts</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-stone-500 mt-2">
              Extracts 100% design fidelity: Studio Hero • Model Shot • Macro Close-Up • Festive Flat-Lay
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
