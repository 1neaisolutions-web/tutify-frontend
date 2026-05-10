import { useMemo } from 'react';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const periods = ['09:00', '10:00', '11:00', '12:00', '14:00'];

const demo = {
  Mon: { '09:00': 'Math', '11:00': 'Biology', '14:00': 'English' },
  Tue: { '10:00': 'History', '12:00': 'Math', '14:00': 'Science' },
  Wed: { '09:00': 'English', '11:00': 'Math', '12:00': 'Biology' },
  Thu: { '10:00': 'Science', '11:00': 'History', '14:00': 'Math' },
  Fri: { '09:00': 'Biology', '12:00': 'English', '14:00': 'Clubs' },
};

const StudentTimetable = () => {
  const nextClass = useMemo(() => {
    const now = new Date();
    const todayIdx = (now.getDay() + 6) % 7; // Mon=0
    const dayKey = days[todayIdx] || 'Mon';
    const today = demo[dayKey] || {};
    const next = periods
      .map((t) => ({ t, name: today[t] }))
      .find((p) => p.name && new Date(`${now.toDateString()} ${p.t}`).getTime() > now.getTime());
    return next ? { day: dayKey, time: next.t, name: next.name } : null;
  }, []);

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Timetable</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">Weekly view (demo data).</p>
      </div>

      <div className="px-6 py-6 space-y-4">
        {nextClass ? (
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-primary-50 dark:bg-primary-950/30 p-4">
            <p className="text-sm text-primary-800 dark:text-primary-200">
              Next class: <span className="font-semibold">{nextClass.name}</span> • {nextClass.day} {nextClass.time}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 text-sm text-gray-700 dark:text-gray-200">
            No upcoming class today (demo schedule).
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
          <table className="min-w-[720px] w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/40">
              <tr>
                <th className="text-left px-3 py-2 text-gray-600 dark:text-gray-300">Time</th>
                {days.map((d) => (
                  <th key={d} className="text-left px-3 py-2 text-gray-600 dark:text-gray-300">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((t) => (
                <tr key={t} className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-3 py-3 text-gray-600 dark:text-gray-300">{t}</td>
                  {days.map((d) => (
                    <td key={d} className="px-3 py-3">
                      {demo[d]?.[t] ? (
                        <span className="inline-flex items-center rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 px-2 py-1 text-gray-800 dark:text-gray-100">
                          {demo[d][t]}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentTimetable;

