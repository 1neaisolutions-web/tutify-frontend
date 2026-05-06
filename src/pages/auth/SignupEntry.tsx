import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, User } from 'lucide-react';

const SignupEntry: React.FC = () => {
  const navigate = useNavigate();

  const signupOptions = [
    {
      id: 'individual',
      title: 'Individual',
      description: 'Sign up as a Teacher or Student with a personal workspace',
      icon: User,
      path: '/signup/individual',
      color: 'bg-blue-500',
    },
    {
      id: 'institution',
      title: 'Institution',
      description: 'Create and manage a single institution',
      icon: Building2,
      path: '/signup/institution',
      color: 'bg-green-500',
    },
    {
      id: 'organization',
      title: 'Organization',
      description: 'Create an organization and manage multiple institutions',
      icon: Users,
      path: '/signup/organization',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Choose the signup path that best fits your needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {signupOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.id}
                onClick={() => navigate(option.path)}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-primary-500"
              >
                <div className={`${option.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{option.title}</h3>
                <p className="text-gray-600 text-sm">{option.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupEntry;
