export const getRandomNumber = (currentCount: number) => {
  const currentDate = new Date();
  const YY = String(currentDate.getFullYear() % 100).padStart(2, '0');
  const MM = String(currentDate.getMonth() + 1).padStart(2, '0');
  const XXXX = String(currentCount).padStart(4, '0');

  const randomNumber = `${YY}${MM}${XXXX}`;

  return randomNumber;
};
