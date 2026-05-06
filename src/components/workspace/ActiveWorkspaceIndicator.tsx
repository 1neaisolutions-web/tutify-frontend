import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMemberships } from '../../redux/features/membership/membershipSlice';
import { AppDispatch } from '../../redux/store';
import { Building2, Users, User } from 'lucide-react';

const ActiveWorkspaceIndicator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { activeMembership, memberships } = useSelector((state: any) => state.membership);
  const user = useSelector((state: any) => state?.auth?.user);
  
  // Hide for super admin - they don't need workspace indicator
  const isSuperAdmin = user?.role === 'super_admin';

  useEffect(() => {
    if (!isSuperAdmin && memberships.length === 0) {
      dispatch(fetchMemberships());
    }
  }, [dispatch, memberships.length, isSuperAdmin]);

  // Hide for super admin
  if (isSuperAdmin) {
    return null;
  }

  if (!activeMembership && memberships.length === 0) {
    return null;
  }

  const currentMembership = activeMembership || memberships[0];

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

  const getScopeLabel = (scopeType: string) => {
    switch (scopeType) {
      case 'institution':
        return 'Institution';
      case 'organization':
        return 'Organization';
      case 'personal_workspace':
        return 'Personal';
      default:
        return scopeType;
    }
  };

  const Icon = getIcon(currentMembership?.scope_type || 'institution');

  return (
    <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-md">
      <Icon className="w-4 h-4 text-gray-600" />
      <div className="flex flex-col">
        <span className="text-xs text-gray-500">{getScopeLabel(currentMembership?.scope_type)}</span>
        <span className="text-sm font-medium text-gray-700">
          {currentMembership?.scope_display_name || currentMembership?.scope_name || 'Workspace'}
        </span>
      </div>
    </div>
  );
};

export default ActiveWorkspaceIndicator;
