export default function convertUNIXtoISODate(unixTime: number): string {
  const date = new Date(unixTime * 1000);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  const formattedDate = formatter.format(date);

  return formattedDate;
}
