export const getBaseUrl = () => {
  const origin = `${window.location.href.split('?')[0]}`;
  const baseUrl = origin.replace(/\/*$/, '');
  return baseUrl;
};
