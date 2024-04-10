export default function convertUNIXtoISODateForForm(unixTime: number): string {
  const date = new Date(unixTime * 1000);

  // Format to 'YYYY-MM-DD'
  const isoDate = date.toISOString().split("T")[0];

  return isoDate;
}
