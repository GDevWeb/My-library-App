export function validateYear(year) {
  const currentYear = new Date().getFullYear();
  return !isNaN(year) && year <= currentYear;
}
