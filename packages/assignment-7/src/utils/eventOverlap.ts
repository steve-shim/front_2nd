import { Event } from "../types";

// 날짜 문자열을 Date 객체로 변환하는 함수
export function parseDateTime(date: string, time: string) {
  return new Date(`${date}T${time}`);
}

export function convertEventToDateRange({ date, startTime, endTime }: Event) {
  return {
    start: parseDateTime(date, startTime),
    end: parseDateTime(date, endTime),
  };
}

// 두 일정이 겹치는지 확인하는 함수
export function isOverlapping(event1: Event, event2: Event) {
  const { start: start1, end: end1 } = convertEventToDateRange(event1);
  const { start: start2, end: end2 } = convertEventToDateRange(event2);

  return start1 < end2 && start2 < end1;
}

// 겹치는 일정을 찾는 함수
export function findOverlappingEvents(newEvent: Event, events: Event[]) {
  return events.filter((event) => event.id !== newEvent.id && isOverlapping(event, newEvent));
}
