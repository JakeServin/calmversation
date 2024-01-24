import { create } from "zustand";

interface Store {
	user?: Object | null;
	setUser: (user: Object | null) => void;
}

export const useStore = create<Store>((set) => ({
	user: null,
	setUser: (user) => set({ user: user }),
}));
