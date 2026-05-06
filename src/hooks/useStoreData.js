import { useSelector } from 'react-redux';

export const useStoreData = () => {
  const user = useSelector((state) => state?.auth?.user);
  const role = user?.role || '';
  const username = user?.username || user?.email || '';
  const email = user?.email || '';
  const token = user?.token || '';

  return {
    user,
    role,
    username,
    email,
    token,
  };
};

