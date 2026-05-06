export const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-950 dark:to-gray-900 px-4 py-12">
      <div className="max-w-md w-full">
        {children}
      </div>
    </div>
  );
};

