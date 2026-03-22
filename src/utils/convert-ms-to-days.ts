export function convertMsToDays(ms: number): number {
  const msInOneSecond = 1000
  const secondsInOneMinute = 60
  const minutesInOneHour = 60
  const hoursInOneDay = 24

  const minutesInOneDay = hoursInOneDay * minutesInOneHour
  const secondsInOneDay = secondsInOneMinute * minutesInOneDay
  const msInOneDay = msInOneSecond * secondsInOneDay

  return Math.ceil(ms / msInOneDay)
}
