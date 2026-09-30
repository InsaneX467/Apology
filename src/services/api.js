const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Anonymous session ID generator & getter.
 * Stored in sessionStorage for the duration of the visit.
 * Does NOT collect any personal or device data.
 */
export const getSessionId = () => {
  let sessionId = sessionStorage.getItem('apology_session_id');
  if (!sessionId) {
    sessionId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    sessionStorage.setItem('apology_session_id', sessionId);
  }
  return sessionId;
};

/**
 * Sends explicit user option selection to the backend.
 */
export const sendResponseToBackend = async (selectedOption, twoDayRequestsCount = 0) => {
  const sessionId = getSessionId();
  try {
    const response = await fetch(`${API_BASE_URL}/api/response`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sessionId,
        selectedOption,
        twoDayRequests: twoDayRequestsCount
      })
    });

    const data = await response.json();
    return data;
  } catch (error) {
    // Silently log or handle network errors so user experience remains smooth
    console.warn('Backend API submission warning:', error.message);
    return { success: false, offline: true };
  }
};

/**
 * Fetches admin response history (protected by admin secret).
 */
export const fetchAdminResponses = async (secret) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/responses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': secret
      }
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, message: 'Could not connect to backend server' };
  }
};
