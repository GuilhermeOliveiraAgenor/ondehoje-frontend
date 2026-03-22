// Convert 24-hour format to 12-hour format
const get12HourFormat = (hour: number) => {
  return hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
}

// Get period (AM/PM) from hour
const getPeriod = (hour: number) => {
  return hour >= 12 ? 'PM' : 'AM'
}

// Convert 12-hour format to 24-hour format
const get24HourFormat = (hour: number, period: string) => {
  if (period === 'AM') {
    return hour === 12 ? 0 : hour
  } else {
    return hour === 12 ? 12 : hour + 12
  }
}

export { get12HourFormat, get24HourFormat, getPeriod }
