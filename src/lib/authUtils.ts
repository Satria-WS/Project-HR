// src/lib/authUtils.ts
export const logout = () => {
  // Clear user profile
  localStorage.removeItem('userProfile');
  
  // Optional: Revoke Google session
  if (window.google) {
    window.google.accounts.id.revoke();
  }

  // Redirect to login
  window.location.href = '/login';
};