
export const getFullName = (firstName: string = '', lastName: string = '') => {
  const fullName = `${firstName} ${lastName}`.trim();
  return fullName || '-';
};
