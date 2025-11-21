export const setCookie = (
  cookieName: string,
  cookieValue: string
) => {
  deleteAllCookies();
  document.cookie = `${cookieName}=${cookieValue}; path=/;`;
};

export const deleteAllCookies = () => {
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const equalPosition = cookie.indexOf("=");
    const name =
      equalPosition > -1
        ? cookie.trim().substring(0, equalPosition)
        : cookie.trim();

    document.cookie =
      name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }
};

export const getCookie = (cookieName: string) => {
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const equalPosition = cookie.indexOf("=");
    const name =
      equalPosition > -1
        ? cookie.trim().substring(0, equalPosition)
        : cookie.trim();

    if (name === cookieName) {
      return cookie.trim().substring(equalPosition + 1);
    }
  }
};

export const checkEmailFormat = (email: string | undefined) => {
  if (email?.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) !== null) {
    return true;
  }
  return false;
};

type Partial<TElem> = {
  [P in keyof TElem]?: TElem[P];
};
