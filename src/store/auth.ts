import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { AUTH_KEY } from '@/constants';

import type { UserAuth } from '@/types/auth';

interface UserState {
	user: UserAuth | null;
	setUser: (user: UserAuth) => void;
	clearUser: () => void;
}

const useUserStore = create<UserState>()(
	persist(
		(set) => ({
			user: null,
			setUser: (user: UserAuth) => set({ user }),
			clearUser: () => set({ user: null }),
		}),
		{
			name: AUTH_KEY, // unique name
			// getStorage: () => localStorage, // (optional) by default the 'localStorage' is used
		}
	)
);
export default useUserStore;
