import { Accessibility, Eye, Ear, Brain } from 'lucide-react';
import type { AccommodationCategory } from '../types/common';
import { ACCOMMODATION_LABEL } from '../types/common';
import { ADAPTIVE_PE_SECTIONS, UDL_PRINCIPLES, LEGAL_BASICS } from '../data/adaptivePE';
import { PageHeader } from '../components/layout/PageHeader';

const CATEGORY_ICON: Record<AccommodationCategory, typeof Accessibility> = {
  mobility: Accessibility,
  visual: Eye,
  sensory: Ear,
  cognitive: Brain,
};

export function AdaptivePEPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Inclusion & Adaptive PE Toolkit"
        subtitle="General strategies and equipment ideas for including students with disabilities in every unit."
        back
      />

      <div className="rounded-xl border border-brand-200 bg-brand-50 p-4 space-y-2">
        <h2 className="font-semibold text-gray-900">Universal Design for Learning</h2>
        <ul className="list-disc pl-5 text-sm space-y-1.5 text-gray-700">
          {UDL_PRINCIPLES.map((principle, i) => (
            <li key={i}>{principle}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-6">
        {ADAPTIVE_PE_SECTIONS.map((section) => {
          const Icon = CATEGORY_ICON[section.category];
          return (
            <div key={section.category} className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
              <h2 className="flex items-center gap-2 font-semibold text-gray-900 text-lg">
                <span className="rounded-lg bg-brand-100 text-brand-700 p-1.5">
                  <Icon size={18} />
                </span>
                {ACCOMMODATION_LABEL[section.category]}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1.5">Strategies</p>
                  <ul className="list-disc pl-5 text-sm space-y-1.5 text-gray-700">
                    {section.strategies.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1.5">Equipment Ideas</p>
                  <ul className="list-disc pl-5 text-sm space-y-1.5 text-gray-700">
                    {section.equipment.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-2">
        <h2 className="font-semibold text-gray-900">Legal Basics</h2>
        <ul className="list-disc pl-5 text-sm space-y-1.5 text-gray-700">
          {LEGAL_BASICS.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-gray-400">
        General guidance, not a substitute for a student's IEP/504 plan or your school's adapted PE / special
        education staff - always coordinate with them for individual student needs.
      </p>
    </div>
  );
}
