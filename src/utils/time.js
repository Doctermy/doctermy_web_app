// Helper function to convert timeValue and date to startTime
import moment from "moment";

function convertToStartTime(timeValue, date) {
  const [time, period] = timeValue.match(/(\d+)(am|pm)/).slice(1);
  const hour = period === "pm" && time !== "12" ? parseInt(time) + 12 : period === 'am' && time === 12 ? parseInt(time) = 0 : parseInt(time);

  return moment(date)
    .set({
      hour: hour,
      minute: 0,
      second: 0,
      millisecond: 0,
    })
    .toDate();
}


// Function to check if a selected date falls within the doctor's available days
import { DAYS } from "../utils/user.js";

function getValidAppointmentDate(selectedDate, availableDays) {
  const dayOfWeek = selectedDate.getDay();
  const dayName = DAYS[Object.keys(DAYS)[dayOfWeek]];

  if (availableDays.includes(dayName)) {
    return selectedDate; // Return the actual date if it's within available days
  }

 return null; // Return null if the date doesn't match
}

export { convertToStartTime, getValidAppointmentDate };