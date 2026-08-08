import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Wand2, CalendarRange, Accessibility } from 'lucide-react';
import { listLessons } from '../lib/lessonStore';
import { listWarmUps } from '../lib/warmupStore';
import { listPacingGuides } from '../lib/pacingStore';

export function HomePage() {
  const [counts, setCounts] = useState({ lessons: 0, warmups: 0, pacingGuides: 0 });

  useEffect(() => {
    Promise.all([listLessons(), listWarmUps(), listPacingGuides()]).then(([lessons, warmups, pacingGuides]) => {
      setCounts({ lessons: lessons.length, warmups: warmups.length, pacingGuides: pacingGuides.length });
    });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, coach 👋</h1>
        <p className="text-gray-500 mt-1">
          Free lesson plans, sub plans, and pacing guides for K-5 PE teachers - built by a PE teacher, for PE
          teachers.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Lessons" value={counts.lessons} />
        <StatCard label="Warm-Ups" value={counts.warmups} />
        <StatCard label="Pacing Guides" value={counts.pacingGuides} />
        <StatCard label="Storage" value="On this device" isText />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <QuickLink
          to="/generator"
          icon={Wand2}
          title="Generate a Sub Lesson"
          description="Pick a unit, grade, and gym space - get a ready-to-print sub lesson in seconds."
        />
        <QuickLink
          to="/library"
          icon={BookOpen}
          title="Browse the Lesson Library"
          description="Full lesson plans for soccer, jump rope, volleyball, and more."
        />
        <QuickLink
          to="/pacing"
          icon={CalendarRange}
          title="Build a Pacing Guide"
          description="Lay out your whole year, week by week, grade by grade."
        />
        <QuickLink
          to="/adaptive-pe"
          icon={Accessibility}
          title="Inclusion & Adaptive PE Toolkit"
          description="Strategies and equipment ideas for including students with disabilities in every unit."
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, isText }: { label: string; value: number | string; isText?: boolean }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
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
      className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 hover:border-brand-300 hover:shadow-md transition"
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
