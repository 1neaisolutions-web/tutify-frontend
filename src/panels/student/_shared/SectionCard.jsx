/**
 * Standardized card surface shared across student modules. `accent` draws the
 * sky-to-success gradient bar already used by components/shared/StatsCard, so
 * ad hoc modules stop inventing their own card treatment. `hero` is reserved for
 * milestone moments (onboarding finish, pack completion, first mastery win).
 */
const SectionCard = ({ accent = false, hero = false, className = '', children, as: Tag = 'div' }) => {
  return (
    <Tag
      className={`relative overflow-hidden rounded-xl border bg-white dark:bg-gray-950 ${
        hero
          ? 'border-primary-200 dark:border-primary-900 shadow-sm'
          : 'border-gray-200 dark:border-gray-800'
      } ${className}`}
    >
      {accent ? (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500/80 to-emerald-500/80" aria-hidden />
      ) : null}
      {children}
    </Tag>
  );
};

export default SectionCard;
