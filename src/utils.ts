export const recurring = {
  "1d": "1st Day",
  "2d": "2nd Day",
  "4d": "4th Day",
  "7d": "7th Day",
  "15d": "15th Day",
  "1M": "1st Month",
  "3M": "3rd Month",
  "6M": "6th Month",
} as const;

export type RecurringKey = keyof typeof recurring;

export const getFormattedDate = (date: moment.Moment) =>
  date.format("YYYY-MM-DD");
