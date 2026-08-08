import type { Lesson } from '../../types/lesson';
import type { WarmUp } from '../../types/warmup';
import type { ScheduleSettings } from '../../types/schedule';
import { gradeLabel } from '../../types/common';
import { buildTimeCheckTable, totalRequiredMinutes } from '../../lib/timeCheck';
import { InfoBox } from '../boxes/InfoBox';
import { EquipmentList } from './EquipmentList';
import { GradeModifications } from './GradeModifications';
import { TechniqueCues } from './TechniqueCues';
import { NumberOneRule } from './NumberOneRule';
import { TimeCheckTable } from './TimeCheckTable';
import { ScheduleTable } from './ScheduleTable';
import { HalfGymAlert } from './HalfGymAlert';
import { SpecialCircumstanceNote } from './SpecialCircumstanceNote';
import { NCStandardsPanel } from './NCStandardsPanel';
import { AdaptationsPanel } from './AdaptationsPanel';
import { CrossCurricularPanel } from './CrossCurricularPanel';
import { AssessmentPanel } from './AssessmentPanel';
import { DiagramSVG } from './DiagramSVG';

interface LessonViewProps {
  lesson: Lesson;
  warmUp?: WarmUp;
  schedule?: ScheduleSettings;
}

export function LessonView({ lesson, warmUp, schedule }: LessonViewProps) {
  const timeCheckRows = buildTimeCheckTable(lesson, warmUp?.name);
  const totalMinutes = totalRequiredMinutes(lesson);

  return (
    <article className="space-y-6 print:text-black">
      {lesson.gymSpace === 'half' && <HalfGymAlert reason={lesson.halfGymReason} />}

      <h1 className="text-2xl font-bold text-center text-gray-900">{lesson.title || 'Untitled Lesson'}</h1>

      {schedule && schedule.rows.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold border-b pb-1">Schedule</h2>
          <ScheduleTable schedule={schedule} />
          {(schedule.morningDuty || schedule.afternoonDuty) && (
            <div className="text-sm space-y-1">
              {schedule.morningDuty && (
                <p>
                  <span className="font-semibold">Morning Duty:</span> {schedule.morningDuty}
                </p>
              )}
              {schedule.afternoonDuty && (
                <p>
                  <span className="font-semibold">Afternoon Duty:</span> {schedule.afternoonDuty}
                </p>
              )}
            </div>
          )}
        </section>
      )}

      <SpecialCircumstanceNote note={lesson.specialCircumstances} />

      <section className="space-y-1 text-sm">
        <p>
          <span className="font-semibold">Grade Levels:</span> {lesson.gradeLevels.map(gradeLabel).join(', ') || '—'}
        </p>
        <p>
          <span className="font-semibold">Gym Space:</span> {lesson.gymSpace === 'half' ? 'Half Gym' : 'Full Gym'}
        </p>
      </section>

      <EquipmentList items={lesson.equipment} />

      <GradeModifications mods={lesson.gradeModifications} />

      <TechniqueCues cues={lesson.techniqueCues} />

      <NumberOneRule rule={lesson.numberOneRule} />

      <section className="space-y-1">
        <h2 className="text-lg font-semibold border-b pb-1">Arrival and Setup (5 minutes)</h2>
        <ul className="list-disc pl-5 text-sm space-y-0.5">
          {lesson.arrivalSetup.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold border-b pb-1">
          Warm-Up{lesson.warmUpMinutes ? ` (${lesson.warmUpMinutes} minutes)` : ''}
        </h2>
        {warmUp ? (
          <div className="space-y-2 text-sm">
            <p className="font-semibold">{warmUp.name}</p>
            <p>{warmUp.description}</p>
            <ul className="list-disc pl-5 space-y-0.5">
              {warmUp.rules.map((rule, i) => (
                <li key={i}>{rule}</li>
              ))}
            </ul>
            {warmUp.restZoneRule && <InfoBox color="green">{warmUp.restZoneRule}</InfoBox>}
            {warmUp.reminderQuote && (
              <InfoBox color="orange">
                Remind students: <em>"{warmUp.reminderQuote}"</em>
              </InfoBox>
            )}
          </div>
        ) : lesson.customWarmUpName ? (
          <div className="text-sm space-y-1">
            <p className="font-semibold">{lesson.customWarmUpName}</p>
            <p>{lesson.customWarmUpDescription}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No warm-up selected.</p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold border-b pb-1">Main Activities</h2>
        {lesson.mainActivities.map((activity) => (
          <div key={activity.id} className="text-sm">
            <p className="font-semibold">
              {activity.name} <span className="text-gray-500 font-normal">({activity.minutes} minutes)</span>
            </p>
            {activity.description && <p className="text-gray-700">{activity.description}</p>}
          </div>
        ))}
        {lesson.mainActivities.length === 0 && <p className="text-sm text-gray-500">No main activities added yet.</p>}
      </section>

      {lesson.optionalActivities.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold border-b pb-1">Optional / If Time Allows</h2>
          {lesson.optionalActivities.map((activity) => (
            <div key={activity.id} className="text-sm">
              <p className="font-semibold">{activity.name}</p>
              {activity.description && <p className="text-gray-700">{activity.description}</p>}
            </div>
          ))}
        </section>
      )}

      {lesson.diagramNotes && (
        <section className="space-y-1">
          <h2 className="text-lg font-semibold border-b pb-1">Setup / Diagram Notes</h2>
          {lesson.diagramType && <DiagramSVG variant={lesson.diagramType} />}
          <p className="text-sm text-gray-700">{lesson.diagramNotes}</p>
        </section>
      )}

      {lesson.needsMusic && (
        <p className="text-sm italic text-gray-600">Music (you can play from your phone).</p>
      )}

      <section className="space-y-1">
        <h2 className="text-lg font-semibold border-b pb-1">Closure and Dismissal (5 minutes)</h2>
        <ul className="list-disc pl-5 text-sm space-y-0.5">
          {lesson.closure.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </section>

      <section>
        <TimeCheckTable rows={timeCheckRows} totalMinutes={totalMinutes} />
      </section>

      <div className="pt-4 border-t-2 border-dashed border-gray-200 space-y-6">
        <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
          Beyond the lesson plan - standards, inclusion &amp; assessment
        </p>
        <NCStandardsPanel standards={lesson.standardsByGrade} />
        <AdaptationsPanel accommodations={lesson.accommodations} />
        <CrossCurricularPanel links={lesson.crossCurricular} />
        <AssessmentPanel lesson={lesson} />
      </div>
    </article>
  );
}
