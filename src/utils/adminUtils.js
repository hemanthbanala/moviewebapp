// Admin configuration
export const ADMIN_EMAILS = [
  'admin@movieapp.com',
  'pwd23@gmail.com', // Add your email here
  'superuser@movieapp.com'
];

// Check if user is admin based on email
export const isAdminUser = (user) => {
  if (!user || !user.email) return false;
  return ADMIN_EMAILS.includes(user.email.toLowerCase());
};

// Check if user has admin role
export const hasAdminRole = (user) => {
  if (!user) return false;
  return user.role === 'admin' || isAdminUser(user);
};