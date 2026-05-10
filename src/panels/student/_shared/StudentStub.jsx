import { ComingSoon } from '../../../components/shared/ComingSoon';

const StudentStub = ({ name = 'Student Module' }) => {
  return (
    <div className="min-h-screen w-full">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{name}</h1>
      </div>
      <ComingSoon />
    </div>
  );
};

export default StudentStub;

