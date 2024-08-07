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
  describe("useNotifications >", () => {
    const 초 = 1000;
    const 분 = 초 * 60;

    const parseHM = (timestamp: number) => {
      const date = new Date(timestamp);
      const h = fillZero(date.getHours());
      const m = fillZero(date.getMinutes());
      return `${h}:${m}`;
    };

    beforeAll(() => {
      vi.useFakeTimers({
        toFake: ["setInterval", "Date"],
      });
    });

    afterAll(() => {
      vi.useRealTimers();
    });

    test("초기 상태에서는 알림이 없어야 한다", () => {
      const { result } = renderHook(() => useNotifications([]));
      expect(result.current.notifications).toEqual([]);
      expect(result.current.notifiedEvents).toEqual([]);
    });

    test("알림 시간이 되면 새로운 알림을 생성해야 한다", () => {
      const mockEvents: Event[] = [
        {
          id: 1,
          title: "테스트 이벤트",
          date: formatDate(new Date()),
          startTime: parseHM(Date.now() + 10 * 분),
          endTime: parseHM(Date.now() + 20 * 분),
          description: "",
          location: "",
          category: "",
          repeat: { type: "none", interval: 0 },
          notificationTime: 5,
        },
      ];

      const { result } = renderHook(() => useNotifications(mockEvents));

      expect(result.current.notifications).toHaveLength(0);

      vi.setSystemTime(new Date(Date.now() + 5 * 분));

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.notifications).toHaveLength(1);
      expect(result.current.notifiedEvents).toContain(1);
    });

    test("알림을 제거할 수 있어야 한다", () => {
      const { result } = renderHook(() => useNotifications([]));

      act(() => {
        result.current.setNotifications([
          { id: 1, message: "테스트 알림 1" },
          { id: 2, message: "테스트 알림 2" },
        ]);
      });

      expect(result.current.notifications).toHaveLength(2);

      act(() => {
        result.current.removeNotification(0);
      });

      expect(result.current.notifications).toHaveLength(1);
      expect(result.current.notifications[0].message).toBe("테스트 알림 2");
    });

    test("이미 알림이 발생한 이벤트에 대해서는 중복 알림이 발생하지 않아야 한다", () => {
      const mockEvents: Event[] = [
        {
          id: 1,
          title: "테스트 이벤트",
          date: formatDate(new Date()),
          startTime: parseHM(Date.now() + 10 * 분),
          endTime: parseHM(Date.now() + 20 * 분),
          description: "",
          location: "",
          category: "",
          repeat: { type: "none", interval: 0 },
          notificationTime: 10,
        },
      ];

      const { result } = renderHook(() => useNotifications(mockEvents));

      vi.setSystemTime(new Date(Date.now() + 5 * 분));

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      vi.setSystemTime(new Date(Date.now() + 20 * 분));

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.notifications).toHaveLength(1); // 여전히 1개의 알림만 존재해야 함
    });
  });

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
