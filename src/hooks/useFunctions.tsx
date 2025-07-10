import { useNavigate } from 'react-router';

export const useNavigateHook = () => {
  const navigate = useNavigate();
  //   const { app } = useAuth();
  //   if (!app) {
  //     message.error('App not found');
  //     return () => {};
  //   }

  return (path: string) => {
    console.log(path);
    navigate(`${path}`);
  };
};
