import { create } from 'zustand';

type Store = {
  name: string;
  location: string;
  _id: string;
  total: string;
  bankID: string;
};
type User = {
  id: string;
  name: string;
  names: string;
  role: string;
  email: string;
  surname: string;
  phoneNumber: string;
  gender: string;
  isEmailVerified: boolean;
  stores: Store[];
  homePath: string;
  store: string;
};

type AuthState = {
  user: User | null;
  isFetched: boolean;
  isLoggedIn: boolean;
  setIsLoggedIn: (d: boolean) => void;
  setIsFetched: (d: boolean) => void;
  login: (user: User) => void;
  logout: () => void;
};

export const AuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  isFetched: false,
  setIsLoggedIn: (d) => set({ isLoggedIn: d }),
  setIsFetched: (d) => set({ isFetched: d }),
  login: (user) => set({ user }),
  logout: () => set({ user: null, isLoggedIn: false, isFetched: false }),
}));

export default AuthStore;
