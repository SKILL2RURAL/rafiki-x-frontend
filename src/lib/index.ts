// place files you want to import through the `$lib` alias in this folder.

import pdfIcon from '$lib/assets/icons/pdfIcon.png';
import textIcon from '$lib/assets/icons/textIcon.png';

//fileIcon.ts

export const fileIcons: Record<string, string> = {
    "application/pdf": pdfIcon,
    "application/msword": "",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "",
    "text/plain": textIcon,
    "image/png": "",
    "image/jpeg": "",
    "default": ""
}