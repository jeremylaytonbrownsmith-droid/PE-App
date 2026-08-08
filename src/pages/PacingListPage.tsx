import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import type { PacingGuide } from '../types/pacing';
import { listPacingGuides, savePacingGuide, deletePacingGuide, createPacingGuide } from '../lib/pacingStore';
import { PageHeader } from '../components/layout/PageHeader';
import { EmptyState } from '../components/layout/EmptyState';
import { Button } from '../components/ui/Button';

const currentSchoolYear = (() => {
  const now = new Date();
  const y = now.getFullYear();
  return now.getMonth() >= 6 ? `${y}-${y + 1}` : `${y - 1}-${y}`;
})();

export function PacingListPage() {
  const navigate = useNavigate();
  const [guides, setGuides] = useState<PacingGuide[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [schoolYear, setSchoolYear] = useState(currentSchoolYear);
  const [grade, setGrade] = useState('K-5');
  const [startDate, setStartDate] = useState(`${currentSchoolYear.slice(0, 4)}-08-15`);
  const [numWeeks, setNumWeeks] = useState(36);

  useEffect(() => {
    listPacingGuides().then(setGuides);
  }, []);

  async function handleCreate() {
    const guide = createPacingGuide(name || `${grade} Pacing Guide`, schoolYear, grade, startDate, numWeeks);
    await savePacingGuide(guide);
    navigate(`/pacing/${guide.id}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pacing Guides"
        subtitle="Lay out your whole year, week by week."
        actions={
          <Button onClick={() => setShowForm((v) => !v)}>
            <Plus size={16} /> New Pacing Guide
          </Button>
        }
      />

      {showForm && (
        <div className="rounded-xl border border-brand-200 bg-brand-50 p-4 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="text-sm space-y-1">
              <span className="font-medium text-gray-700">Name</span>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="e.g. K-5 PE Pacing Guide"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="text-sm space-y-1">
              <span className="font-medium text-gray-700">School Year</span>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                value={schoolYear}
                onChange={(e) => setSchoolYear(e.target.value)}
              />
            </label>
            <label className="text-sm space-y-1">
              <span className="font-medium text-gray-700">Grade / Group</span>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              />
            </label>
            <label className="text-sm space-y-1">
              <span className="font-medium text-gray-700">First Week Start Date</span>
              <input
                type="date"
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
            <label className="text-sm space-y-1">
              <span className="font-medium text-gray-700">Number of Weeks</span>
              <input
                type="number"
                min={1}
                max={52}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                value={numWeeks}
                onChange={(e) => setNumWeeks(Number(e.target.value))}
              />
            </label>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create</Button>
          </div>
        </div>
      )}

      {guides.length ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {guides.map((guide) => (
            <div key={guide.id} className="rounded-xl border border-gray-200 bg-white p-4 flex items-start justify-between gap-2">
              <Link to={`/pacing/${guide.id}`} className="flex-1">
                <h3 className="font-semibold text-gray-900">{guide.name}</h3>
                <p className="text-sm text-gray-500">
                  {guide.grade} · {guide.schoolYear} · {guide.weeks.length} weeks
                </p>
              </Link>
              <button
                onClick={async () => {
                  if (confirm('Delete this pacing guide?')) {
                    await deletePacingGuide(guide.id);
                    setGuides(await listPacingGuides());
                  }
                }}
                className="text-gray-400 hover:text-red-600"
                aria-label="Delete pacing guide"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        !showForm && <EmptyState title="No pacing guides yet" description="Create one to plan your school year, week by week." />
      )}
    </div>
  );
}
