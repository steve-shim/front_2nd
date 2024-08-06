import { describe, expect, test } from "vitest";
import { fillZero, formatDate } from "../utils/dateUtils";

describe("단위 테스트: 날짜 및 시간 관리", () => {
  describe("getDaysInMonth 함수", () => {
    test.fails("주어진 월의 일 수를 정확히 반환한다");
  });

  describe("getWeekDates 함수", () => {
    test.fails("주어진 날짜가 속한 주의 모든 날짜를 반환한다");
    test.fails("연도를 넘어가는 주의 날짜를 정확히 처리한다");
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
