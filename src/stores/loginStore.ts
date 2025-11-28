import { create } from 'zustand';

interface LoginStore {
  invalidLogin: boolean;
  msg: string;

  setInvalidLogin: (newValueInvalidLogin: boolean) => void;
  setMsg: (novaMsg: string) => void;
}

const useLoginStore = create<LoginStore>(set => ({
  invalidLogin: false,
  msg: '',

  setInvalidLogin: (newValueInvalidLogin: boolean) =>
    set(() => ({ invalidLogin: newValueInvalidLogin })),
  setMsg: (newMsg: string) => set(() => ({ msg: newMsg })),
}));
export default useLoginStore;
