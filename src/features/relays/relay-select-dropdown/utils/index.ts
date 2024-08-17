export const validateURL = (url: string) => {
  const urlPattern = /^(wss?|ws):\/\/[^\s$.?#].[^\s]*$/i;

  return urlPattern.test(url);
};
