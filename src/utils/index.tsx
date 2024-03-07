import type { NoSerialize } from "@builder.io/qwik";

export const fileToBytes = (file: NoSerialize<File>): Promise<string> | undefined => {
    if (file) {
        const blob = new Blob([file], { type: file.type });
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    resolve(reader.result.split(',')[1]); // Extracting base64 string from Data URL
                } else {
                    reject(new Error('Unable to convert file to base64.'));
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }
}