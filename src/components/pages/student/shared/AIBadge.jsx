import { useTranslation } from 'react-i18next';
import StatusBadge from './StatusBadge';

const AIBadge = ({ label }) => {
  const { t } = useTranslation();
  return <StatusBadge label={label ?? t('student.badge.aiDefault')} tone="violet" />;
};

export default AIBadge;
