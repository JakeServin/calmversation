import { create } from "zustand";
import { User } from "@supabase/auth-helpers-nextjs"; 
import { Settings } from "./interfaces";

interface Store {
	user?: User | null;
	setUser: (user: User | null) => void;
	
	messages: any[];
	setMessages: (messages: any[] | ((prevMessages: any[]) => any[])) => void;
	
	settings: Settings;
	setSettings: (settings: Settings | ((prevSettings: Settings) => Settings)) => void
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

	settings: {
		voice: "AURA_1",
	},
	setSettings: (settings) =>
		set((state) => ({
			settings:
				typeof settings === "function"
					? settings(state.settings)
					: settings,
		})),
}));
