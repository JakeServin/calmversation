import { create } from "zustand";
import { User } from "@supabase/auth-helpers-nextjs"; 

interface Store {
	user?: User | null;
	setUser: (user: User | null) => void;
	messages: any[];
  setMessages: (messages: any[] | ((prevMessages: any[]) => any[])) => void;
}

export const useStore = create<Store>((set) => ({
	user: null,
	setUser: (user: User | null) => set({ user }),

	messages: [],
	setMessages: (messages) =>
		set((state) => ({
			messages:
				typeof messages === "function"
					? messages(state.messages)
					: messages,
		})),
}));
