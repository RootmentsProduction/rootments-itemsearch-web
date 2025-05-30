// Save session data (example: after login)
export const saveSession = (data) => {
  localStorage.setItem('employeeSession', JSON.stringify(data));
};

// Get session data (used in App.jsx to check login)
export const getSession = () => {
  const session = localStorage.getItem('employeeSession');
  return session ? JSON.parse(session) : null;
};

// Clear session (used on logout)
export const clearSession = () => {
  localStorage.removeItem('employeeSession');
};
