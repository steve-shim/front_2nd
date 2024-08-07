import { describe, expect, test } from "vitest";
import { fillZero, formatDate, getWeekDates } from "../utils/dateUtils";
import { getFilteredEvents } from "../utils/eventUtils";

describe("단위 테스트: 날짜 및 시간 관리", () => {
  describe("getDaysInMonth 함수", () => {
    test.fails("주어진 월의 일 수를 정확히 반환한다");
  });

  describe("getWeekDates >", () => {
    test("주어진 날짜가 속한 주의 모든 날짜를 반환한다", () => {
      const date = new Date("2024-07-10"); // 수요일
      const weekDates = getWeekDates(date);
      expect(weekDates).toHaveLength(7);
      expect(weekDates[0].toISOString().split("T")[0]).toBe("2024-07-08"); // 월요일
      expect(weekDates[6].toISOString().split("T")[0]).toBe("2024-07-14"); // 일요일
    });

    test("연도를 넘어가는 주의 날짜를 정확히 처리한다", () => {
      const date = new Date("2024-12-30"); // 월요일
      const weekDates = getWeekDates(date);
      expect(weekDates[0].toISOString().split("T")[0]).toBe("2024-12-30"); // 월요일
      expect(weekDates[6].toISOString().split("T")[0]).toBe("2025-01-05"); // 일요일
    });
  });

  describe("getFilteredEvents >", () => {
    const events: Event[] = [
      {
        id: 1,
        title: "이벤트 1",
        date: "2024-07-01",
        startTime: "10:00",
        endTime: "11:00",
        description: "",
        location: "",
        category: "",
        repeat: { type: "none", interval: 0 },
        notificationTime: 0,
      },
      {
        id: 2,
        title: "이벤트 2",
        date: "2024-07-05",
        startTime: "14:00",
        endTime: "15:00",
        description: "",
        location: "",
        category: "",
        repeat: { type: "none", interval: 0 },
        notificationTime: 0,
      },
      {
        id: 3,
        title: "이벤트 3",
        date: "2024-07-10",
        startTime: "09:00",
        endTime: "10:00",
        description: "",
        location: "",
        category: "",
        repeat: { type: "none", interval: 0 },
        notificationTime: 0,
      },
    ];

    test("검색어에 맞는 이벤트만 반환해야 한다", () => {
      const result = getFilteredEvents(events, "이벤트 2", new Date("2024-07-01"), "month");
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("이벤트 2");
    });

    test("주간 뷰에서 해당 주의 이벤트만 반환해야 한다", () => {
      const result = getFilteredEvents(events, "", new Date("2024-07-01"), "week");
      expect(result).toHaveLength(2);
      expect(result.map((e) => e.title)).toEqual(["이벤트 1", "이벤트 2"]);
    });

    test("월간 뷰에서 해당 월의 이벤트만 반환해야 한다", () => {
      const result = getFilteredEvents(events, "", new Date("2024-07-01"), "month");
      expect(result).toHaveLength(3);
    });

    test("검색어와 날짜 필터링을 동시에 적용해야 한다", () => {
      const result = getFilteredEvents(events, "이벤트", new Date("2024-07-01"), "week");
      expect(result).toHaveLength(2);
      expect(result.map((e) => e.title)).toEqual(["이벤트 1", "이벤트 2"]);
    });
  });

  describe("fillZero >", () => {
    test("주어진 숫자를 지정된 자릿수만큼 0으로 채워야 한다", () => {
      expect(fillZero(5)).toBe("05");
      expect(fillZero(10)).toBe("10");
      expect(fillZero(3, 3)).toBe("003");
    });
  });

  describe("formatDate >", () => {
    test("날짜를 YYYY-MM-DD 형식으로 포맷팅해야 한다", () => {
      const testDate = new Date("2023-05-10");
      expect(formatDate(testDate)).toBe("2023-05-10");
      expect(formatDate(testDate, 15)).toBe("2023-05-15");
    });
  });

  describe("formatWeek 함수", () => {
    test.fails("주어진 날짜의 주 정보를 올바른 형식으로 반환한다");
  });

  describe("formatMonth 함수", () => {
    test.fails("주어진 날짜의 월 정보를 올바른 형식으로 반환한다");
  });

  describe("isDateInRange 함수", () => {
    test.fails("주어진 날짜가 특정 범위 내에 있는지 정확히 판단한다");
  });
});
