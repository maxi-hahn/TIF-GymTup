// Temporary token-detection helper (Sprint 2).
// Once Sprint 1 delivers AuthContext, replace the body of getAuthToken()
// with however the Auth team exposes the token (e.g. reading from a
// Zustand store, AuthContext, or a different localStorage key).
// No other file needs to change.

/**
 * Returns the current JWT token string, or null if the user is not authenticated.
 */
export const getAuthToken = () => {
    const token = localStorage.getItem('token')
  
    if (!token || token === 'undefined' || token === 'null') {
      return null
    }
  
    return token
  }