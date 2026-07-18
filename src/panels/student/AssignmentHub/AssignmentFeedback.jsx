import { useTranslation } from 'react-i18next';
import StudentStub from '../_shared/StudentStub';

const AssignmentFeedback = () => {
  const { t } = useTranslation();
  return <StudentStub name={t('studentPanel.assignments.feedback.title')} />;
};

export default AssignmentFeedback;
