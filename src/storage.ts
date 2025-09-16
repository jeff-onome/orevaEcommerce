const REMEMBER_ME_KEY = 'app-remember-me';

/**
 * Sets the user's preference for session persistence.
 * This must be called before the sign-in attempt.
 * @param remember - Boolean indicating whether to persist the session across browser closures.
 */
export const setRememberMe = (remember: boolean) => {
  localStorage.setItem(REMEMBER_ME_KEY, String(remember));
};

/**
 * A custom storage adapter for the Supabase client that handles 'Remember Me' functionality.
 * It uses localStorage for persistent sessions and sessionStorage for session-only sessions.
 */
export const rememberMeStorage = {
  getItem(key: string) {
    // On app startup, Supabase checks for an existing session.
    // It could be in either localStorage (if 'Remember Me' was checked)
    // or sessionStorage (if it wasn't). We check both.
    const sessionStr = localStorage.getItem(key) || sessionStorage.getItem(key);
    return sessionStr;
  },
  setItem(key: string, value: string) {
    // After a successful login or token refresh, Supabase calls this method.
    // We read the preference set by setRememberMe() to decide where to store the session.
    const remember = localStorage.getItem(REMEMBER_ME_KEY);

    if (remember === 'false') {
      // User did not want to be remembered, use sessionStorage.
      // Clear from localStorage just in case a session from a previous "remember me" login exists.
      localStorage.removeItem(key);
      sessionStorage.setItem(key, value);
    } else {
      // Default to localStorage (i.e., remember me is true or preference not set).
      sessionStorage.removeItem(key);
      localStorage.setItem(key, value);
    }
  },
  removeItem(key: string) {
    // On logout, clear the session from both storages and remove the preference flag.
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
    localStorage.removeItem(REMEMBER_ME_KEY);
  },
};