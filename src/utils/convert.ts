export function celsiusToFarenheit(value: number) {
    return (value * (9 / 5)) + 32;
  }

export function farenheitToCelsius(value: number) {
    return (value - 32) * (5 / 9);
  }