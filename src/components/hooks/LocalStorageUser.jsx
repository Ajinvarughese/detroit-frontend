export function saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

export function getUser() {
  const storedUser = localStorage.getItem('user');
  if (!storedUser) return { role: '' };

  try {
    const parsed = JSON.parse(storedUser);
    return parsed ?? { role: '' };
  } catch (e) {
    return { role: '' };
  }
}

export function deleteUser() {
    localStorage.removeItem('user');
}