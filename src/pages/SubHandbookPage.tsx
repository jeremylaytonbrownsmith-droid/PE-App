import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, Trash2, Download, ArrowRight, Wand2, BookOpen, ShieldAlert, Search, Shuffle, Link2, Check } from 'lucide-react';
import type { SubHandbook, SubResource } from '../types/subHandbook';
import type { PacingGuide } from '../types/pacing';
import type { Lesson } from '../types/lesson';
import { STANDARD_ARRIVAL_SETUP, STANDARD_CLOSURE } from '../types/lesson';
import { ALL_GRADES, gradeLabel } from '../types/common';
import { getSubHandbook, saveSubHandbook, listSubResources, addSubResource, deleteSubResource, fileToDataUrl } from '../lib/subHandbookStore';
import { listPacingGuides } from '../lib/pacingStore';
import { listLessons } from '../lib/lessonStore';
import { getSchedule } from '../lib/scheduleStore';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { PrintButton } from '../components/ui/PrintButton';
import { InfoBox } from '../components/boxes/InfoBox';

function inRange(dateIso: string, start?: string, end?: string): boolean {
  if (!start || !end) return false;
  return dateIso >= start && dateIso <= end;
}

export function SubHandbookPage() {
  const navigate = useNavigate();
  const [handbook, setHandbook] = useState<SubHandbook | null>(null);
  const [resources, setResources] = useState<SubResource[]>([]);
  const [guides, setGuides] = useState<PacingGuide[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [hasSchoolSchedule, setHasSchoolSchedule] = useState(false);
  const [saving, setSaving] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const subLink = `${window.location.origin}/sub`;

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(subLink);
    } catch {
      // Clipboard API unavailable - the link is still visible to select/copy manually.
    }
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }

  useEffect(() => {
    getSubHandbook().then(setHandbook);
    listSubResources().then(setResources);
    listPacingGuides().then(setGuides);
    listLessons().then(setLessons);
    getSchedule().then((s) => setHasSchoolSchedule(s.rows.length > 0));
  }, []);

  const quickSearchResults = useMemo(() => {
    const q = quickSearch.trim().toLowerCase();
    if (!q) return [];
    return lessons
      .filter((l) => l.title.toLowerCase().includes(q) || l.unit.toLowerCase().includes(q) || l.tags.some((t) => t.toLowerCase().includes(q)))
      .slice(0, 8);
  }, [lessons, quickSearch]);

  if (!handbook) return <p className="text-gray-400">Loading...</p>;

  async function handleSave() {
    if (!handbook) return;
    setSaving(true);
    await saveSubHandbook(handbook);
    setSaving(false);
  }

  async function handleFileUpload(file: File) {
    const dataUrl = await fileToDataUrl(file);
    await addSubResource({ title: file.name, fileName: file.name, fileType: file.type, dataUrl });
    setResources(await listSubResources());
  }

  const activeGuide = guides.find((g) => g.id === handbook.activeGuideId);
  const coverageWeeks = activeGuide
    ? activeGuide.weeks
        .map((w) => ({ ...w, guideName: activeGuide.name }))
        .filter((w) => inRange(w.startDate, handbook.coverageStart, handbook.coverageEnd))
        .sort((a, b) => a.startDate.localeCompare(b.startDate))
    : [];

  function handleSurpriseMe() {
    const pool = lessons.filter((l) => l.subFriendly);
    if (!pool.length) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    navigate(`/library/${pick.id}`);
  }

  const isUnfilled =
    !handbook.welcomeMessage && !handbook.importantContacts && !handbook.emergencyProcedures && !handbook.equipmentNotes && !handbook.coverageStart;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Substitute Handbook"
        subtitle="Everything a substitute needs to pick up your PE classes with confidence."
        actions={
          <>
            <PrintButton />
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </>
        }
      />

      <div className="no-print rounded-xl border-2 border-brand-300 bg-brand-50 p-4 space-y-2">
        <h2 className="flex items-center gap-1.5 font-semibold text-gray-900">
          <Link2 size={16} className="text-brand-700" /> This is the link to give your secretary or sub
        </h2>
        <p className="text-xs text-gray-600">
          This page is for you to edit. The link below is a simplified, read-only version - no editing or delete
          buttons, just emergency info, today's plan, and a way to find a lesson - safe to hand to anyone.
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <code className="flex-1 min-w-[200px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 truncate">
            {subLink}
          </code>
          <Button variant="secondary" onClick={handleCopyLink}>
            {linkCopied ? (
              <>
                <Check size={16} className="text-brand-600" /> Copied!
              </>
            ) : (
              'Copy Link'
            )}
          </Button>
        </div>
      </div>

      {isUnfilled && (
        <InfoBox color="orange" title="Set this up once, then forget about it" className="no-print">
          Fill in the sections below - your welcome note, emergency procedures, and coverage dates. They'll show up
          automatically on the simplified link above once they're saved.
        </InfoBox>
      )}

      <div className="rounded-xl border border-brand-200 bg-brand-50 p-4 space-y-2">
        <h2 className="font-semibold text-gray-900">Welcome Message</h2>
        <p className="text-xs text-gray-500 no-print">
          Write a short note to whoever is covering your classes - what to expect, anything you want them to know.
        </p>
        <textarea
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
          rows={4}
          placeholder="Welcome! Thanks so much for covering PE while I'm out..."
          value={handbook.welcomeMessage}
          onChange={(e) => setHandbook({ ...handbook, welcomeMessage: e.target.value })}
        />
      </div>

      <section className="space-y-2">
        <h2 className="flex items-center gap-1.5 font-semibold text-gray-900">
          <ShieldAlert size={18} className="text-red-600" /> Important Contacts &amp; Emergency Procedures
        </h2>
        <p className="text-xs text-gray-500 no-print">
          The first thing a substitute should read - who to call, and what to do for a fire drill, lockdown/intruder,
          severe weather, or an injury. "In a real emergency, call 911" is always shown automatically on the sub link
          above - no need to type that yourself.
        </p>
        <label className="text-sm space-y-1 block">
          <span className="font-medium text-gray-700">Contacts (front office, nurse, PE department, behavior referral)</span>
          <textarea
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            rows={3}
            value={handbook.importantContacts}
            onChange={(e) => setHandbook({ ...handbook, importantContacts: e.target.value })}
          />
        </label>
        <label className="text-sm space-y-1 block">
          <span className="font-medium text-gray-700">Emergency procedures (fire drill, lockdown/intruder, severe weather/tornado, injury)</span>
          <textarea
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            rows={4}
            value={handbook.emergencyProcedures}
            onChange={(e) => setHandbook({ ...handbook, emergencyProcedures: e.target.value })}
          />
        </label>
        <label className="text-sm space-y-1 block">
          <span className="font-medium text-gray-700">Equipment notes (where things are kept, what's off-limits)</span>
          <textarea
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            rows={3}
            value={handbook.equipmentNotes}
            onChange={(e) => setHandbook({ ...handbook, equipmentNotes: e.target.value })}
          />
        </label>
      </section>

      <section className="rounded-xl border-2 border-brand-300 bg-brand-50 p-4 space-y-4">
        <div>
          <h2 className="font-semibold text-gray-900">Need a lesson right now?</h2>
          <p className="text-sm text-gray-600">
            If today's lesson isn't listed below, pick anything from the sub-friendly library - every one of these
            needs no PE-specific coaching or specialized equipment know-how.
          </p>
        </div>

        <div className="relative no-print">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm bg-white"
            placeholder="Type a lesson name or activity (e.g. 'tag', 'basketball')..."
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
          />
          {quickSearchResults.length > 0 && (
            <div className="mt-2 rounded-lg border border-gray-200 bg-white divide-y divide-gray-100 overflow-hidden">
              {quickSearchResults.map((lesson) => (
                <Link
                  key={lesson.id}
                  to={`/library/${lesson.id}`}
                  className="flex items-center justify-between gap-2 px-3 py-2 text-sm hover:bg-brand-50"
                >
                  <span className="text-gray-800">
                    {lesson.title}
                    {lesson.subFriendly && <span className="ml-2 text-xs text-brand-700">(sub-friendly)</span>}
                  </span>
                  <ArrowRight size={14} className="text-gray-400 shrink-0" />
                </Link>
              ))}
            </div>
          )}
          {quickSearch.trim() && quickSearchResults.length === 0 && (
            <p className="mt-2 text-sm text-gray-500">No lessons match "{quickSearch}".</p>
          )}
        </div>

        <div className="no-print space-y-1.5">
          <p className="text-xs font-medium text-gray-600">Grab-and-go by grade</p>
          <div className="flex flex-wrap gap-2">
            {ALL_GRADES.map((g) => (
              <Link key={g} to={`/library?subFriendly=true&grade=${g}`}>
                <Button variant="secondary">{gradeLabel(g)}</Button>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 no-print">
          <Link to="/library?subFriendly=true">
            <Button>
              <BookOpen size={16} /> Browse Sub-Friendly Lessons
            </Button>
          </Link>
          <Button variant="secondary" onClick={handleSurpriseMe}>
            <Shuffle size={16} /> Surprise Me
          </Button>
          <Link to="/generator">
            <Button variant="secondary">
              <Wand2 size={16} /> Generate a Sub Lesson
            </Button>
          </Link>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-semibold text-gray-900">Today's / This Week's Plan</h2>
          <Link to="/pacing" className="no-print inline-flex items-center gap-1 text-sm text-brand-700 hover:underline">
            Edit the pacing guide <ArrowRight size={14} />
          </Link>
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="text-sm space-y-1">
            <span className="block font-medium text-gray-700">Which pacing guide?</span>
            <select
              className="rounded-lg border border-gray-300 px-3 py-2"
              value={handbook.activeGuideId ?? ''}
              onChange={(e) => setHandbook({ ...handbook, activeGuideId: e.target.value || undefined })}
            >
              <option value="">— pick one —</option>
              {guides.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm space-y-1">
            <span className="block font-medium text-gray-700">First day out</span>
            <input
              type="date"
              className="rounded-lg border border-gray-300 px-3 py-2"
              value={handbook.coverageStart ?? ''}
              onChange={(e) => setHandbook({ ...handbook, coverageStart: e.target.value })}
            />
          </label>
          <label className="text-sm space-y-1">
            <span className="block font-medium text-gray-700">Last day out</span>
            <input
              type="date"
              className="rounded-lg border border-gray-300 px-3 py-2"
              value={handbook.coverageEnd ?? ''}
              onChange={(e) => setHandbook({ ...handbook, coverageEnd: e.target.value })}
            />
          </label>
        </div>
        {!handbook.activeGuideId && (
          <p className="text-sm text-gray-500">Pick which pacing guide the sub should follow, so only that one shows up below.</p>
        )}
        {handbook.activeGuideId && handbook.coverageStart && handbook.coverageEnd && (
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            {coverageWeeks.length ? (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-brand-100 text-left">
                    <th className="border border-brand-200 px-2 py-2">Week Of</th>
                    <th className="border border-brand-200 px-2 py-2">Unit</th>
                    <th className="border border-brand-200 px-2 py-2 no-print">Lesson</th>
                  </tr>
                </thead>
                <tbody>
                  {coverageWeeks.map((week) => {
                    const lesson = lessons.find((l) => l.id === week.lessonId);
                    return (
                      <tr key={`${week.guideName}-${week.weekNumber}`}>
                        <td className="border border-brand-200 px-2 py-1 whitespace-nowrap">{week.startDate}</td>
                        <td className="border border-brand-200 px-2 py-1">{week.unit || '—'}</td>
                        <td className="border border-brand-200 px-2 py-1 no-print">
                          {lesson ? (
                            <Link to={`/library/${lesson.id}`} className="text-brand-700 hover:underline">
                              {lesson.title}
                            </Link>
                          ) : (
                            '—'
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-gray-500 p-4">
                No pacing guide weeks fall in that date range yet - use "Generate a Sub Lesson" or "Browse Sub-Friendly
                Lessons" above instead, or build a pacing guide under Pacing.
              </p>
            )}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-gray-900">Every Class, Every Day</h2>
        <p className="text-sm text-gray-500">
          This routine is built into every single lesson in the library, so it never changes no matter what unit
          you're teaching.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm font-semibold text-gray-800 mb-1.5">Arrival and Setup</p>
            <ul className="list-disc pl-5 text-sm space-y-1 text-gray-700">
              {STANDARD_ARRIVAL_SETUP.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-sm font-semibold text-gray-800 mb-1.5">Closure and Dismissal</p>
            <ul className="list-disc pl-5 text-sm space-y-1 text-gray-700">
              {STANDARD_CLOSURE.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-semibold text-gray-900">Class Schedule &amp; Duty</h2>
          <Link to="/settings" className="no-print inline-flex items-center gap-1 text-sm text-brand-700 hover:underline">
            Edit in Settings <ArrowRight size={14} />
          </Link>
        </div>
        {hasSchoolSchedule ? (
          <p className="text-sm text-gray-600">
            The full class schedule (times, grades, A/B/C/D day rotation) and duty info is set up under Settings →
            My Schedule, and will automatically fill in whenever a sub lesson is generated.
          </p>
        ) : (
          <InfoBox color="orange">
            No class schedule has been entered yet. Go to Settings → My Schedule and fill it in before you leave -
            it auto-fills into every generated sub lesson.
          </InfoBox>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Reference Documents</h2>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()} className="no-print">
            <Upload size={16} /> Upload
          </Button>
        </div>
        {resources.length ? (
          <div className="space-y-2">
            {resources.map((resource) => (
              <div key={resource.id} className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white p-3">
                <span className="text-sm text-gray-800 truncate">{resource.title}</span>
                <div className="flex items-center gap-3 shrink-0">
                  <a href={resource.dataUrl} download={resource.fileName} className="text-brand-700 hover:underline flex items-center gap-1 text-sm">
                    <Download size={14} /> Download
                  </a>
                  <button
                    onClick={async () => {
                      await deleteSubResource(resource.id);
                      setResources(await listSubResources());
                    }}
                    className="text-gray-400 hover:text-red-600 no-print"
                    aria-label="Delete resource"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No documents uploaded yet. Add rosters, seating charts, allergy/health notes, or anything else your sub
            should have on hand.
          </p>
        )}
      </section>
    </div>
  );
}
