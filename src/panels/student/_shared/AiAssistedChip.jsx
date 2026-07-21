/**
 * Visible AI-assisted affordance for generated student content.
 */
const AiAssistedChip = ({ label = 'AI-assisted', confidence }) => {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 text-xs font-medium text-sky-800 dark:text-sky-200">
      <span className="h-1.5 w-1.5 rounded-full bg-sky-500" aria-hidden />
      {label}
      {typeof confidence === 'number' ? (
        <span className="text-sky-600/80 dark:text-sky-300/80">· {Math.round(confidence * 100)}% conf.</span>
      ) : null}
    </span>
  );
};

export default AiAssistedChip;
