// Lightweight frontend logger (logs to console only in development)
export const logError = (message, ...args) => {
  if (import.meta.env.DEV) {
    console.error(message, ...args);
  }
};
