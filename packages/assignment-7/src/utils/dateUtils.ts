import { Event } from "../types.ts";
import { searchEvents } from "./eventUtils.ts";

export function getEventsForDay(events: Event[], date: number): Event[] {
  return events.filter((event) => new Date(event.date).getDate() === date);
}

export function getWeeksAtMonth(currentDate: Date) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weeks = [];

  const initWeek = () => Array(7).fill(null);

  let week: Array<number | null> = initWeek();

  for (let i = 0; i < firstDayOfMonth; i++) {
    week[i] = null;
  }

  for (const day of days) {
    const dayIndex = (firstDayOfMonth + day - 1) % 7;
    week[dayIndex] = day;
    if (dayIndex === 6 || day === daysInMonth) {
      weeks.push(week);
      week = initWeek();
    }
  }

  return weeks;
}

export function fillZero(value: number, size = 2) {
  return String(value).padStart(size, "0");
}

export function formatDate(currentDate: Date, day?: number) {
  return [currentDate.getFullYear(), fillZero(currentDate.getMonth() + 1), fillZero(day ?? currentDate.getDate())].join("-");
}

/**
 * 주어진 날짜의 주 정보를 "YYYY년 M월 W주" 형식으로 반환합니다.
 */
export function formatWeek(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const weekNumber = Math.ceil(date.getDate() / 7);
  return `${year}년 ${month}월 ${weekNumber}주`;
}

/**
 * 주어진 날짜의 월 정보를 "YYYY년 M월" 형식으로 반환합니다.
 */
export function formatMonth(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}년 ${month}월`;
}

/**
 * 주어진 날짜가 속한 주의 모든 날짜를 반환합니다.
 */
export function getWeekDates(date: Date): Date[] {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // 주의 시작을 월요일로 조정
  const monday = new Date(date.setDate(diff));
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(monday);
    nextDate.setDate(monday.getDate() + i);
    weekDates.push(nextDate);
  }
  return weekDates;
}

/**
 * 주어진 날짜가 특정 범위 내에 있는지 확인합니다.
 */
export function isDateInRange(date: Date, rangeStart: Date, rangeEnd: Date): boolean {
  return date >= rangeStart && date <= rangeEnd;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export const getDateInfo = (date: Date) => {
  return {
    curYear: date.getFullYear(),
    curMonth: date.getMonth() + 1,
    curDate: date.getDate(),
  };
};

function isDateExcluded(date: Date, excludeDates: Date[] | undefined): boolean {
  if (!excludeDates) return false;

  excludeDates = excludeDates.map((d) => new Date(d));
  return excludeDates.some(
    (excludeDate) =>
      excludeDate.getFullYear() === date.getFullYear() && excludeDate.getMonth() === date.getMonth() && excludeDate.getDate() === date.getDate()
  );
}

function shouldIncludeDate(date: Date, event: Event): boolean {
  const eventDate = new Date(event.date);
  switch (event.repeat.type) {
    case "daily":
      return true;
    case "weekly":
      return eventDate.getDay() === date.getDay();
    case "monthly":
      return date.getDate() === eventDate.getDate();
    case "yearly":
      return date.getMonth() === eventDate.getMonth() && date.getDate() === eventDate.getDate();
    default:
      return false;
  }
}

function getNextDate(date: Date, event: Event): Date {
  const nextDate = new Date(date);
  switch (event.repeat.type) {
    case "daily":
      nextDate.setDate(date.getDate() + event.repeat.interval);
      break;
    case "weekly":
      nextDate.setDate(date.getDate() + 7 * event.repeat.interval);
      break;
    case "monthly":
      nextDate.setMonth(date.getMonth() + event.repeat.interval);
      break;
    case "yearly":
      nextDate.setFullYear(date.getFullYear() + event.repeat.interval);
      break;
  }
  return nextDate;
}

export function generateEventInstances(event: Event, rangeStart: Date, rangeEnd: Date): Event[] {
  const instances: Event[] = [];
  let currentDate = new Date(event.date);

  rangeEnd.setHours(23, 59, 59); // currentDate의 시간은 9:00, range들의 시간은 00:00이기 때문에
  // 매월 마지막날 반복 일정이 추가되지 않아 종료 시간 설정
  // let count = 0;

  while (currentDate <= rangeEnd) {
    if (currentDate > new Date(event.date) && currentDate > rangeStart && !isDateExcluded(currentDate, event.repeat.excludeDates)) {
      if (shouldIncludeDate(currentDate, event)) {
        const { curYear, curMonth, curDate } = getDateInfo(currentDate);
        const formatDate = `${curYear}-${String(curMonth).padStart(2, "0")}-${String(curDate).padStart(2, "0")}`;

        instances.push({ ...event, isRepeat: true, date: formatDate });
        // count++;

        // if (event.endCondition.type === 'count' && count >= (event.endCondition.value as number)) {
        //   break;
        // }
      }
    }

    if (event.repeat.endDate && currentDate >= new Date(event.repeat.endDate)) {
      break;
    }

    currentDate = getNextDate(currentDate, event);
  }

  return instances;
}

export const filteredRepeatEvents = (() => {
  return (events: Event[], searchTerm: string, view: "week" | "month", currentDate: Date) => {
    const filtered = searchEvents(events, searchTerm);
    const { curYear, curMonth } = getDateInfo(currentDate);

    const daysInMonth = getDaysInMonth(curYear, curMonth - 1);
    const weekDates = getWeekDates(currentDate);

    const filteredEvents: Event[] = [];

    filtered.forEach((event) => {
      if (event.repeat.type !== "none") {
        // const startRange = view === 'week' ? weekDates[0] : new Date(curYear, curMonth-1, 1);
        // const endRange = view === 'week' ? weekDates[6] : new Date(curYear, curMonth-1, daysInMonth);
        // const repeatEvents = generateEventInstances(event, startRange, endRange)
        const repeatEvents = generateEventInstances(event, new Date(curYear, curMonth - 1, 1), new Date(curYear, curMonth - 1, daysInMonth));

        filteredEvents.push(
          ...repeatEvents.filter((e) => {
            const eDate = new Date(e.date);

            if (view === "week") {
              return eDate >= weekDates[0] && eDate <= weekDates[6];
            } else if (view === "month") {
              return eDate.getMonth() === curMonth - 1 && eDate.getFullYear() === curYear;
            }
            return true;
          })
        );
      }
    });

    return [...filteredEvents];
  };
})();
