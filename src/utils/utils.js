// Email Validation
export const validateEmail = (email) => {
  var emailRegex = /^\w.+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  return emailRegex.test(email);
};

// Password Validation
export const validatePassword = (password) => ({
  length: password.length >= 10,
  upper: /[A-Z]/.test(password),
  lower: /[a-z]/.test(password),
  number: /[0-9]/.test(password),
  specialChar: /[!@#$%^&*()_\-+=<>?{}[\]~`|\\:;"',./]/.test(password),
});

// Empty Check
export const isEmpty = (obj) => {
  return Object.values(obj)?.some(
    (value) =>
      value === null ||
      value === undefined ||
      value === '' ||
      Number.isNaN(value)
  );
};

// Error Check
export const isError = (obj) => {
  return Object.values(obj)?.some(
    (value) => value !== null && value !== undefined && value !== ''
  );
};

// FN TO GET NAME OF THE PAGE
export const getPageName = (path) => {
  let pageName = '';
  const routeName = path?.includes('-') ? path?.split('-') : path;
  if (typeof routeName === 'object') {
    pageName = routeName
      ?.map((item) => item?.charAt(0)?.toLocaleUpperCase() + item?.slice(1))
      ?.join(' ');
  } else {
    pageName = routeName?.charAt(0)?.toLocaleUpperCase() + routeName?.slice(1);
  }
  return pageName;
};

