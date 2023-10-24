import {MONTH_SHORT_NAME_LIST, MONTH_FULL_NAME_LIST} from '../constants/config';

export const timestampToString = (timestamp: number) => {
  if (timestamp === 0)
    return {
      date: '-',
      time: '-',
      month: '-',
      abbreviatedMonth: '-',
      monthName: '-',
      monthAndYear: '-',
      day: '-',
      abbreviatedTime: '-',
      year: '-',
    };

  const date = new Date(timestamp * 1000);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');

  const monthIndex = date.getMonth();

  const monthName = MONTH_SHORT_NAME_LIST[monthIndex];
  const monthFullName = MONTH_FULL_NAME_LIST[monthIndex];

  const dateString = `${year}-${month}-${day}`;
  const timeString = `${hour}:${minute}:${second}`;

  return {
    date: dateString,
    time: timeString,
    month: month,
    abbreviatedMonth: monthName,
    monthName: monthFullName,
    monthAndYear: `${monthFullName} ${year}`,
    day: day,
    abbreviatedTime: `${hour}:${minute}`,
    year: year,
  };
};
