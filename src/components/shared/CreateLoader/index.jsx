import { CircularProgress } from "@mui/material"
import { useTranslation } from 'react-i18next';

export const CreateLoader = () => {
    const { t } = useTranslation();

    return (
        <div className="flex justify-center items-center h-full bg-black/30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full z-[100]">

            <div className="flex items-center gap-2 bg-white p-4 rounded-md">
                <CircularProgress className="!size-5" />
                <p className="text-black text-sm">{t('common.loading')}</p>
            </div>
        </div>
    )
}
