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

export function getReorderedWeekDays() {
  const startDate = dayjs().startOf('month');
  const firstDayOfWeek = startDate.day();
  const weekDays = [
    'Dom',
    'Seg',
    'Ter',
    'Qua',
    'Qui',
    'Sex',
    'Sáb',
  ];

  const reorderedWeekDays = [...weekDays.slice(firstDayOfWeek), ...weekDays.slice(0, firstDayOfWeek)];

  return reorderedWeekDays;
}