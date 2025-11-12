import Cookies from 'js-cookie';

export function getCookie(name: string) {
	return Cookies?.get(name);
}

export function deleteCookie(name: string, path: string) {
	Cookies?.remove(name, { path });
}

export function setCookie(name: string, value: string) {
	Cookies?.set(name, value, { path: '/', expires: 7, secure: true, sameSite: 'Strict' });
}
