import dayjs from "dayjs";

export function generateDatesFromMonthBeginning(){
  const firstDayOfTheMonth = dayjs().startOf('month')
  const today = new Date()

  const dates = []
  let compareDate = firstDayOfTheMonth

  while (compareDate.isBefore(today)) {
    dates.push(compareDate.toDate())
    compareDate = compareDate.add(1, 'day')
  }

  return dates
}