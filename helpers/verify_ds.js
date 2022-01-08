const validateString = (string) => {
  if (!string || typeof string !== 'string' || !string.trim()) {
    return false;
  }
  return true;
};

const validateInteger = (string) => {
  if (isNaN(string)) {
    return false;
  }
  const num = parseInt(string);
  if (!Number.isInteger(num)) {
    return false;
  }
  return true;
};

module.exports = {
  validateString,
  validateInteger,
};

