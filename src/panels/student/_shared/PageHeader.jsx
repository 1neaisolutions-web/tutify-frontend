/**
 * Standardized student-module header: eyebrow label, title, subtitle, optional
 * right-aligned primary stat/CTA slot. Replaces each module's bespoke <h1> block
 * so every module opens with the same visual hierarchy.
 */
const PageHeader = ({ eyebrow, title, subtitle, right, children }) => {
  return (
    <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-1">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 max-w-2xl">{subtitle}</p>
          ) : null}
        </div>
        {right ? <div className="flex-shrink-0">{right}</div> : null}
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
};

export default PageHeader;
