export const ADMIN_EMAILS = [
  'admin@movieapp.com',
  'eswar7@gmail.com', 
  'superuser@movieapp.com'
];


export const isAdminUser = (user) => {
  if (!user || !user.email) return false;
  return ADMIN_EMAILS.includes(user.email.toLowerCase());
};

export const hasAdminRole = (user) => {
  if (!user) return false;
  return user.role === 'admin' || isAdminUser(user);
};