import { notification } from "antd";

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


export function notificationSuccess(
  description = "You're successfully logout.",
  message = "Todo app"
) {
  notification.success({
    message: message,
    description: description
  })
}

export function notificationError(
  description = "You're successfully logout.",
  message = "Todo app"
) {
  notification.error({
    message: message,
    description: description
  })
}





