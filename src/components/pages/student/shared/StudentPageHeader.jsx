const StudentPageHeader = ({ title, subtitle, right }) => {
  return (
    <div className="w-full flex items-start justify-between gap-4 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
      <div>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{subtitle}</p> : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
};

export default StudentPageHeader;

