import type { PageServerLoad } from './$types';

const PRIVATE_IP_PATTERNS = [
	/^127\./,
	/^10\./,
	/^192\.168\./,
	/^172\.(1[6-9]|2\d|3[01])\./,
	/^::1$/,
	/^localhost$/
];

function isPrivateIp(ip: string): boolean {
	return PRIVATE_IP_PATTERNS.some((pattern) => pattern.test(ip));
}

function countryToCurrency(country: string): 'naira' | 'dollars' | 'pounds' {
	if (country === 'GB') return 'pounds';
	if (country === 'NG') return 'naira';
	return 'dollars';
}

export const load: PageServerLoad = async ({ request }) => {
	// TODO: Remove this override after testing Polar payment flow
	// return { currency: 'dollars' };
	// return { currency: 'naira' };

	try {
		// 1. Check CDN headers first (zero-cost)
		const cfCountry = request.headers.get('cf-ipcountry');
		if (cfCountry && cfCountry !== 'XX') {
			return { currency: countryToCurrency(cfCountry) };
		}

		const vercelCountry = request.headers.get('x-vercel-ip-country');
		if (vercelCountry) {
			return { currency: countryToCurrency(vercelCountry) };
		}

		// 2. Extract client IP
		const forwarded = request.headers.get('x-forwarded-for');
		const ip = forwarded ? forwarded.split(',')[0].trim() : null;

		// Skip API call for local dev
		if (!ip || isPrivateIp(ip)) {
			return { currency: 'dollars' };
		}

		// 3. Fallback to ipapi.co
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 3000);
		try {
			const response = await fetch(`https://ipapi.co/${ip}/country/`, {
				signal: controller.signal
			});
			if (response.ok) {
				const country = (await response.text()).trim();
				return { currency: countryToCurrency(country) };
			}
		} finally {
			clearTimeout(timeout);
		}
	} catch {
		// fall through to default
	}

	return { currency: 'dollars' };
};
