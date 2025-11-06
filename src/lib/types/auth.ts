export interface RegisterPayload {
	firstName: string;
	lastName: string;
	email: string;
	country: string;
	gender: 'male' | 'female';
	ageGroup: '12-15' | '16-21' | '22-26' | '27-35' | '36 above';
	password: string;
}

export interface LoginPayload {
	email: string;
	password: string;
}
