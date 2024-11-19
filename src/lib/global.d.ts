export {};

declare global {
  interface Window {
    electronAPI: {
      send: (channel: string, data: unknown) => void;
      receive: (channel: string, callback: (data: unknown) => void) => void;
      invoke: (channel: string, data?: unknown) => Promise<unknown>;
    };
  }
}
