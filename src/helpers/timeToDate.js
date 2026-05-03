export default function timeToDate(timeString) {
  const currentDate = new Date();
  const [hours, minutes] = timeString.split(":");
  currentDate.setHours(hours);
  currentDate.setMinutes(minutes);
  currentDate.setSeconds(0);
  
  const options = { timeZone: 'Asia/Jakarta', fractionalSecondDigits: 3 };
  const isoString = currentDate.toISOString().replace("Z", "+07:00");
  return isoString;
}
