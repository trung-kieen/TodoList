import { notification } from "antd";
import { APP_TITLE } from "../constants";

export function formatDate(dateString) {
  const date = new Date(dateString);

  const monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return monthNames[monthIndex] + ' ' + year;
}

export function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug",
    "Sep", "Oct", "Nov", "Dec"
  ];

  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return date.getDate() + ' ' + monthNames[monthIndex] + ' ' + year + ' - ' + date.getHours() + ':' + date.getMinutes();
}

export function  getTimeRemaining  (due)  {
  const expirationTime = new Date(due).getTime();
  const currentTime = new Date().getTime();

  var difference_ms = expirationTime - currentTime;
  var seconds = Math.floor((difference_ms / 1000) % 60);
  var minutes = Math.floor((difference_ms / 1000 / 60) % 60);
  var hours = Math.floor((difference_ms / (1000 * 60 * 60)) % 24);
  var days = Math.floor(difference_ms / (1000 * 60 * 60 * 24));

  let timeRemaining;
  if(!days && ! hours&& !minutes && !seconds){
    return "";
  }

  if (days > 0) {
    timeRemaining = days + " days left";
  } else if (hours > 0) {
    timeRemaining = hours + " hours left";
  } else if (minutes > 0) {
    timeRemaining = minutes + " minutes left";
  } else if (seconds > 0) {
    timeRemaining = seconds + " seconds left";
  }
  else {
    timeRemaining = "less than a second left";
  }
  return timeRemaining;
}
export function notificationSuccess(description){
    notification.success({
      message: APP_TITLE,
      description: description,
    });

}
export function notificationError(description){
    notification.error({
      message: APP_TITLE,
      description: description,
    });

}

