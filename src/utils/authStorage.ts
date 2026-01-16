const TOKEN_STORAGE_KEY = "auth_token";

const safeStorage = () => {
  try {
    return window.localStorage;
  } catch (_error) {
    return undefined;
  }
};

export const getStoredToken = () => safeStorage()?.getItem(TOKEN_STORAGE_KEY) ?? null;

export const persistToken = (token: string) => {
  safeStorage()?.setItem(TOKEN_STORAGE_KEY, token);
};

export const clearStoredToken = () => {
  safeStorage()?.removeItem(TOKEN_STORAGE_KEY);
};

export const tokenStorageKey = TOKEN_STORAGE_KEY;
