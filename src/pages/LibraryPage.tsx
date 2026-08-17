import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Search, Accessibility, ArrowRight, BadgeCheck } from 'lucide-react';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import type { Lesson } from '../types/lesson';
import type { WarmUp } from '../types/warmup';
import { ALL_GRADES, gradeLabel, type Grade } from '../types/common';
import { listLessons } from '../lib/lessonStore';
import { listWarmUps, saveWarmUp, deleteWarmUp } from '../lib/warmupStore';
import { PageHeader } from '../components/layout/PageHeader';
import { EmptyState } from '../components/layout/EmptyState';
import { LessonCard } from '../components/lesson/LessonCard';
import { WarmUpListItem } from '../components/warmup/WarmUpListItem';
import { AddWarmUpForm } from '../components/warmup/AddWarmUpForm';
import { Button } from '../components/ui/Button';

type Tab = 'lessons' | 'warmups';

export function LibraryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState<Tab>('lessons');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [warmUps, setWarmUps] = useState<WarmUp[]>([]);
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState<Grade | 'all'>('all');
  const [gymFilter, setGymFilter] = useState<'all' | 'full' | 'half'>('all');
  const [subFriendlyOnly, setSubFriendlyOnly] = useState(searchParams.get('subFriendly') === 'true');
  const [showAddWarmUp, setShowAddWarmUp] = useState(false);

  useEffect(() => {
    listLessons().then(setLessons);
    listWarmUps().then(setWarmUps);
  }, []);

  function toggleSubFriendlyOnly() {
    const next = !subFriendlyOnly;
    setSubFriendlyOnly(next);
    const params = new URLSearchParams(searchParams);
    if (next) params.set('subFriendly', 'true');
    else params.delete('subFriendly');
    setSearchParams(params, { replace: true });
  }

  const filteredLessons = useMemo(() => {
    const filtered = lessons.filter((lesson) => {
      const matchesSearch =
        !search ||
        lesson.title.toLowerCase().includes(search.toLowerCase()) ||
        lesson.unit.toLowerCase().includes(search.toLowerCase()) ||
        lesson.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesGrade = gradeFilter === 'all' || lesson.gradeLevels.includes(gradeFilter);
      const matchesGym = gymFilter === 'all' || lesson.gymSpace === gymFilter;
      const matchesSubFriendly = !subFriendlyOnly || lesson.subFriendly;
      return matchesSearch && matchesGrade && matchesGym && matchesSubFriendly;
    });
    // Lessons that are part of a series sort together under the series name, in
    // teaching order, so a progression like "Part 1/2/3" always lands as a group
    // instead of scattered wherever their individual titles happen to sort.
    return filtered.sort((a, b) => {
      const aKey = a.series?.name ?? a.title;
      const bKey = b.series?.name ?? b.title;
      const keyCompare = aKey.localeCompare(bKey);
      if (keyCompare !== 0) return keyCompare;
      return (a.series?.part ?? 0) - (b.series?.part ?? 0);
    });
  }, [lessons, search, gradeFilter, gymFilter, subFriendlyOnly]);

  const filteredWarmUps = useMemo(() => {
    return warmUps.filter(
      (w) => !search || w.name.toLowerCase().includes(search.toLowerCase()) || w.description.toLowerCase().includes(search.toLowerCase()),
    );
  }, [warmUps, search]);

  async function handleDeleteWarmUp(id: string) {
    await deleteWarmUp(id);
    setWarmUps(await listWarmUps());
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lesson Library"
        subtitle="Free, ready-to-use lessons and warm-up games. Add your own anytime."
        actions={
          tab === 'lessons' ? (
            <Link to="/library/new">
              <Button>
                <Plus size={16} /> New Lesson
              </Button>
            </Link>
          ) : (
            <Button onClick={() => setShowAddWarmUp(true)}>
              <Plus size={16} /> New Warm-Up
            </Button>
          )
        }
      />

      <Link
        to="/adaptive-pe"
        className="inline-flex items-center gap-1.5 text-sm text-brand-700 hover:underline"
      >
        <Accessibility size={15} /> Inclusion & Adaptive PE Toolkit <ArrowRight size={13} />
      </Link>

      <div className="flex gap-1 border-b border-gray-200">
        <TabButton active={tab === 'lessons'} onClick={() => setTab('lessons')} label={`Lessons (${lessons.length})`} />
        <TabButton active={tab === 'warmups'} onClick={() => setTab('warmups')} label={`Warm-Ups & Games (${warmUps.length})`} />
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm"
            placeholder={tab === 'lessons' ? 'Search lessons...' : 'Search warm-ups...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {tab === 'lessons' && (
          <>
            <select
              className="rounded-lg border border-gray-300 px-2 py-2 text-sm"
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value as Grade | 'all')}
            >
              <option value="all">All grades</option>
              {ALL_GRADES.map((g) => (
                <option key={g} value={g}>
                  {gradeLabel(g)}
                </option>
              ))}
            </select>
            <select
              className="rounded-lg border border-gray-300 px-2 py-2 text-sm"
              value={gymFilter}
              onChange={(e) => setGymFilter(e.target.value as 'all' | 'full' | 'half')}
            >
              <option value="all">Any gym space</option>
              <option value="full">Full gym</option>
              <option value="half">Half gym</option>
            </select>
            <button
              onClick={toggleSubFriendlyOnly}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition ${
                subFriendlyOnly
                  ? 'border-brand-400 bg-brand-100 text-brand-700'
                  : 'border-gray-300 text-gray-600 hover:border-brand-300'
              }`}
            >
              <BadgeCheck size={15} /> Sub-Friendly only
            </button>
          </>
        )}
      </div>

      {tab === 'lessons' ? (
        filteredLessons.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLessons.map((lesson, i) => (
              <ScrollReveal key={lesson.id} index={i % 9}>
                <LessonCard lesson={lesson} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <EmptyState title="No lessons match your filters" description="Try clearing filters or add your own lesson." />
        )
      ) : (
        <div className="space-y-3">
          {showAddWarmUp && (
            <AddWarmUpForm
              onCancel={() => setShowAddWarmUp(false)}
              onSave={async (warmUp) => {
                await saveWarmUp(warmUp);
                setWarmUps(await listWarmUps());
                setShowAddWarmUp(false);
              }}
            />
          )}
          {filteredWarmUps.length ? (
            filteredWarmUps.map((w) => <WarmUpListItem key={w.id} warmUp={w} onDelete={handleDeleteWarmUp} />)
          ) : (
            <EmptyState title="No warm-ups match your search" />
          )}
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
        active ? 'border-brand-600 text-brand-700' : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      {label}
    </button>
  );
}
