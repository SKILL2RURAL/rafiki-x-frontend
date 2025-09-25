import { writable } from "svelte/store";

export type Message = {
    id: number;
    sender: 'user' | 'bot';
    text?: string;
    file?: File;
    timestamp: Date;
}

function createChatStore() {
    const {subscribe, update, set } = writable<Message[]>([]);
    let idCounter = 0;

    return {
        subscribe,
        sendMessage: (text: string) => {
            update((messages) => [
                ...messages,
                {id: ++idCounter, sender: 'user', text, timestamp: new Date()}
            ])
        },
        sendFile: (file: File) => {
            update(messages => [...messages, {id: ++idCounter, sender: 'user', file, timestamp: new Date()}])
        },

        receiveMessage: (text: string) => {
            update((messages) => [
                ...messages,
                {id: ++idCounter, sender: 'bot', text, timestamp: new Date()}
            ]);
        },
        clear: () => set([])
    }
 }


 export const chatStore = createChatStore();