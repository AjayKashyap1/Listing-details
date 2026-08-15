import React, { useState, useEffect } from "react";
import {
  Key,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ExternalLink,
  X,
  RotateCw,
  Trash2,
  Zap,
  Globe,
  Cpu,
  Layers,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { ApiProviderType, CustomApiConfig } from "../types";

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiConfig: CustomApiConfig;
  onSaveConfig: (config: CustomApiConfig) => void;
}

const PROVIDER_PRESETS: Record<
  ApiProviderType,
  {
    name: string;
    description: string;
    defaultBaseUrl: string;
    defaultModel: string;
    keyPlaceholder: string;
    keyHelpUrl?: string;
    keyHelpLabel?: string;
    popularModels: { id: string; label: string; tag?: string }[];
  }
> = {
  openrouter: {
    name: "OpenRouter",
    description: "Multi-model gateway supporting Gemini, Claude, Llama, DeepSeek & OpenAI with 1 API key.",
    defaultBaseUrl: "https://openrouter.ai/api/v1",
    defaultModel: "google/gemini-2.5-flash",
    keyPlaceholder: "sk-or-v1-...",
    keyHelpUrl: "https://openrouter.ai/keys",
    keyHelpLabel: "Get OpenRouter API Key",
    popularModels: [
      { id: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash", tag: "Fast & Cheap" },
      { id: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro", tag: "High Quality" },
      { id: "anthropic/claude-3.5-sonnet", label: "Claude 3.5 Sonnet", tag: "Elite Vision" },
      { id: "meta-llama/llama-3.3-70b-instruct", label: "Llama 3.3 70B", tag: "Open Source" },
      { id: "openai/gpt-4o-mini", label: "GPT-4o Mini", tag: "Fast" },
      { id: "deepseek/deepseek-chat", label: "DeepSeek V3", tag: "Budget" },
    ],
  },
  agentrouter: {
    name: "AgentRouter",
    description: "AgentRouter API gateway for routing AI requests with custom base URL and models.",
    defaultBaseUrl: "https://api.agentrouter.com/v1",
    defaultModel: "gpt-4o-mini",
    keyPlaceholder: "sk-...",
    keyHelpUrl: "https://agentrouter.com",
    keyHelpLabel: "AgentRouter Dashboard",
    popularModels: [
      { id: "gpt-4o-mini", label: "GPT-4o Mini", tag: "Recommended" },
      { id: "gpt-4o", label: "GPT-4o", tag: "Vision High" },
      { id: "claude-3-5-sonnet-20241022", label: "Claude 3.5 Sonnet", tag: "Accurate" },
      { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash", tag: "Fast" },
    ],
  },
  gemini: {
    name: "Google AI Studio (Gemini)",
    description: "Official Google Gemini API directly from Google AI Studio.",
    defaultBaseUrl: "",
    defaultModel: "gemini-3.7-flash",
    keyPlaceholder: "AIzaSy...",
    keyHelpUrl: "https://aistudio.google.com/app/apikey",
    keyHelpLabel: "Get Free Gemini API Key",
    popularModels: [
      { id: "gemini-3.7-flash", label: "Gemini 3.7 Flash", tag: "Default" },
      { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash", tag: "Ultra Fast" },
      { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro", tag: "Deep Reasoning" },
    ],
  },
  custom: {
    name: "Custom OpenAI-Compatible",
    description: "Connect any OpenAI-compatible endpoint (Groq, Together AI, DeepSeek, Local Ollama/vLLM).",
    defaultBaseUrl: "https://api.openai.com/v1",
    defaultModel: "gpt-4o-mini",
    keyPlaceholder: "sk-...",
    popularModels: [
      { id: "gpt-4o-mini", label: "gpt-4o-mini" },
      { id: "gpt-4o", label: "gpt-4o" },
      { id: "llama-3.3-70b-versatile", label: "Groq Llama 3.3" },
      { id: "deepseek-chat", label: "DeepSeek Chat" },
    ],
  },
};

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({
  isOpen,
  onClose,
  apiConfig,
  onSaveConfig,
}) => {
  const [provider, setProvider] = useState<ApiProviderType>(apiConfig.provider || "openrouter");
  const [apiKey, setApiKey] = useState(apiConfig.apiKey || "");
  const [baseUrl, setBaseUrl] = useState(apiConfig.baseUrl || PROVIDER_PRESETS[apiConfig.provider || "openrouter"].defaultBaseUrl);
  const [modelName, setModelName] = useState(apiConfig.modelName || PROVIDER_PRESETS[apiConfig.provider || "openrouter"].defaultModel);

  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    const prov = apiConfig.provider || "openrouter";
    setProvider(prov);
    setApiKey(apiConfig.apiKey || "");
    setBaseUrl(apiConfig.baseUrl || PROVIDER_PRESETS[prov].defaultBaseUrl);
    setModelName(apiConfig.modelName || PROVIDER_PRESETS[prov].defaultModel);
    setTestResult(null);
  }, [apiConfig, isOpen]);

  if (!isOpen) return null;

  const handleProviderChange = (newProvider: ApiProviderType) => {
    setProvider(newProvider);
    const preset = PROVIDER_PRESETS[newProvider];
    // If baseUrl is empty or was matching previous preset, update to new default
    if (!baseUrl || baseUrl === PROVIDER_PRESETS[provider].defaultBaseUrl) {
      setBaseUrl(preset.defaultBaseUrl);
    }
    // Update model to new default
    setModelName(preset.defaultModel);
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setTestResult({
        success: false,
        message: "Please enter your API Key first.",
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    const trimmedKey = apiKey.trim();
    const effectiveBaseUrl = baseUrl.trim();
    const effectiveModel = modelName.trim();

    try {
      // 1. Try server verification first
      let serverOk = false;
      let serverError = "";
      try {
        const response = await fetch("/api/test-api-key", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            apiKey: trimmedKey,
            baseUrl: effectiveBaseUrl,
            modelName: effectiveModel,
            provider,
          }),
        });

        const rawText = await response.text().catch(() => "");
        let data: any = null;
        try {
          data = rawText ? JSON.parse(rawText) : null;
        } catch {
          data = null;
        }

        if (response.ok && data?.valid) {
          setTestResult({
            success: true,
            message: data.message || "Connection verified successfully! Everything is working.",
          });
          serverOk = true;
          return;
        } else if (data?.error) {
          serverError = data.error;
        }
      } catch (srvErr: any) {
        serverError = srvErr?.message || "Server verification error";
      }

      if (serverOk) return;

      // 2. If it's an OpenAI/OpenRouter compatible provider, try direct client-side test as a fallback
      if (provider === "openrouter" || provider === "agentrouter" || provider === "custom" || trimmedKey.startsWith("sk-")) {
        const urlToUse = effectiveBaseUrl || (provider === "agentrouter" ? "https://api.agentrouter.com/v1" : "https://openrouter.ai/api/v1");
        const endpoint = `${urlToUse.replace(/\/+$/, "")}/chat/completions`;
        const testModel = effectiveModel || (provider === "agentrouter" ? "gpt-4o-mini" : "openai/gpt-4o-mini");

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);

          const directRes = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${trimmedKey}`,
              "HTTP-Referer": window.location.origin,
              "X-Title": "Indian Catalog Stylist",
            },
            body: JSON.stringify({
              model: testModel,
              messages: [{ role: "user", content: "Reply with 'Connected.'" }],
              max_tokens: 20,
            }),
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          const directText = await directRes.text().catch(() => "");
          let directData: any = null;
          try {
            directData = directText ? JSON.parse(directText) : null;
          } catch {}

          if (directRes.ok && (directData?.choices || directData?.id)) {
            setTestResult({
              success: true,
              message: `Connection successfully verified with ${provider.toUpperCase()} (${testModel})!`,
            });
            return;
          }

          if (directData?.error?.message) {
            setTestResult({
              success: false,
              message: `${provider.toUpperCase()} Error (${directRes.status}): ${directData.error.message}`,
            });
            return;
          }
        } catch (directErr: any) {
          console.warn("Direct test attempt failed:", directErr);
        }
      }

      setTestResult({
        success: false,
        message: serverError || "Failed to verify connection. Please check your API Key, Base URL and Model ID.",
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || "Network error while connecting to the API.",
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    onSaveConfig({
      provider,
      apiKey: apiKey.trim(),
      baseUrl: baseUrl.trim(),
      modelName: modelName.trim(),
    });
    onClose();
  };

  const handleClear = () => {
    setApiKey("");
    setBaseUrl(PROVIDER_PRESETS.openrouter.defaultBaseUrl);
    setModelName(PROVIDER_PRESETS.openrouter.defaultModel);
    setProvider("openrouter");
    setTestResult(null);
    onSaveConfig({
      provider: "gemini",
      apiKey: "",
      baseUrl: "",
      modelName: "gemini-3.7-flash",
    });
  };

  const activePreset = PROVIDER_PRESETS[provider];
  const hasCustomConfigActive = !!apiConfig.apiKey.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif text-white flex items-center gap-2">
                Custom API &amp; Model Settings
                {hasCustomConfigActive && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-sans font-semibold">
                    Active
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-stone-300">
                Use OpenRouter, AgentRouter, Gemini, or custom Base URL &amp; Model
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {/* Provider Selection Tabs */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-2">
              Select Provider / Protocol:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "openrouter", label: "OpenRouter", badge: "Popular" },
                { id: "agentrouter", label: "AgentRouter", badge: "Direct" },
                { id: "gemini", label: "Google AI", badge: "Free Key" },
                { id: "custom", label: "Custom URL", badge: "OpenAI" },
              ].map((p) => {
                const isSelected = provider === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleProviderChange(p.id as ApiProviderType)}
                    className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? "bg-rose-50 border-rose-500 ring-2 ring-rose-500/20 text-rose-950 shadow-2xs"
                        : "bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700 hover:border-stone-300"
                    }`}
                  >
                    <span className="text-xs font-bold truncate">{p.label}</span>
                    <span
                      className={`text-[10px] mt-1 inline-block font-medium ${
                        isSelected ? "text-rose-700" : "text-stone-600"
                      }`}
                    >
                      {p.badge}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-stone-700 mt-2">
              {activePreset.description}
            </p>
          </div>

          {/* API Key Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800">
                {activePreset.name} API Key:
              </label>
              {activePreset.keyHelpUrl && (
                <a
                  href={activePreset.keyHelpUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 hover:text-rose-900 underline"
                >
                  <span>{activePreset.keyHelpLabel || "Get API Key"}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setTestResult(null);
                }}
                placeholder={activePreset.keyPlaceholder}
                className="w-full pl-3.5 pr-20 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-xs font-mono bg-stone-50 text-stone-900"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md"
                  title={showKey ? "Hide API Key" : "Show API Key"}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Base URL Input (for OpenRouter, AgentRouter, Custom) */}
          {provider !== "gemini" && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-rose-600" />
                  <span>Base URL Endpoint:</span>
                </label>
                <button
                  type="button"
                  onClick={() => setBaseUrl(activePreset.defaultBaseUrl)}
                  className="text-[11px] text-stone-700 hover:text-stone-900 underline font-medium"
                >
                  Reset Default URL
                </button>
              </div>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => {
                  setBaseUrl(e.target.value);
                  setTestResult(null);
                }}
                placeholder="https://openrouter.ai/api/v1 or https://api.agentrouter.com/v1"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-xs font-mono bg-stone-50 text-stone-900"
              />
              <p className="text-[11px] text-stone-600">
                Standard OpenAI-compatible completions endpoint. Example:{" "}
                <code className="text-stone-800 font-mono font-semibold">
                  {baseUrl || activePreset.defaultBaseUrl}/chat/completions
                </code>
              </p>
            </div>
          )}

          {/* Model Name Input & Preset Chips */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-rose-600" />
              <span>Model Name / ID:</span>
            </label>
            <input
              type="text"
              value={modelName}
              onChange={(e) => {
                setModelName(e.target.value);
                setTestResult(null);
              }}
              placeholder={activePreset.defaultModel}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-xs font-mono bg-stone-50 text-stone-900 font-semibold"
            />

            {/* Popular Model Suggestions Chips */}
            <div>
              <span className="text-[11px] text-stone-600 font-semibold block mb-1.5">
                Quick Select Popular Models:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activePreset.popularModels.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setModelName(m.id);
                      setTestResult(null);
                    }}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                      modelName === m.id
                        ? "bg-rose-600 text-white border-rose-600 font-bold shadow-2xs"
                        : "bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-200"
                    }`}
                  >
                    <span>{m.label}</span>
                    {m.tag && (
                      <span
                        className={`text-[9px] px-1 py-0.2 rounded ${
                          modelName === m.id ? "bg-white/20 text-white" : "bg-stone-200 text-stone-600"
                        }`}
                      >
                        {m.tag}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Test Status Feedback */}
          {testResult && (
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                testResult.success
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-rose-50 border-rose-200 text-rose-900"
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="font-medium leading-relaxed">{testResult.message}</div>
            </div>
          )}

          {/* Current Active Status Indicator */}
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
            <span className="text-stone-600 font-medium">Current App Status:</span>
            {hasCustomConfigActive ? (
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                Custom ({apiConfig.provider?.toUpperCase() || "CUSTOM"}) • {apiConfig.modelName || "Active"}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-medium text-stone-700 bg-stone-200/80 px-2 py-0.5 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Using Built-in System AI
              </span>
            )}
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="px-5 sm:px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-2">
          <div>
            {hasCustomConfigActive && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs font-semibold text-stone-700 hover:text-rose-700 flex items-center gap-1 transition px-2 py-1"
                title="Reset back to built-in system AI"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset to Default AI</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing || !apiKey.trim()}
              className="px-3.5 py-2 rounded-xl border border-stone-300 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition flex items-center gap-1.5 disabled:opacity-50"
            >
              {testing ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Testing...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  <span>Test Connection</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white text-xs font-bold shadow-sm transition"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
