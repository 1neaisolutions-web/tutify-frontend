import { useTranslation } from 'react-i18next';

export default function PasswordRequirements({ passwordValidation }) {
  const { t } = useTranslation();

  return (
    <div className='mt-1.5 w-full absolute max-w-[448px] z-30 top-9 rounded-md bg-gray-50  duration-300 ease-in-out border border-gray-200 px-4 py-3 text-sm text-gray-700'>
      <p className='mb-2 font-medium text-gray-800'>
        {t('password.requirements.title')}
      </p>
      <ul className='list-disc pl-5 space-y-1'>
        <li
          className={
            passwordValidation.length ? 'text-green-600' : 'text-red-500'
          }
        >
          {t('password.requirements.minLength')}
        </li>
        <li
          className={
            passwordValidation.upper ? 'text-green-600' : 'text-red-500'
          }
        >
          {t('password.requirements.uppercase')}
        </li>
        <li
          className={
            passwordValidation.number ? 'text-green-600' : 'text-red-500'
          }
        >
          {t('password.requirements.number')}
        </li>
        <li
          className={
            passwordValidation.specialChar ? 'text-green-600' : 'text-red-500'
          }
        >
          {t('password.requirements.specialChar')}
        </li>
      </ul>
    </div>
  );
}
