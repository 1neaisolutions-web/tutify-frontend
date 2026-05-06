import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { completeLoginChallenge } from '../../redux/features/auth/authSlice';
import { setAuthToken } from '../../redux/http';
import { AppDispatch } from '../../redux/store';
import { Building2, Users, User } from 'lucide-react';

interface Membership {
  id: string;
  scope_type: string;
  scope_id: string;
  scope_name?: string;
  scope_display_name?: string;
  role?: {
    id: string;
    name: string;
  };
  is_active: boolean;
}

interface TenantSelectionProps {
  loginToken: string;
  memberships: Membership[];
  onSuccess: () => void;
  onError: (error: string) => void;
}

const TenantSelection: React.FC<TenantSelectionProps> = ({
  loginToken,
  memberships,
  onSuccess,
  onError,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(false);

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
        return 'Personal Workspace';
      default:
        return scopeType;
    }
  };

  const handleSelect = async (membership: Membership) => {
    setSelectedMembership(membership);
    setLoading(true);

    try {
      const result = await dispatch(
        completeLoginChallenge({
          login_token: loginToken,
          selected_membership_id: membership.id,
          scope_type: membership.scope_type,
        })
      ).unwrap();

      if (result?.status === 'SUCCESS' && result?.access_token) {
        // Store tokens
        localStorage.setItem('access_token', result.access_token);
        localStorage.setItem('refresh_token', result.refresh_token);
        
        // Update axios interceptor token
        setAuthToken(result.access_token);
        
        // Wait a moment for Redux state to update
        setTimeout(() => {
          onSuccess();
        }, 100);
      } else {
        onError('Failed to complete login');
      }
    } catch (error: any) {
      onError(error || 'Failed to select workspace');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Workspace</h2>
          <p className="text-gray-600 mb-6">
            You have access to multiple workspaces. Please select one to continue.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {memberships.map((membership) => {
              const Icon = getIcon(membership.scope_type);
              const isSelected = selectedMembership?.id === membership.id;

              return (
                <div
                  key={membership.id}
                  onClick={() => !loading && handleSelect(membership)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary-600" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {membership.scope_display_name || membership.scope_name || 'Workspace'}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {getScopeLabel(membership.scope_type)}
                      </p>
                      {membership.role && (
                        <p className="text-xs text-gray-500 mt-1 capitalize">
                          {membership.role.name.replace('_', ' ')}
                        </p>
                      )}
                    </div>
                    {isSelected && loading && (
                      <div className="ml-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {loading && (
            <div className="mt-4 text-center text-gray-600">
              Signing you in...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenantSelection;
