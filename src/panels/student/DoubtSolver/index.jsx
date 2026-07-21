import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { MAYA_SUBJECTS } from '../data/mayaChenDemoData';
import { readJson, writeJson } from '../utils/studentStorage';
import PageHeader from '../_shared/PageHeader';
import SectionCard from '../_shared/SectionCard';
import FadeIn from '../_shared/FadeIn';

const DOUBT_SESSIONS_KEY = 'tutify_student_doubt_sessions_v1';

const DoubtSolver = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const preselectSubjectId = location.state?.subjectId;
  const preselect = MAYA_SUBJECTS.find((s) => s.id === preselectSubjectId);

  const [problem, setProblem] = useState(location.state?.prefillProblem || '');
  const [subjectId, setSubjectId] = useState(preselect?.id || MAYA_SUBJECTS[0].id);

  const subject = MAYA_SUBJECTS.find((s) => s.id === subjectId) || MAYA_SUBJECTS[0];

  const start = () => {
    const p = problem.trim();
    if (!p) return;
    const id = `ds_${Date.now()}`;
    const payload = {
      id,
      problem: p,
      subject: subject.name,
      subjectId: subject.id,
      createdAt: new Date().toISOString(),
    };
    const list = readJson(DOUBT_SESSIONS_KEY, []);
    writeJson(DOUBT_SESSIONS_KEY, [payload, ...(Array.isArray(list) ? list : [])].slice(0, 30));
    navigate(`/student/doubt-solver/${id}`);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-950">
      <PageHeader eyebrow="Doubt Solver" title={t('studentPanel.doubtSolver.title')} subtitle={t('studentPanel.doubtSolver.subtitle')} />

      <div className="px-6 py-6 max-w-3xl">
        <FadeIn>
          <SectionCard accent className="p-5 space-y-4">
            <div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('studentPanel.doubtSolver.fields.subject')}</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {MAYA_SUBJECTS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSubjectId(s.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      s.id === subjectId
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('studentPanel.doubtSolver.fields.question')}</span>
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                className="mt-1 w-full min-h-[140px] rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-900 outline-none transition-shadow"
                placeholder={t('studentPanel.doubtSolver.placeholder')}
              />
            </label>
            {subject.id === 'algebra-ii' ? (
              <p className="text-xs text-gray-500">
                Tip: try a Logarithms or Factoring question — Doubt Solver has step-by-step coverage for both.
              </p>
            ) : null}
            <button
              type="button"
              onClick={start}
              disabled={!problem.trim()}
              className="w-full px-4 py-2.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 font-medium transition-colors"
            >
              Solve
            </button>
          </SectionCard>
        </FadeIn>
      </div>
    </div>
  );
};

export default DoubtSolver;
