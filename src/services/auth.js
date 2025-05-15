export const getCSRFToken = async () => {
  await fetch('http://localhost:8000/csrf-token', {
    credentials: 'include'
  });
};