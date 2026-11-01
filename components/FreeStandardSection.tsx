'use client';

import React from 'react';
import { useScrollReveal } from '@/lib/motion';
import { ShieldCheck, Lock, Award, Database } from 'lucide-react';

export function FreeStandardSection() {
  const sectionRef = useScrollReveal<HTMLElement>(0.1);

  const criteria = [
    {
      num: '01',
      title: 'Zero Credit Card Gatekeeping',
      icon: Lock,
      description:
        'Every tool indexed in MARIA allows immediate access or sign-up without demanding payment credentials upfront. You never risk accidental billing or credit card forfeiture while prototyping.',
    },
    {
      num: '02',
      title: 'Authentic Free Tiers & Open Source',
      icon: ShieldCheck,
      description:
        'We reject pseudo-free trials with 7-day expiration traps. Every service listed provides a perpetual free allowance, self-hostable open source repository, or perpetual license.',
    },
    {
      num: '03',
      title: 'Commercial Creation Permissions',
      icon: Award,
      description:
        'Whether shipping a client production website, distributing an indie video game, or monetizing 3D assets, tools in MARIA carry commercial-friendly licensing (MIT, Apache 2.0, CC0, or commercial-OK free tiers).',
    },
    {
      num: '04',
      title: 'Sovereign Data Portability',
      icon: Database,
      description:
        'We prioritize tools with standardized open formats (SQL dumps, SVG vectors, open GGUF model weights, standard FFmpeg codecs) so your digital creations remain entirely sovereign.',
    },
  ];

  return (
    <section
      id="standards"
      ref={sectionRef}
      className="scroll-reveal relative py-24 px-6 border-t border-line select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="type-eyebrow text-reishi block mb-2 drop-shadow-md">
            Architectural Invariants
          </span>
          <h2 className="type-page-title text-bone drop-shadow-lg">
            The Four Inviolable Standards of MARIA
          </h2>
          <p className="type-body-lg text-ash-400 mt-3 mx-auto drop-shadow-md">
            The digital ecosystem is riddled with deceptive trial traps, stealth subscription renewals, and artificial paywalls. Every artifact indexed in MARIA is verified against four immutable criteria before admission into the canon.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {criteria.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.num}
                className="group relative p-6 rounded-[6px] bg-surface/85 backdrop-blur-md border border-line hover:border-reishi/50 flex flex-col justify-between transition-all duration-300 overflow-hidden shadow-2xl hover:-translate-y-1"
              >
                {/* 1px Hairline along the top edge */}
                <div
                  aria-hidden="true"
                  className="absolute top-0 left-0 right-0 h-[1.5px] bg-reishi transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100 pointer-events-none"
                />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-reishi tracking-widest block">
                      CRITERION {item.num}
                    </span>
                    <Icon className="w-4 h-4 text-ash-400 group-hover:text-reishi transition-colors" />
                  </div>
                  <h3 className="type-h4 text-bone mb-2.5 group-hover:translate-x-[2px] transition-transform duration-200">
                    {item.title}
                  </h3>
                  <p className="type-body-sm text-ash-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-line text-[10px] font-mono uppercase tracking-widest text-ash-600 flex items-center justify-between">
                  <span>CANONICAL STANDARD</span>
                  <span className="text-reishi font-semibold">VERIFIED</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
