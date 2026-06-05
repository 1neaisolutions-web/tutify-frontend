import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Bell,
  Mail,
  LogOut,
  User,
  Settings,
  Coins,
  ChevronDown,
  Zap,
} from 'lucide-react';

import { useStoreData } from '../../../hooks/useStoreData';
import { logoutUser, logoutUserAPI } from '../../../redux/features/auth/authSlice';
import { fetchCreditBalance } from '../../../redux/features/subscription/subscriptionSlice';
import { setAuthToken } from '../../../redux/http';
import { CustomAvatar } from '../CustomAvatar';
import { baseURL } from '../../../redux/constant';
import { creditBalanceUiPercents } from '../../../utils/creditBalanceUi';
import { formatDate, formatNumber } from '../../../lib/i18n/format';
import ActivateCreditsModal from '../../ActivateCreditsModal';

const headerMessages = [];
const headerNotifications = [];

const DropdownEmptyState = ({ icon: Icon, title, hint }) => (
  <div className="px-4 py-10 text-center">
    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
      <Icon className="h-6 w-6 text-gray-400" />
    </div>
    <p className="text-sm font-medium text-gray-900">{title}</p>
    <p className="mt-1 text-xs text-gray-500">{hint}</p>
  </div>
);

const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

export const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useStoreData();
  const { profileDetails } = useSelector((state) => state.auth);
  const subscription = useSelector((state) => state.subscription);

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [messagesDropdownOpen, setMessagesDropdownOpen] = useState(false);
  const [notificationsDropdownOpen, setNotificationsDropdownOpen] = useState(false);
  const [activateModalOpen, setActivateModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const messagesTimeoutRef = useRef(null);
  const notificationsTimeoutRef = useRef(null);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    if (user?.token) {
      dispatch(fetchCreditBalance());
    }
  }, [user?.token, user?.id, dispatch]);

  useClickOutside(profileDropdownRef, () => {
    if (profileDropdownOpen) setProfileDropdownOpen(false);
  });

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setProfileDropdownOpen(false);

    try {
      if (user?.refresh_token) {
        try {
          await dispatch(logoutUserAPI(user.refresh_token)).unwrap();
        } catch (apiError) {
          console.warn('Logout API failed, clearing local state:', apiError);
        }
      }
      dispatch(logoutUser());
      try {
        localStorage.removeItem('access_token');
        localStorage.removeItem('persist:root');
        setAuthToken(null);
      } catch (e) {
        console.warn('Failed to clear localStorage:', e);
      }
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Logout error:', err);
      dispatch(logoutUser());
      navigate('/login', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const profilePictureUrl = (() => {
    const urlValue = profileDetails?.profile_picture_url || user?.profile_picture_url;
    if (!urlValue || !String(urlValue).trim()) return null;
    if (urlValue.startsWith('http')) return urlValue;
    if (urlValue.startsWith('/')) return `${baseURL}${urlValue}`;
    return `${baseURL}/static/profile_pictures/${urlValue}`;
  })();

  const displayName =
    profileDetails?.username ||
    profileDetails?.full_name ||
    (profileDetails?.first_name || profileDetails?.last_name
      ? `${profileDetails.first_name || ''} ${profileDetails.last_name || ''}`.trim()
      : null) ||
    user?.username ||
    user?.full_name ||
    (user?.first_name || user?.last_name
      ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
      : null) ||
    profileDetails?.email?.split('@')[0] ||
    user?.email?.split('@')[0] ||
    t('layout.defaultUser');

  const renderCredits = () => {
    const bal = subscription.balance ?? 0;
    const total = subscription.totalAllocated ?? 0;
    const { ratio, barWidthPct, labelPct } = creditBalanceUiPercents(bal, total);
    const hasCredits = subscription.hasActiveCredits;

    if (!hasCredits && !subscription.loading) {
      return (
        <button
          type="button"
          onClick={() => setActivateModalOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-500 hover:border-primary-300 hover:text-primary-600 transition"
        >
          <Coins className="h-4 w-4" />
          {t('layout.activateCredits')}
        </button>
      );
    }

    const barColor =
      ratio > 0.5
        ? 'from-emerald-400 to-teal-500'
        : ratio > 0.2
          ? 'from-amber-400 to-orange-500'
          : 'from-red-400 to-rose-500';
    const bgColor =
      ratio > 0.5
        ? 'from-emerald-50 to-teal-50'
        : ratio > 0.2
          ? 'from-amber-50 to-orange-50'
          : 'from-red-50 to-rose-50';
    const iconColor =
      ratio > 0.5
        ? 'bg-emerald-100 text-emerald-600'
        : ratio > 0.2
          ? 'bg-amber-100 text-amber-600'
          : 'bg-red-100 text-red-600';

    return (
      <button
        type="button"
        onClick={() => navigate('/settings?tab=plan')}
        className={`flex items-center gap-2 rounded-xl border border-gray-200 bg-gradient-to-r ${bgColor} px-3 py-1.5 transition hover:shadow-sm`}
      >
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${iconColor}`}>
          <Coins className="h-3.5 w-3.5" />
        </div>
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold text-gray-600">{t('layout.credits')}</span>
            <Zap className="h-3 w-3 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-gray-900">{formatNumber(bal)}</span>
            {total > 0 && <span className="text-xs text-gray-500">/ {formatNumber(total)}</span>}
          </div>
        </div>
        <div className="h-6 w-px bg-gray-300" />
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-16 rounded-full bg-gray-200 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-500`}
              style={{ width: `${Math.min(100, barWidthPct)}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-gray-600">{labelPct}%</span>
        </div>
      </button>
    );
  };

  const openMessages = () => {
    if (messagesTimeoutRef.current) clearTimeout(messagesTimeoutRef.current);
    messagesTimeoutRef.current = setTimeout(() => setMessagesDropdownOpen(true), 200);
  };
  const closeMessages = () => {
    if (messagesTimeoutRef.current) clearTimeout(messagesTimeoutRef.current);
    messagesTimeoutRef.current = setTimeout(() => setMessagesDropdownOpen(false), 300);
  };
  const openNotifications = () => {
    if (notificationsTimeoutRef.current) clearTimeout(notificationsTimeoutRef.current);
    notificationsTimeoutRef.current = setTimeout(() => setNotificationsDropdownOpen(true), 200);
  };
  const closeNotifications = () => {
    if (notificationsTimeoutRef.current) clearTimeout(notificationsTimeoutRef.current);
    notificationsTimeoutRef.current = setTimeout(() => setNotificationsDropdownOpen(false), 300);
  };

  return (
    <>
      <header className="h-[70px] w-full bg-white border-b border-gray-200 px-4 flex items-center justify-end gap-3 z-40">
        {renderCredits()}

        <div className="relative" onMouseEnter={openMessages} onMouseLeave={closeMessages}>
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-primary-200 hover:text-primary-600"
            aria-label={t('layout.messages')}
          >
            <Mail className="h-5 w-5" />
            {headerMessages.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-500 text-[10px] font-semibold text-white">
                {headerMessages.length}
              </span>
            )}
          </button>
          {messagesDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">{t('layout.messages')}</h3>
                {headerMessages.length > 0 && (
                  <span className="text-xs text-gray-500">
                    {t('layout.newCount', { count: headerMessages.filter((m) => m.unread).length })}
                  </span>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {headerMessages.length === 0 ? (
                  <DropdownEmptyState
                    icon={Mail}
                    title={t('layout.noMessages')}
                    hint={t('layout.noMessagesHint')}
                  />
                ) : null}
              </div>
              {headerMessages.length > 0 && (
                <div className="p-3 border-t border-gray-200">
                  <button type="button" className="w-full text-center text-sm font-semibold text-primary-600 hover:text-primary-500">
                    {t('layout.viewAllMessages')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative" onMouseEnter={openNotifications} onMouseLeave={closeNotifications}>
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-primary-200 hover:text-primary-600"
            aria-label={t('layout.notifications')}
          >
            <Bell className="h-5 w-5" />
            {headerNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-semibold text-white">
                {headerNotifications.length}
              </span>
            )}
          </button>
          {notificationsDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">{t('layout.notifications')}</h3>
                {headerNotifications.length > 0 && (
                  <span className="text-xs text-gray-500">
                    {t('layout.newCount', {
                      count: headerNotifications.filter((n) => n.unread).length,
                    })}
                  </span>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {headerNotifications.length === 0 ? (
                  <DropdownEmptyState
                    icon={Bell}
                    title={t('layout.noNotifications')}
                    hint={t('layout.noNotificationsHint')}
                  />
                ) : null}
              </div>
              {headerNotifications.length > 0 && (
                <div className="p-3 border-t border-gray-200">
                  <button type="button" className="w-full text-center text-sm font-semibold text-primary-600 hover:text-primary-500">
                    {t('layout.viewAllNotifications')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative" ref={profileDropdownRef}>
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center space-x-2 rounded-xl px-2 py-1.5 transition hover:bg-primary-50/40"
          >
            <CustomAvatar
              userName={displayName}
              url={profilePictureUrl}
              avatarClass="w-9 h-9"
              noUrlNameClass="text-sm font-semibold"
              hideUsername
            />
            <ChevronDown className="w-4 h-4 text-primary-500" />
          </button>
          {profileDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {profileDetails?.email || user?.email || ''}
                </p>
              </div>
              <Link
                to="/profile"
                onClick={() => setProfileDropdownOpen(false)}
                className="flex w-full items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 no-underline"
              >
                <User className="w-4 h-4" />
                <span className="text-sm">{t('nav.profile')}</span>
              </Link>
              <Link
                to="/settings"
                onClick={() => setProfileDropdownOpen(false)}
                className="flex w-full items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 no-underline"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm">{t('nav.settings')}</span>
              </Link>
              <div className="border-t border-gray-200 my-1" />
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center space-x-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">
                  {isLoggingOut ? t('layout.signingOut') : t('layout.signOut')}
                </span>
              </button>
            </div>
          )}
        </div>
      </header>

      <ActivateCreditsModal open={activateModalOpen} onClose={() => setActivateModalOpen(false)} />
    </>
  );
};
