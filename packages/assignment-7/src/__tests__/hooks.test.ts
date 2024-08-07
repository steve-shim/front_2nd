import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useCalendarView } from "../hooks/useCalendarView.ts";
import { Event } from "../types.ts";
import createMockServer from "./createMockServer.ts";
import { useEventOperations } from "../hooks/useEventOperations.ts";
import { http, HttpResponse } from "msw";
import { useNotifications } from "../hooks/useNotifications.ts";
import { fillZero, formatDate } from "../utils/dateUtils.ts";
import { useSearch } from "../hooks/useSearch.ts";

describe("단위 테스트: 커스텀훅", () => {
  describe("useSearch >", () => {
    const mockEvents: Event[] = [
      {
        id: 1,
        title: "회의",
        date: "2024-07-01",
        startTime: "10:00",
        endTime: "11:00",
        description: "팀 회의",
        location: "회의실",
        category: "업무",
        repeat: { type: "none", interval: 0 },
        notificationTime: 10,
      },
      {
        id: 2,
        title: "점심 약속",
        date: "2024-07-02",
        startTime: "12:00",
        endTime: "13:00",
        description: "친구와 점심",
        location: "레스토랑",
        category: "개인",
        repeat: { type: "none", interval: 0 },
        notificationTime: 10,
      },
      {
        id: 3,
        title: "운동",
        date: "2024-07-03",
        startTime: "18:00",
        endTime: "19:00",
        description: "헬스장 가기",
        location: "헬스장",
        category: "개인",
        repeat: { type: "none", interval: 0 },
        notificationTime: 10,
      },
    ];

    const currentDate = new Date("2024-07-01");
    const view = "month" as const;

    test("검색어가 비어있을 때 모든 이벤트를 반환해야 한다", () => {
      const { result } = renderHook(() => useSearch(mockEvents, currentDate, view));

      expect(result.current.filteredEvents).toEqual(mockEvents);
    });

    test("검색어에 맞는 이벤트만 필터링해야 한다", () => {
      const { result } = renderHook(() => useSearch(mockEvents, currentDate, view));

      act(() => {
        result.current.setSearchTerm("회의");
      });

      expect(result.current.filteredEvents).toEqual([mockEvents[0]]);
    });

    test("검색어가 제목, 설명, 위치 중 하나라도 일치하면 해당 이벤트를 반환해야 한다", () => {
      const { result } = renderHook(() => useSearch(mockEvents, currentDate, view));

      act(() => {
        result.current.setSearchTerm("점심");
      });

      expect(result.current.filteredEvents).toEqual([mockEvents[1]]);
    });

    test("검색어 대소문자를 구분하지 않아야 한다", () => {
      const { result } = renderHook(() => useSearch(mockEvents, currentDate, view));

      act(() => {
        result.current.setSearchTerm("헬스장");
      });

      expect(result.current.filteredEvents).toEqual([mockEvents[2]]);
    });

    test("현재 뷰(주간/월간)에 해당하는 이벤트만 반환해야 한다", () => {
      const { result } = renderHook(() => useSearch(mockEvents, new Date("2024-07-10"), "week"));

      expect(result.current.filteredEvents).toEqual([]);
    });

    test("검색어를 변경하면 필터링된 결과가 즉시 업데이트되어야 한다", () => {
      const { result } = renderHook(() => useSearch(mockEvents, currentDate, view));

      act(() => {
        result.current.setSearchTerm("회의");
      });
      expect(result.current.filteredEvents).toEqual([mockEvents[0]]);

      act(() => {
        result.current.setSearchTerm("점심");
      });
      expect(result.current.filteredEvents).toEqual([mockEvents[1]]);
    });
  });
});
