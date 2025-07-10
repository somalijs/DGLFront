import AuthStore from '../stores/AuthStore';

function useAuth() {
  return AuthStore((state) => state);
}

export default useAuth;
