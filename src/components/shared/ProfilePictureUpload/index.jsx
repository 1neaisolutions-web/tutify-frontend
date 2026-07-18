import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomAvatar, CustomButton } from '../index';
import ImageIcon from '@mui/icons-material/Image';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export const ProfilePictureUpload = ({
  firstName,
  currentImageUrl = null,
  value = null,
  onChange,
  onRemove,
  showRemoveButton = false,
  error = false,
  errorMsg = '',
  disabled = false,
  label,
  avatarSize = 'w-24 h-24 md:w-28 md:h-28',
  accept = '.jpg,.jpeg,.png,.webp',
  maxSizeMB = 5,
}) => {
  const { t } = useTranslation();
  const resolvedLabel = label ?? t('shared.profilePicture.defaultLabel');
  const resolvedFirstName = firstName ?? t('shared.profilePicture.defaultUser');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (value) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [value]);

  useEffect(() => {
    if (value) {
      setUploadError('');
    }
  }, [value]);

  const displayImageUrl = previewUrl || currentImageUrl;
  const hasImage = !!displayImageUrl;

  const validateFile = (file) => {
    if (!file) return { valid: false, error: t('shared.profilePicture.errors.noFile') };

    const allowedTypes = accept.split(',').map(type => type.trim().toLowerCase());
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

    if (!allowedTypes.includes(fileExtension)) {
      return {
        valid: false,
        error: t('shared.profilePicture.errors.invalidType', {
          formats: accept.replace(/\./g, '').toUpperCase(),
        }),
      };
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        valid: false,
        error: t('shared.profilePicture.errors.tooLarge', {
          max: maxSizeMB,
          current: (file.size / 1024 / 1024).toFixed(2),
        }),
      };
    }

    if (!file.type.startsWith('image/')) {
      return {
        valid: false,
        error: t('shared.profilePicture.errors.notImage'),
      };
    }

    return { valid: true, error: '' };
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setUploadError('');
      return;
    }

    const validation = validateFile(file);

    if (!validation.valid) {
      setUploadError(validation.error);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setUploadError('');
    setIsUploading(true);

    setTimeout(() => {
      setIsUploading(false);
      if (onChange) {
        onChange(e);
      }
    }, 300);
  };

  const handleAvatarClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    e.preventDefault();

    setPreviewUrl(null);
    setUploadError('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    if (onRemove) {
      onRemove();
    }
  };

  const displayError = error && errorMsg ? errorMsg : uploadError;

  return (
    <div className='w-full'>
      <label className='text-sm font-medium text-input-title mb-4 block'>
        {resolvedLabel}
      </label>

      <div className='flex flex-col sm:flex-row items-center sm:items-center gap-6'>
        <div className='flex-shrink-0 relative'>
          <div
            className={`relative group ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
            onMouseEnter={() => !disabled && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleAvatarClick}
          >
            <div className='relative'>
              <div className={`${avatarSize} ${isHovered && !disabled ? 'ring-2 ring-primary ring-offset-2 scale-105' : ''} ${isUploading ? 'opacity-70' : ''} transition-all duration-200 rounded-full overflow-hidden border-2 border-gray-200`}>
                <CustomAvatar
                  userName={resolvedFirstName}
                  hideUsername={true}
                  avatarClass="w-full h-full"
                  noUrlNameClass='text-3xl md:text-4xl leading-none font-semibold'
                  url={displayImageUrl}
                />
              </div>

              {isUploading && (
                <div className='absolute inset-0 bg-black/30 rounded-full flex items-center justify-center'>
                  <div className='animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent' />
                </div>
              )}

              {!disabled && !isUploading && (
                <div
                  className={`absolute inset-0 bg-black/50 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <ImageIcon
                    sx={{ fontSize: 28, color: 'white' }}
                    className='drop-shadow-lg'
                  />
                </div>
              )}
            </div>

            {hasImage && !disabled && !isUploading && (
              <div className='absolute bottom-1 right-1 bg-primary rounded-full w-5 h-5 shadow-md border-2 border-white z-10 flex items-center justify-center'>
                <ImageIcon sx={{ fontSize: 12, color: 'white' }} />
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type='file'
            name='userImage'
            accept={accept}
            onChange={handleFileChange}
            disabled={disabled || isUploading}
            style={{ display: 'none' }}
            aria-label={t('shared.profilePicture.ariaLabel')}
            tabIndex={-1}
          />
        </div>

        <div className='flex flex-col gap-2.5 w-full sm:w-auto'>
          <CustomButton
            type='button'
            onClick={handleAvatarClick}
            disabled={disabled || isUploading}
            loading={isUploading}
            className='!bg-primary !text-white hover:!bg-primary-dark !font-medium !px-4 !py-0.5 !rounded-md !text-sm !transition-all !w-full sm:!w-auto !shadow-sm hover:!shadow-md !h-8'
            startIcon={isUploading ? null : <CloudUploadIcon sx={{ fontSize: 18 }} />}
          >
            {isUploading
              ? t('shared.profilePicture.actions.uploading')
              : hasImage
                ? t('shared.profilePicture.actions.change')
                : t('shared.profilePicture.actions.upload')
            }
          </CustomButton>

          {showRemoveButton && hasImage && !disabled && !isUploading && (
            <CustomButton
              type='button'
              variant='outlined'
              onClick={handleRemove}
              className='!text-sm !text-danger !border-danger hover:!bg-danger/10 !font-medium !px-4 !py-0.5 !rounded-md !transition-all !w-full sm:!w-auto !shadow-sm hover:!shadow-md !h-8'
              startIcon={<DeleteIcon sx={{ fontSize: 16 }} />}
            >
              {t('shared.profilePicture.actions.remove')}
            </CustomButton>
          )}

          {displayError && (
            <div className='bg-danger/10 border border-danger/20 rounded-md p-2 mt-1'>
              <p className='text-xs text-danger font-medium'>
                {displayError}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureUpload;
