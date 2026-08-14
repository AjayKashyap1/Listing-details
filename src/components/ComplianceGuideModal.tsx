import React from "react";
import { X, CheckCircle2, AlertCircle, ShieldCheck, Sparkles, BookOpen, Layers } from "lucide-react";

interface ComplianceGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComplianceGuideModal: React.FC<ComplianceGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-stone-200 my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 font-serif">
                Indian Marketplace Catalog Standards
              </h3>
              <p className="text-xs text-stone-500">
                Meesho, Amazon India, Myntra & Ajio Image Compliance Matrix
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Standards Grid */}
        <div className="py-5 space-y-6 max-h-[70vh] overflow-y-auto pr-1">
          
          {/* 4-Shot Catalog Architecture */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-rose-600" />
              The Standard 4-Photo E-commerce Formula
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-lg border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">
                  1. Hero Studio Catalog Shot
                </span>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  Clean #FFFFFF white background. Garment takes 85% of frame. Symmetrical framing with soft natural drop shadow. Zero clutter.
                </p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">
                  2. Full-Body Model Shot
                </span>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  Tailored on an Indian female model. Standing upright pose showing natural drape, stitched silhouette, dupatta styling, and proportions.
                </p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">
                  3. Texture & Macro Close-Up
                </span>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  100mm macro lens focus on fabric weave, zari thread reflection, sequin alignment, and delicate embroidery stitches. Shallow DOF.
                </p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-stone-200">
                <span className="font-bold text-stone-900 block mb-1">
                  4. Curated Lifestyle Flat-Lay
                </span>
                <p className="text-stone-600 text-[11px] leading-relaxed">
                  Styled flat-lay on textured marble/linen with traditional Indian festive props (temple jewellery, fresh mogra petals, brass diya, mojris).
                </p>
              </div>
            </div>
          </div>

          {/* Platform Specific Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-600" />
              Platform Guidelines Matrix
            </h4>

            <div className="border border-stone-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                  <tr>
                    <th className="p-2.5">Platform</th>
                    <th className="p-2.5">Aspect Ratio</th>
                    <th className="p-2.5">Background Rules</th>
                    <th className="p-2.5">Key Requirement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-stone-600">
                  <tr className="bg-white">
                    <td className="p-2.5 font-bold text-stone-900">Meesho</td>
                    <td className="p-2.5">1:1 or 3:4</td>
                    <td className="p-2.5">Pure #FFFFFF White</td>
                    <td className="p-2.5">High contrast, accurate fabric color to minimize return rate</td>
                  </tr>
                  <tr className="bg-stone-50/60">
                    <td className="p-2.5 font-bold text-stone-900">Myntra</td>
                    <td className="p-2.5">3:4 (900x1200)</td>
                    <td className="p-2.5">Seamless Studio Grey/White</td>
                    <td className="p-2.5">Full length model pose, no extreme distortion or heavy filters</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-2.5 font-bold text-stone-900">Amazon India</td>
                    <td className="p-2.5">1:1 (min 1600px)</td>
                    <td className="p-2.5">Pure #FFFFFF (RGB 255,255,255)</td>
                    <td className="p-2.5">Product must occupy 85%+ of frame. No watermarks/borders</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-stone-900 text-white hover:bg-stone-800 transition"
          >
            Got it, Close
          </button>
        </div>

      </div>
    </div>
  );
};
