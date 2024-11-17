interface Message {
    // Define the properties of the message object based on the library's documentation
    type: string;
    text: string;
}

declare module 'mammoth/mammoth.browser' {
    export function convertToHtml(options: { arrayBuffer: ArrayBuffer }): Promise<{ value: string; messages: Message[] }>;
}