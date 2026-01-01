import { api } from '$lib/api';
import { AxiosError } from 'axios';
import { toast } from 'svelte-sonner';
import { writable } from 'svelte/store';

export interface UserProfile {
	firstName: string;
	lastName: string;
	email: string;
	country?: string;
	gender?: string;
	ageGroup?: string;
	profilePhoto?: string;
}

interface ProfileState {
	data: UserProfile | null;
	isLoading: boolean;
	error: string | null;
}

const initialState: ProfileState = {
	data: null,
	isLoading: true,
	error: null
};

export const profile = writable<ProfileState>(initialState);

export async function fetchProfile() {
	try {
		const { data } = await api.get('/user/profile');

		const user = data.data;
		const normalizedUser: UserProfile = {
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			country: user.country,
			gender: user.gender,
			ageGroup: user.ageGroup,
			profilePhoto: user.profilePhoto || null
		};

		profile.set({ data: normalizedUser, isLoading: false, error: null });
	} catch (error) {
		console.error('Error fetching profile:', error);
		if (error instanceof AxiosError) {
			const message = error.response?.data?.message || 'Failed to load profile.';
			profile.set({ data: null, isLoading: false, error: message });
			toast.error(message);
		}
	}
}

export function clearProfile() {
	profile.set(initialState);
}

export async function uploadProfilePhoto(file: File): Promise<string | null> {
	try {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('folder', 'profile');

		const { data } = await api.post('/upload', formData);

		if (data.data?.fileUrl) {
			profile.update((prev) => ({
				...prev,
				data: {
					...(prev.data || {}),
					profilePhoto: data.data.fileUrl
				} as UserProfile
			}));
			return data.data.fileUrl;
		}
		return null;
	} catch (error) {
		console.error('Error uploading profile photo:', error);
		toast.error('Failed to upload profile photo.');
		return null;
	}
}
