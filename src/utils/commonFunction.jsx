const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

const debounced = (callback) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback(...args);
    }, 500);
  };
};

export { isValidUrl, debounced };
