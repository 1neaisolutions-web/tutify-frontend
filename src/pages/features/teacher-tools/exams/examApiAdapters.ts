import type { ExamApiItem, ExamMcqApi, ExamShortApi, ExamLongApi } from '../../../../api/examApi'
import type { ExamMcqStub, ExamShortStub, ExamLongStub } from './demo/examQuestionStubs'
import type { ExamSectionStub } from '../demo/generationFromSources'

export type LocalMcq = ExamMcqStub & { _id: string }
export type LocalShort = ExamShortStub & { _id: string }
export type LocalLong = ExamLongStub & { _id: string }
export type LocalSection = ExamSectionStub & { _id: string }

export function apiToLocalMcq(q: ExamMcqApi): LocalMcq {
  return { id: q.id, _id: q.id, stem: q.stem, options: q.options }
}

export function apiToLocalShort(q: ExamShortApi): LocalShort {
  return { id: q.id, _id: q.id, stem: q.stem }
}

export function apiToLocalLong(q: ExamLongApi): LocalLong {
  return { id: q.id, _id: q.id, stem: q.stem, subparts: q.subparts }
}

export function apiToLocalSection(s: ExamApiItem['sections'][0]): LocalSection {
  return {
    id: s.id,
    _id: s.id,
    title: s.title,
    marks: s.marks,
    description: s.description ?? '',
  }
}

export function hydrateFromApi(exam: ExamApiItem) {
  return {
    title: exam.title,
    subject: exam.subject,
    grade: exam.grade,
    examType: exam.examType,
    term: exam.term,
    internationalStandard: exam.internationalStandard,
    durationMinutes: exam.durationMinutes,
    scheduleStart: exam.scheduleStart ?? null,
    scheduleEnd: exam.scheduleEnd ?? null,
    classes: exam.classes,
    paper: exam.paper,
    sections: exam.sections.map(apiToLocalSection),
    mcqs: exam.mcqs.map(apiToLocalMcq),
    shorts: exam.shorts.map(apiToLocalShort),
    longs: exam.longs.map(apiToLocalLong),
    sectionTargetCount: exam.sectionTargetCount,
    handoutLayout: exam.handoutLayout,
    completionPct: exam.completionPct,
  }
}
