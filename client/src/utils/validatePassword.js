export const validatePassword = (password) => {
  const validations = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password)
  ];

  const isValid = validations.every(Boolean);

  const message = "Password must include at least 1 uppercase, 1 lowercase, 1 number and be at least 8 characters long.";

  return { isValid, message };
};
