import { useState, useEffect } from 'react';

export const CustomAvatar = ({
  userName,
  role,
  reverse = false,
  avatarClass = '',
  userNameClass = '',
  noUrlNameClass = '',
  hideUsername = false,
  url,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageKey, setImageKey] = useState(0);

  const formatLabel = (key) => {
    return (
      key
        ?.split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ') || ''
    );
  };

  // Reset error state when URL changes to force image reload
  useEffect(() => {
    if (url) {
      setImageError(false);
      setImageKey(prev => prev + 1); // Force re-render with new key
    }
  }, [url]);

  const handleImageError = () => {
    setImageError(true);
  };

  // Always show avatar - either image or initials
  const showImage = url && !imageError;
  const initial = (() => {
    if (!userName || userName.trim() === '') return 'U';
    // Get first letter of first word (first name or username)
    const firstWord = userName.trim().split(' ')[0];
    return firstWord.charAt(0).toUpperCase();
  })();

  // Professional background color - using primary blue (#0284c7) or fallback to blue-500
  const avatarBgColor = showImage ? 'transparent' : '#0284c7'; // primary-600 from tailwind config

  const avatar = (
    <div
      className={`rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 ${showImage ? '' : 'bg-primary-600'} ${avatarClass || 'w-[30px] h-[30px]'}`}
      style={{
        ...(avatarClass ? {} : { width: '30px', height: '30px' }),
        backgroundColor: showImage ? 'transparent' : '#0284c7', // Force blue background when no image
        minWidth: avatarClass ? undefined : '30px',
        minHeight: avatarClass ? undefined : '30px',
      }}
    >
      {showImage ? (
        <img
          key={imageKey}
          src={url}
          alt={userName || 'User'}
          className="w-full h-full object-cover rounded-full"
          onError={handleImageError}
          loading="lazy"
        />
      ) : (
        <span 
          className="text-white font-semibold leading-none"
          style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            userSelect: 'none',
            lineHeight: '1',
            fontSize: avatarClass ? (noUrlNameClass ? undefined : '14px') : '14px',
          }}
        >
          {initial}
        </span>
      )}
    </div>
  );

  const userInfo = (
    <div className="flex flex-col leading-tight">
      <p className={`text-[14px] font-sans ${userNameClass}`}>
        {formatLabel(userName)}
      </p>
      <p className="text-[10px] font-normal text-muted font-sans break-words">
        {formatLabel(role)}
      </p>
    </div>
  );

  return (
    <div className="w-full flex justify-start">
      <div
        className={`flex items-start gap-1 font-sans ${
          reverse ? 'flex-row-reverse' : ''
        }`}
      >
        {avatar}
        {!hideUsername && userInfo}
      </div>
    </div>
  );
};
