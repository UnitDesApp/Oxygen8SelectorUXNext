export function isInCurrentMonth(dateString: string) {
  // Parse the dateString into a Date object
  const dateParts = dateString.split(/[ /:-]/);
  const month = Number(dateParts[0]) - 1;
  const day = Number(dateParts[1]);
  const year = Number(dateParts[2]);

  const date = new Date(year, month, day);
  const normalDate = new Date(dateString);

  // Get the current date
  const currentDate = new Date();

  // Check if the date's year and month match the current year and month
  return (
    (date.getFullYear() === currentDate.getFullYear() &&
      date.getMonth() === currentDate.getMonth()) ||
    (normalDate.getFullYear() === currentDate.getFullYear() &&
      normalDate.getMonth() === currentDate.getMonth())
  );
}
