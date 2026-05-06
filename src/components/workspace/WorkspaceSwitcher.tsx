import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { switchActiveMembership, fetchMemberships } from '../../redux/features/membership/membershipSlice';
import { setActiveMembership as setAuthActiveMembership } from '../../redux/features/auth/authSlice';
import { AppDispatch } from '../../redux/store';
import { Building2, Users, User, ChevronDown } from 'lucide-react';

const WorkspaceSwitcher: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { memberships, activeMembership, loading } = useSelector((state: any) => state.membership);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (memberships.length === 0) {
      dispatch(fetchMemberships());
    }
  }, [dispatch, memberships.length]);

  const getIcon = (scopeType: string) => {
    switch (scopeType) {
      case 'institution':
        return Building2;
      case 'organization':
        return Users;
      case 'personal_workspace':
        return User;
      default:
        return Building2;
    }
  };

  const handleSwitch = async (membership: any) => {
    try {
      const result = await dispatch(
        switchActiveMembership({
          membership_id: membership.id,
          scope_type: membership.scope_type,
        })
      ).unwrap();

      if (result.success && result.access_token) {
        // Update tokens
        localStorage.setItem('access_token', result.access_token);
        localStorage.setItem('refresh_token', result.refresh_token);
        
        // Update auth state
        dispatch(setAuthActiveMembership(result.active_membership));
        
        // Reload page to update context
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to switch workspace:', error);
    } finally {
      setIsOpen(false);
    }
  };

  if (memberships.length <= 1) {
    return null; // Don't show switcher if only one membership
  }

  const currentMembership = activeMembership || memberships[0];
  const CurrentIcon = currentMembership ? getIcon(currentMembership.scope_type) : Building2;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <CurrentIcon className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {currentMembership?.scope_display_name || currentMembership?.scope_name || 'Workspace'}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-600" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-20 border border-gray-200">
            <div className="py-1">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                Switch Workspace
              </div>
              {memberships.map((membership: any) => {
                const Icon = getIcon(membership.scope_type);
                const isActive = membership.id === currentMembership?.id;

                return (
                  <button
                    key={membership.id}
                    onClick={() => handleSwitch(membership)}
                    disabled={loading || isActive}
                    className={`w-full text-left px-4 py-2 flex items-center space-x-3 hover:bg-gray-50 ${
                      isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Icon className="w-4 h-4" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {membership.scope_display_name || membership.scope_name || 'Workspace'}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {membership.role?.name?.replace('_', ' ')}
                      </div>
                    </div>
                    {isActive && (
                      <span className="text-xs text-primary-600 font-medium">Active</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WorkspaceSwitcher;
