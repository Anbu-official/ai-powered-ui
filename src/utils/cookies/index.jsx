const setCookies = (cookiename, value, expiretime) => {
  const d = new Date();
  d.setTime(d.getTime() + expiretime * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cookiename + "=" + value + ";" + expires + ";path=/";
};

const getCookies = (cookiename) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${cookiename}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

const removeCookies = (cookiename) => {
  document.cookie =
    cookiename + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

export { setCookies, getCookies, removeCookies };
