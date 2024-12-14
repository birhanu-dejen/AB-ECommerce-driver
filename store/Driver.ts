import { create } from "zustand";

interface IDriver {
  id: string;
  firstName: string;
  lastName: string;
  email: String;
  token: string;
}

interface DriverState {
  driver: IDriver | null;
  sign: (value: IDriver | null) => void;
  updateName: (value: { firstName: string; lastName: string }) => void;
}

const useDriverStore = create<DriverState>()((set) => ({
  driver: null,
  sign: (value) => set(() => ({ driver: value })),
  updateName: (value) =>
    set(({ driver }) => ({
      driver: {
        id: driver!.id,
        firstName:value.firstName,
        lastName: value.lastName,
        email: driver!.email,
        token: driver!.token,
      },
    })),
}));

export default useDriverStore;
