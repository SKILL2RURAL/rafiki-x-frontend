import { writable } from 'svelte/store';

export const files = writable<any[]>([]);
export const history = writable<any[]>([]);
export const showHistory = writable(false);

//add upload files
export function addFiles(uploadedFiles: FileList) { 
    files.update((current: Array<{ name: string; size: string }>) => [
        ...current,
        ...Array.from(uploadedFiles).map(f => ({
            name: f.name,
            size: (f.size / 1024).toFixed(1)
        }))
    ]);
}

export function toggleHistory() {
    showHistory.update((v: boolean) => !v);
}