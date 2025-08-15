interface State {
  address: {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    postalCode: string;
    city: string;
    country: string;
    phone: string;
  };
  ////metodos
  setAddress: (address: State["address"]) => void;
   hasHydrated: boolean;
  setHasHydrated: (hydrated: boolean) => void;
  
}

import { create } from "zustand";
import { persist } from "zustand/middleware";
////almacenar // la dirección del usuario en el localStorage
export const useAddressStore = create<State>()(
  persist(
    (set, get) => ({
      address: {
        firstName: "",
        lastName: "",
        address: "",
        address2: "",
        postalCode: "",
        city: "",
        country: "",
        phone: "",
      },
      setAddress: (address) => set({ address }),
      hasHydrated: false,
      setHasHydrated: (hydrated:boolean) => set({ hasHydrated: hydrated }),
    }),
    {
      name: "address-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true); // marca como hidratado
      },
    }
  )
);
