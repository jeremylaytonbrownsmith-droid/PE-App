import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Lesson } from '../types/lesson';
import { getLesson, saveLesson, createBlankLesson } from '../lib/lessonStore';
import { PageHeader } from '../components/layout/PageHeader';
import { FormSection } from '../components/forms/FormSection';
import { GradeSelector } from '../components/forms/GradeSelector';
import { ListEditor } from '../components/forms/ListEditor';
import { ActivityListEditor } from '../components/forms/ActivityListEditor';
import { EquipmentEditor } from '../components/forms/EquipmentEditor';
import { GradeModEditor } from '../components/forms/GradeModEditor';
import { WarmUpPicker } from '../components/forms/WarmUpPicker';
import { Button } from '../components/ui/Button';

export function LessonEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [lesson, setLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (id) {
      getLesson(id).then((found) => setLesson(found ?? createBlankLesson()));
    } else {
      setLesson(createBlankLesson());
    }
  }, [id]);

  if (!lesson) return <p className="text-gray-400">Loading...</p>;

  function patch(update: Partial<Lesson>) {
    setLesson((prev) => (prev ? { ...prev, ...update } : prev));
  }

  async function handleSave() {
    if (!lesson) return;
    await saveLesson(lesson);
    navigate(`/library/${lesson.id}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? 'Edit Lesson' : 'New Lesson'}
        back
        actions={
          <>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!lesson.title.trim()}>
              Save Lesson
            </Button>
          </>
        }
      />

      <div className="rounded-xl border border-gray-200 bg-white p-5 md:p-8 space-y-6">
        <FormSection title="Title & Unit">
          <input
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            placeholder="Lesson title (e.g. Soccer / Handball Goal Games)"
            value={lesson.title}
            onChange={(e) => patch({ title: e.target.value })}
          />
          <input
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            placeholder="Unit / sport (e.g. Soccer)"
            value={lesson.unit}
            onChange={(e) => patch({ unit: e.target.value })}
          />
        </FormSection>

        <FormSection title="Grade Levels">
          <GradeSelector value={lesson.gradeLevels} onChange={(gradeLevels) => patch({ gradeLevels })} />
        </FormSection>

        <FormSection title="Gym Space">
          <div className="flex gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked={lesson.gymSpace === 'full'} onChange={() => patch({ gymSpace: 'full' })} />
              Full Gym
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" checked={lesson.gymSpace === 'half'} onChange={() => patch({ gymSpace: 'half' })} />
              Half Gym
            </label>
          </div>
          {lesson.gymSpace === 'half' && (
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="Reason (e.g. stage in use for a school event)"
              value={lesson.halfGymReason ?? ''}
              onChange={(e) => patch({ halfGymReason: e.target.value })}
            />
          )}
        </FormSection>

        <FormSection title="Special Circumstances" description="Shown as a blue note, e.g. integrated testing schedule.">
          <input
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            placeholder="Optional note"
            value={lesson.specialCircumstances ?? ''}
            onChange={(e) => patch({ specialCircumstances: e.target.value })}
          />
        </FormSection>

        <FormSection title="Equipment Needed">
          <EquipmentEditor items={lesson.equipment} onChange={(equipment) => patch({ equipment })} />
        </FormSection>

        <FormSection title="Grade Modifications">
          <GradeModEditor mods={lesson.gradeModifications} onChange={(gradeModifications) => patch({ gradeModifications })} />
        </FormSection>

        <FormSection title="Key Technique Cues">
          <ListEditor items={lesson.techniqueCues} onChange={(techniqueCues) => patch({ techniqueCues })} addLabel="Add Cue" />
        </FormSection>

        <FormSection title="Number One Rule" description="The one safety rule shown in a yellow box.">
          <input
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            value={lesson.numberOneRule}
            onChange={(e) => patch({ numberOneRule: e.target.value })}
          />
        </FormSection>

        <FormSection title="Arrival and Setup">
          <ListEditor items={lesson.arrivalSetup} onChange={(arrivalSetup) => patch({ arrivalSetup })} addLabel="Add Step" />
        </FormSection>

        <FormSection title="Warm-Up">
          <WarmUpPicker
            warmUpId={lesson.warmUpId}
            customName={lesson.customWarmUpName}
            customDescription={lesson.customWarmUpDescription}
            minutes={lesson.warmUpMinutes}
            onChange={(patchValue) =>
              patch({
                warmUpId: 'warmUpId' in patchValue ? patchValue.warmUpId : lesson.warmUpId,
                customWarmUpName: patchValue.customName ?? lesson.customWarmUpName,
                customWarmUpDescription: patchValue.customDescription ?? lesson.customWarmUpDescription,
                warmUpMinutes: patchValue.minutes ?? lesson.warmUpMinutes,
              })
            }
          />
        </FormSection>

        <FormSection title="Main Activities">
          <ActivityListEditor activities={lesson.mainActivities} onChange={(mainActivities) => patch({ mainActivities })} />
        </FormSection>

        <FormSection title="Optional / If Time Allows">
          <ActivityListEditor activities={lesson.optionalActivities} onChange={(optionalActivities) => patch({ optionalActivities })} />
        </FormSection>

        <FormSection title="Closure and Dismissal">
          <ListEditor items={lesson.closure} onChange={(closure) => patch({ closure })} addLabel="Add Step" />
        </FormSection>

        <FormSection title="Setup / Diagram Notes" description="Optional description of court or goal setup.">
          <textarea
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            rows={2}
            value={lesson.diagramNotes ?? ''}
            onChange={(e) => patch({ diagramNotes: e.target.value })}
          />
        </FormSection>

        <FormSection title="Tags">
          <input
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
            placeholder="Comma-separated tags (e.g. soccer, full gym)"
            value={lesson.tags.join(', ')}
            onChange={(e) =>
              patch({
                tags: e.target.value
                  .split(',')
                  .map((t) => t.trim())
                  .filter(Boolean),
              })
            }
          />
        </FormSection>

        <FormSection title="Music">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={Boolean(lesson.needsMusic)} onChange={(e) => patch({ needsMusic: e.target.checked })} />
            This lesson uses music (play from your phone)
          </label>
        </FormSection>
      </div>
    </div>
  );
}
