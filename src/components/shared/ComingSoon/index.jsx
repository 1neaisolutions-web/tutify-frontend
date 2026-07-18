import { useTranslation } from 'react-i18next';

export const ComingSoon = () => {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col justify-center items-center h-screen w-full'>
      <h4 className='font-bold'>{t('common.comingSoon')}</h4>
      <p className='mt-2 text-gray-600 text-sm'>{t('common.comingSoonHint')}</p>
    </div>
  );
};
