import { formatRelative } from 'date-fns';

export const displayTime = (createdAt: number) => {
  const formatted = formatRelative(new Date(createdAt * 1000), new Date());

  return formatted.includes('today')
    ? formatted.replace('today at ', '')
    : formatted.includes(' at ')
      ? formatted.split(' at ')[0]
      : formatted;
};

export const sameDay = (date1: number, date2: number) => {
  return new Date(date1 * 1000).getDate() === new Date(date2 * 1000).getDate();
}
