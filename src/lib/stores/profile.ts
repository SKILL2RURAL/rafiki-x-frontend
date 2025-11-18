import { writable, get } from 'svelte/store';
import { api } from '$lib/api';
import { auth } from './authStore';
import { browser } from '$app/environment';
import { toast } from 'svelte-sonner';

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
	isLoading: false,
	error: null
};

export const profile = writable<ProfileState>(initialState);

export async function fetchProfile() {
	profile.set({ ...initialState, isLoading: true });
	try {
		const { data } = await api.get('/user/profile');

		// ✅ Normalize and map backend response
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

export async function uploadProfilePhoto(file: File): Promise<string | null> {
	try {
		const formData = new FormData();
		formData.append('file', file);

		const { data } = await api.post('/upload', formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});

		toast.success('Photo uploaded successfully!');
		console.log('Upload response data:', data);
		return data.data.fileUrl;
	} catch (error: any) {
		console.error('Error uploading profile photo:', error);
		toast.error('Failed to upload profile photo.');
		return null;
	}
}
