import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Wand2, CalendarRange, Accessibility, ClipboardList, ArrowRight } from 'lucide-react';
import { listLessons } from '../lib/lessonStore';
import { listWarmUps } from '../lib/warmupStore';
import { listPacingGuides } from '../lib/pacingStore';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { ProgressRing } from '../components/ui/ProgressRing';

export function HomePage() {
  const [counts, setCounts] = useState({ lessons: 0, warmups: 0, pacingGuides: 0 });
  const [weekProgress, setWeekProgress] = useState({ completed: 0, total: 0 });

  useEffect(() => {
    Promise.all([listLessons(), listWarmUps(), listPacingGuides()]).then(([lessons, warmups, pacingGuides]) => {
      setCounts({ lessons: lessons.length, warmups: warmups.length, pacingGuides: pacingGuides.length });
      const allWeeks = pacingGuides.flatMap((g) => g.weeks);
      setWeekProgress({ completed: allWeeks.filter((w) => w.completed).length, total: allWeeks.length });
    });
  }, []);

  return (
    <div className="space-y-8">
      <Link
        to="/sub-handbook"
        className="flex items-center gap-4 rounded-xl border-2 border-brand-300 bg-brand-50 p-4 hover:border-brand-400 hover:shadow-md transition"
      >
        <span className="rounded-lg bg-brand-600 text-white p-2.5 shrink-0">
          <ClipboardList size={22} />
        </span>
        <span className="flex-1">
          <span className="block font-semibold text-gray-900">Covering this class? Start here.</span>
          <span className="block text-sm text-gray-600">
            Welcome note, emergency procedures and contacts, and a one-tap link to pick today's sub lesson.
          </span>
        </span>
        <ArrowRight size={18} className="text-brand-600 shrink-0" />
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, coach 👋</h1>
        <p className="text-gray-500 mt-1">
          Free lesson plans, sub plans, and pacing guides for K-5 PE teachers - built by a PE teacher, for PE
          teachers.
        </p>
      </div>

      {weekProgress.total > 0 && (
        <ScrollReveal>
          <Link
            to="/pacing"
            className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 hover:border-brand-300 hover:shadow-md transition"
          >
            <ProgressRing value={weekProgress.completed} max={weekProgress.total} size={64} />
            <span>
              <span className="block font-semibold text-gray-900">Year Progress</span>
              <span className="block text-sm text-gray-500">
                {weekProgress.completed} of {weekProgress.total} pacing guide weeks marked taught
              </span>
            </span>
          </Link>
        </ScrollReveal>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-stretch">
        <ScrollReveal index={0} className="h-full">
          <StatCard label="Lessons" value={counts.lessons} />
        </ScrollReveal>
        <ScrollReveal index={1} className="h-full">
          <StatCard label="Warm-Ups" value={counts.warmups} />
        </ScrollReveal>
        <ScrollReveal index={2} className="h-full">
          <StatCard label="Pacing Guides" value={counts.pacingGuides} />
        </ScrollReveal>
        <ScrollReveal index={3} className="h-full">
          <StatCard label="Storage" value="On this device" isText />
        </ScrollReveal>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 items-stretch">
        <ScrollReveal index={0} className="h-full">
          <QuickLink
            to="/generator"
            icon={Wand2}
            title="Generate a Sub Lesson"
            description="Pick a unit, grade, and gym space - get a ready-to-print sub lesson in seconds."
          />
        </ScrollReveal>
        <ScrollReveal index={1} className="h-full">
          <QuickLink
            to="/library"
            icon={BookOpen}
            title="Browse the Lesson Library"
            description="Full lesson plans for soccer, jump rope, volleyball, and more."
          />
        </ScrollReveal>
        <ScrollReveal index={2} className="h-full">
          <QuickLink
            to="/pacing"
            icon={CalendarRange}
            title="Build a Pacing Guide"
            description="Lay out your whole year, week by week, grade by grade."
          />
        </ScrollReveal>
        <ScrollReveal index={3} className="h-full">
          <QuickLink
            to="/adaptive-pe"
            icon={Accessibility}
            title="Inclusion & Adaptive PE Toolkit"
            description="Strategies and equipment ideas for including students with disabilities in every unit."
          />
        </ScrollReveal>
      </div>
    </div>
  );
}

function StatCard({ label, value, isText }: { label: string; value: number | string; isText?: boolean }) {
  return (
    <div className="h-full flex flex-col justify-center rounded-xl border border-gray-200 bg-white p-4">
      <p className={isText ? 'text-sm font-semibold text-gray-700' : 'text-2xl font-bold text-brand-700'}>{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

function QuickLink({
  to,
  icon: Icon,
  title,
  description,
}: {
  to: string;
  icon: typeof Wand2;
  title: string;
  description: string;
}) {
  return (
    <Link
      to={to}
      className="h-full flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 hover:border-brand-300 hover:shadow-md transition"
    >
      <span className="rounded-lg bg-brand-100 text-brand-700 p-2 shrink-0">
        <Icon size={20} />
      </span>
      <span>
        <span className="block font-semibold text-gray-900">{title}</span>
        <span className="block text-sm text-gray-500">{description}</span>
      </span>
    </Link>
  );
}
