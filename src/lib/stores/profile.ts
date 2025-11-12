import { writable, get } from "svelte/store";
import { api } from "$lib/api";
import { auth } from "./authStore";
import { browser } from "$app/environment";
import { toast } from "svelte-sonner";

export interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
}

interface ProfileState {
    data: UserProfile | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: ProfileState = {
    data: null,
    isLoading: false,
    error: null
};

export const profile = writable<ProfileState>(initialState);

export async function fetchProfile() {
    profile.set({ ...initialState, isLoading: true });

    try {
        const { data } = await api.get('/user/profile');
        profile.set({ data: data.data, isLoading: false, error: null });
    } catch (error: any) {
        console.error('Error fetching profile:', error);
        const message = error.response?.data?.message || 'Failed to load profile.';
        profile.set({ data: null, isLoading: false, error: message });
        toast.error(message);
    }
}

export function clearProfile() {
    profile.set(initialState);
}