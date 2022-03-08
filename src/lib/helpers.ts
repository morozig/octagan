export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const origin = `${window.location.href.split('?')[0]}`;
    const baseUrl = origin.replace(/\/*$/, '');
    return baseUrl;
  } else {
    return '';
  }
};
