// src/utils/session.js
export const saveSession = (data) => {
  // write only valid JSON
  localStorage.setItem('employeeSession', JSON.stringify(data));
};

export const getSession = () => {
  try {
    const raw = localStorage.getItem('employeeSession');
    // reject absent or literal "undefined"
    if (!raw || raw === 'undefined') return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn('⚠️ Corrupt session removed:', err);
    localStorage.removeItem('employeeSession');   // purge bad value
    return null;
  }
};

export const clearSession = () => {
  localStorage.removeItem('employeeSession');
};
