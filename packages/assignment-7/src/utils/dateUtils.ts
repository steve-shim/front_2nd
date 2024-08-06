export function fillZero(value: number, size = 2) {
  return String(value).padStart(size, "0");
}

export function formatDate(currentDate: Date, day?: number) {
  return [
    currentDate.getFullYear(),
    fillZero(currentDate.getMonth() + 1),
    fillZero(day ?? currentDate.getDate()),
  ].join("-");
}
