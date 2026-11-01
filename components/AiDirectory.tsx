'use client';

import React from 'react';
import { Bot, Key, ExternalLink, ShieldCheck, Cpu, ArrowUpRight } from 'lucide-react';

interface AiProvider {
  name: string;
  provider: string;
  models: string;
  freeAllowance: string;
  keyRequired: boolean;
  creditCardRequired: boolean;
  keyManagementUrl: string;
  docsUrl: string;
  pricingUrl: string;
  lastChecked: string;
  executionMode: 'Cloud API' | 'Local Offline';
}

export function AiDirectory() {
  const providers: AiProvider[] = [
    {
      name: 'Groq Cloud',
      provider: 'Groq Inc.',
      models: 'Llama 3.3 70B, Llama 3.1 8B, Mixtral 8x7B, Whisper Large v3',
      freeAllowance: '30 requests/min, 14,400 requests/day free tier with 500+ tok/s speed',
      keyRequired: true,
      creditCardRequired: false,
      keyManagementUrl: 'https://console.groq.com/keys',
      docsUrl: 'https://console.groq.com/docs/quickstart',
      pricingUrl: 'https://groq.com/pricing',
      lastChecked: 'October 2026',
      executionMode: 'Cloud API',
    },
    {
      name: 'Google AI Studio',
      provider: 'Google',
      models: 'Gemini 2.5 Flash, Gemini 2.0 Flash, Gemma 2',
      freeAllowance: 'Free tier with 15 requests/minute, 1,500 requests/day for development',
      keyRequired: true,
      creditCardRequired: false,
      keyManagementUrl: 'https://aistudio.google.com/app/apikey',
      docsUrl: 'https://ai.google.dev/gemini-api/docs',
      pricingUrl: 'https://ai.google.dev/pricing',
      lastChecked: 'October 2026',
      executionMode: 'Cloud API',
    },
    {
      name: 'Hugging Face Inference API',
      provider: 'Hugging Face',
      models: '10,000+ open-weights models (Transformers, Diffusion, Whisper)',
      freeAllowance: 'Free community rate limits on serverless endpoints (~30,000 tokens/mo)',
      keyRequired: true,
      creditCardRequired: false,
      keyManagementUrl: 'https://huggingface.co/settings/tokens',
      docsUrl: 'https://huggingface.co/docs/api-inference',
      pricingUrl: 'https://huggingface.co/pricing',
      lastChecked: 'October 2026',
      executionMode: 'Cloud API',
    },
    {
      name: 'Cloudflare Workers AI',
      provider: 'Cloudflare',
      models: 'Llama 3, DeepSeek, Whisper, BGE Embeddings',
      freeAllowance: '10,000 Neurons per day completely free across Cloudflare edge network',
      keyRequired: true,
      creditCardRequired: false,
      keyManagementUrl: 'https://dash.cloudflare.com',
      docsUrl: 'https://developers.cloudflare.com/workers-ai',
      pricingUrl: 'https://developers.cloudflare.com/workers-ai/platform/pricing',
      lastChecked: 'October 2026',
      executionMode: 'Cloud API',
    },
    {
      name: 'Ollama Local Runtime',
      provider: 'Open Source Community',
      models: 'Llama 3, Mistral, Gemma 2, Phi-3, Qwen 2.5, DeepSeek',
      freeAllowance: '100% Free, infinite tokens, zero telemetry, runs completely offline on your hardware',
      keyRequired: false,
      creditCardRequired: false,
      keyManagementUrl: 'https://ollama.com',
      docsUrl: 'https://github.com/ollama/ollama/blob/main/docs/api.md',
      pricingUrl: 'https://ollama.com',
      lastChecked: 'October 2026',
      executionMode: 'Local Offline',
    },
  ];

  return (
    <section id="ai" className="py-12 px-2 sm:px-4 max-w-7xl mx-auto w-full">
      <div className="max-w-2xl mx-auto text-center mb-10">
        <span className="type-eyebrow text-[#c5a059] block mb-1.5">
          Neural Compute & Inference
        </span>
        <h2 className="type-section-title text-[#f5f5f0]">
          Verified Free AI APIs & Sovereign Local Runtimes
        </h2>
        <p className="type-supporting text-[#a3a39c] mt-2">
          Direct canonical links to official key management consoles and documentation. Zero deceptive pricing or secret paywalls.
        </p>
      </div>

      <div className="space-y-4">
        {providers.map((p) => (
          <div
            key={p.name}
            className="p-6 rounded-xl bg-[#0e0e14] border border-white/[0.08] hover:border-[#c5a059]/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-display font-bold text-lg text-[#f5f5f0]">{p.name}</span>
                <span className="text-white/20">·</span>
                <span className="font-mono text-xs text-[#787872]">{p.provider}</span>
                <span className="text-white/20">·</span>
                <span
                  className={`font-mono text-xs px-2 py-0.5 rounded border ${
                    p.executionMode === 'Local Offline'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-[#14141c] text-[#c5a059] border-[#c5a059]/30'
                  }`}
                >
                  {p.executionMode}
                </span>
              </div>

              <div className="text-xs text-[#a3a39c]">
                <strong className="text-[#e8e8e1]">Supported Weights:</strong> {p.models}
              </div>

              <div className="text-xs text-[#d6d6ce] flex items-center gap-1.5 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>{p.freeAllowance}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={p.keyManagementUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="type-btn px-4 py-2 rounded-[2px] bg-[#f5f5f0] hover:bg-[#e8e8e1] text-[#070709] inline-flex items-center gap-1.5 transition-colors"
              >
                <span>{p.keyRequired ? 'Get Free Key' : 'Get Runtime'}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#070709]" />
              </a>

              <a
                href={p.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="type-btn px-3.5 py-2 rounded-[2px] bg-[#14141c] hover:bg-[#1a1a24] text-[#d6d6ce] hover:text-[#f5f5f0] inline-flex items-center gap-1.5 transition-colors border border-white/[0.08]"
              >
                <span>Docs</span>
                <ExternalLink className="w-3 h-3 text-[#787872]" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
