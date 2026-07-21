import { useNavigate } from 'react-router-dom';

/**
 * Consistent empty-state CTA for student modules.
 */
const StudentEmptyState = ({
  title,
  subtitle,
  ctaLabel,
  ctaPath,
  onCta,
}) => {
  const navigate = useNavigate();

  const handleCta = () => {
    if (onCta) onCta();
    else if (ctaPath) navigate(ctaPath);
  };

  return (
    <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/40 px-6 py-10 text-center">
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
      {subtitle ? (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto">{subtitle}</p>
      ) : null}
      {ctaLabel && (ctaPath || onCta) ? (
        <button
          type="button"
          onClick={handleCta}
          className="mt-5 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 text-sm font-medium"
        >
          {ctaLabel}
        </button>
      ) : null}
    </div>
  );
};

export default StudentEmptyState;
