export function formatUnixTimestampToDateTime(unixTimestamp: number): string {
  const date = new Date(unixTimestamp * 1000);

  // Format the date-time string in the desired format
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };

  const formatter = new Intl.DateTimeFormat("vi-VN", options);
  return formatter.format(date);
}

export function formatDateToDateTime(date: Date): string {
  // Format the date-time string in the desired format
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };

  const formatter = new Intl.DateTimeFormat("vi-VN", options);
  return formatter.format(date);
}

export function formatDate(date: Date): string {
  // Format the date-time string in the desired format
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  const formatter = new Intl.DateTimeFormat("vi-VN", options);
  return formatter.format(date);
}
