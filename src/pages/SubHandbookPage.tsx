import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Trash2, Download, ArrowRight, Wand2, BookOpen, ShieldAlert } from 'lucide-react';
import type { SubHandbook, SubResource } from '../types/subHandbook';
import type { PacingGuide } from '../types/pacing';
import type { Lesson } from '../types/lesson';
import { STANDARD_ARRIVAL_SETUP, STANDARD_CLOSURE } from '../types/lesson';
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
  const [handbook, setHandbook] = useState<SubHandbook | null>(null);
  const [resources, setResources] = useState<SubResource[]>([]);
  const [guides, setGuides] = useState<PacingGuide[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [hasSchoolSchedule, setHasSchoolSchedule] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getSubHandbook().then(setHandbook);
    listSubResources().then(setResources);
    listPacingGuides().then(setGuides);
    listLessons().then(setLessons);
    getSchedule().then((s) => setHasSchoolSchedule(s.rows.length > 0));
  }, []);

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

  const coverageWeeks = guides
    .flatMap((g) => g.weeks.map((w) => ({ ...w, guideName: g.name })))
    .filter((w) => inRange(w.startDate, handbook.coverageStart, handbook.coverageEnd))
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

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

      {isUnfilled && (
        <InfoBox color="orange" title="Set this up once, then forget about it" className="no-print">
          Fill in the sections below - your welcome note, emergency procedures, and coverage dates. Once it's saved,
          this becomes the one link you hand to any substitute: everything they need is on this single page, in the
          order they need it.
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
          severe weather, or an injury.
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

      <section className="rounded-xl border-2 border-brand-300 bg-brand-50 p-4 space-y-3">
        <h2 className="font-semibold text-gray-900">Need a lesson right now?</h2>
        <p className="text-sm text-gray-600">
          If today's lesson isn't listed below, pick anything from the sub-friendly library - every one of these
          needs no PE-specific coaching or specialized equipment know-how.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link to="/library?subFriendly=true">
            <Button>
              <BookOpen size={16} /> Browse Sub-Friendly Lessons
            </Button>
          </Link>
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
        {handbook.coverageStart && handbook.coverageEnd && (
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
