import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test, vi } from "vitest";
import { ReactElement } from "react";
import { act, render, screen, within } from "@testing-library/react";
import App from "../App";
import { userEvent } from "@testing-library/user-event";
import createMockServer from "./createMockServer";
import { Event } from "../types";

const setup = (element: ReactElement) => {
  const user = userEvent.setup();
  return { ...render(element), user };
};

const MOCK_EVENT_1: Event = {
  id: 1,
  title: "기존 회의",
  date: "2024-07-15",
  startTime: "09:00",
  endTime: "10:00",
  description: "기존 팀 미팅",
  location: "회의실 B",
  category: "업무",
  repeat: { type: "none", interval: 0 },
  notificationTime: 10,
};

const events: Event[] = [{ ...MOCK_EVENT_1 }];

const server = createMockServer(events);

// 각 테스트 케이스가 실행되기 전에 매번 실행됩니다.
beforeEach(() => {
  vi.useFakeTimers({
    toFake: ["setInterval", "Date"],
  });
  vi.setSystemTime(new Date(2024, 6, 1));
});

// 모든 테스트 케이스가 실행되기 전에 한 번만 실행됩니다.
beforeAll(() => server.listen());

// 모든 테스트 케이스가 완료된 후 한 번만 실행됩니다.
afterAll(() => server.close());

// 각 테스트 케이스가 완료된 후 매번 실행됩니다.
afterEach(() => {
  events.length = 0;
  events.push({ ...MOCK_EVENT_1 });
  vi.useRealTimers();
});

describe("일정 관리 애플리케이션 통합 테스트", () => {
  describe("반복 유형 선택", () => {
    test("반복 유형 선택 테스트 (매주)", async () => {
      const { user } = setup(<App />);

      // 일정 정보 입력
      await user.type(screen.getByLabelText("제목"), "새 회의2");
      await user.type(screen.getByLabelText("날짜"), "2024-07-21");
      await user.type(screen.getByLabelText("시작 시간"), "14:00");
      await user.type(screen.getByLabelText("종료 시간"), "15:00");
      await user.type(screen.getByLabelText("설명"), "프로젝트 진행 상황 논의2");
      await user.type(screen.getByLabelText("위치"), "회의실 B");
      await user.selectOptions(screen.getByLabelText("카테고리"), "업무");
      await user.selectOptions(screen.getByLabelText("반복 유형"), "매주");

      // 저장 버튼 클릭
      await user.click(screen.getByTestId("event-submit-button"));

      // 새로 추가된 일정이 목록에 표시되는지 확인
      const eventList = screen.getByTestId("event-list");
      expect(eventList).toHaveTextContent("새 회의2");
      expect(eventList).toHaveTextContent("2024-07-21");
      expect(eventList).toHaveTextContent("14:00 - 15:00");
      expect(eventList).toHaveTextContent("프로젝트 진행 상황 논의2");
      expect(eventList).toHaveTextContent("회의실 B");
      expect(eventList).toHaveTextContent("업무");
      expect(eventList).toHaveTextContent("1주마다");
    });

    test("반복 유형 선택 테스트 (매월)", async () => {
      const { user } = setup(<App />);

      // 일정 정보 입력
      await user.type(screen.getByLabelText("제목"), "새 회의2");
      await user.type(screen.getByLabelText("날짜"), "2024-07-21");
      await user.type(screen.getByLabelText("시작 시간"), "14:00");
      await user.type(screen.getByLabelText("종료 시간"), "15:00");
      await user.type(screen.getByLabelText("설명"), "프로젝트 진행 상황 논의2");
      await user.type(screen.getByLabelText("위치"), "회의실 B");
      await user.selectOptions(screen.getByLabelText("카테고리"), "업무");
      await user.selectOptions(screen.getByLabelText("반복 유형"), "매월");

      // 저장 버튼 클릭
      await user.click(screen.getByTestId("event-submit-button"));

      // 새로 추가된 일정이 목록에 표시되는지 확인
      const eventList = screen.getByTestId("event-list");
      expect(eventList).toHaveTextContent("새 회의2");
      expect(eventList).toHaveTextContent("2024-07-21");
      expect(eventList).toHaveTextContent("14:00 - 15:00");
      expect(eventList).toHaveTextContent("프로젝트 진행 상황 논의2");
      expect(eventList).toHaveTextContent("회의실 B");
      expect(eventList).toHaveTextContent("업무");
      expect(eventList).toHaveTextContent("1월마다");
    });

    test("반복 유형 선택 테스트 (매년)", async () => {
      const { user } = setup(<App />);

      // 일정 정보 입력
      await user.type(screen.getByLabelText("제목"), "새 회의2");
      await user.type(screen.getByLabelText("날짜"), "2024-07-21");
      await user.type(screen.getByLabelText("시작 시간"), "14:00");
      await user.type(screen.getByLabelText("종료 시간"), "15:00");
      await user.type(screen.getByLabelText("설명"), "프로젝트 진행 상황 논의2");
      await user.type(screen.getByLabelText("위치"), "회의실 B");
      await user.selectOptions(screen.getByLabelText("카테고리"), "업무");
      await user.selectOptions(screen.getByLabelText("반복 유형"), "매년");

      // 저장 버튼 클릭
      await user.click(screen.getByTestId("event-submit-button"));

      // 새로 추가된 일정이 목록에 표시되는지 확인
      const eventList = screen.getByTestId("event-list");
      expect(eventList).toHaveTextContent("새 회의2");
      expect(eventList).toHaveTextContent("2024-07-21");
      expect(eventList).toHaveTextContent("14:00 - 15:00");
      expect(eventList).toHaveTextContent("프로젝트 진행 상황 논의2");
      expect(eventList).toHaveTextContent("회의실 B");
      expect(eventList).toHaveTextContent("업무");
      expect(eventList).toHaveTextContent("1년마다");
    });
  });

  describe("반복 간격 선택", () => {
    test("반복 유형 선택 테스트 (매주)", async () => {
      const { user } = setup(<App />);

      // 일정 정보 입력
      await user.type(screen.getByLabelText("제목"), "새 회의2");
      await user.type(screen.getByLabelText("날짜"), "2024-07-21");
      await user.type(screen.getByLabelText("시작 시간"), "14:00");
      await user.type(screen.getByLabelText("종료 시간"), "15:00");
      await user.type(screen.getByLabelText("설명"), "프로젝트 진행 상황 논의2");
      await user.type(screen.getByLabelText("위치"), "회의실 B");
      await user.selectOptions(screen.getByLabelText("카테고리"), "업무");
      await user.selectOptions(screen.getByLabelText("반복 유형"), "매주");
      await user.type(screen.getByLabelText("반복 간격"), "3");

      // 저장 버튼 클릭
      await user.click(screen.getByTestId("event-submit-button"));

      // 새로 추가된 일정이 목록에 표시되는지 확인
      const eventList = screen.getByTestId("event-list");
      expect(eventList).toHaveTextContent("새 회의2");
      expect(eventList).toHaveTextContent("2024-07-21");
      expect(eventList).toHaveTextContent("14:00 - 15:00");
      expect(eventList).toHaveTextContent("프로젝트 진행 상황 논의2");
      expect(eventList).toHaveTextContent("회의실 B");
      expect(eventList).toHaveTextContent("업무");
      expect(eventList).toHaveTextContent("3주마다");
    });

    test("반복 유형 선택 테스트 (매월)", async () => {
      const { user } = setup(<App />);

      // 일정 정보 입력
      await user.type(screen.getByLabelText("제목"), "새 회의2");
      await user.type(screen.getByLabelText("날짜"), "2024-07-21");
      await user.type(screen.getByLabelText("시작 시간"), "14:00");
      await user.type(screen.getByLabelText("종료 시간"), "15:00");
      await user.type(screen.getByLabelText("설명"), "프로젝트 진행 상황 논의2");
      await user.type(screen.getByLabelText("위치"), "회의실 B");
      await user.selectOptions(screen.getByLabelText("카테고리"), "업무");
      await user.selectOptions(screen.getByLabelText("반복 유형"), "매월");
      await user.type(screen.getByLabelText("반복 간격"), "5");

      // 저장 버튼 클릭
      await user.click(screen.getByTestId("event-submit-button"));

      // 새로 추가된 일정이 목록에 표시되는지 확인
      const eventList = screen.getByTestId("event-list");
      expect(eventList).toHaveTextContent("새 회의2");
      expect(eventList).toHaveTextContent("2024-07-21");
      expect(eventList).toHaveTextContent("14:00 - 15:00");
      expect(eventList).toHaveTextContent("프로젝트 진행 상황 논의2");
      expect(eventList).toHaveTextContent("회의실 B");
      expect(eventList).toHaveTextContent("업무");
      expect(eventList).toHaveTextContent("5월마다");
    });

    test("반복 유형 선택 테스트 (매년)", async () => {
      const { user } = setup(<App />);

      // 일정 정보 입력
      await user.type(screen.getByLabelText("제목"), "새 회의2");
      await user.type(screen.getByLabelText("날짜"), "2024-07-21");
      await user.type(screen.getByLabelText("시작 시간"), "14:00");
      await user.type(screen.getByLabelText("종료 시간"), "15:00");
      await user.type(screen.getByLabelText("설명"), "프로젝트 진행 상황 논의2");
      await user.type(screen.getByLabelText("위치"), "회의실 B");
      await user.selectOptions(screen.getByLabelText("카테고리"), "업무");
      await user.selectOptions(screen.getByLabelText("반복 유형"), "매년");
      await user.type(screen.getByLabelText("반복 간격"), "4");

      // 저장 버튼 클릭
      await user.click(screen.getByTestId("event-submit-button"));

      // 새로 추가된 일정이 목록에 표시되는지 확인
      const eventList = screen.getByTestId("event-list");
      expect(eventList).toHaveTextContent("새 회의2");
      expect(eventList).toHaveTextContent("2024-07-21");
      expect(eventList).toHaveTextContent("14:00 - 15:00");
      expect(eventList).toHaveTextContent("프로젝트 진행 상황 논의2");
      expect(eventList).toHaveTextContent("회의실 B");
      expect(eventList).toHaveTextContent("업무");
      expect(eventList).toHaveTextContent("4년마다");
      //expect(within(eventList).getByText("4년마다")).toBeInTheDocument(); 이건 왜 안될까..
    });
  });

  describe("달력", () => {
    test("반복 유형 선택 테스트 (매월)", async () => {
      const { user } = setup(<App />);

      // 일정 정보 입력
      await user.type(screen.getByLabelText("제목"), "반복");
      await user.type(screen.getByLabelText("날짜"), "2024-07-21");
      await user.type(screen.getByLabelText("시작 시간"), "14:00");
      await user.type(screen.getByLabelText("종료 시간"), "15:00");
      await user.type(screen.getByLabelText("설명"), "프로젝트 진행 상황 논의2");
      await user.type(screen.getByLabelText("위치"), "회의실 B");
      await user.selectOptions(screen.getByLabelText("카테고리"), "업무");
      await user.selectOptions(screen.getByLabelText("반복 유형"), "매월");
      await user.type(screen.getByLabelText("반복 간격"), "1");

      // 저장 버튼 클릭
      await user.click(screen.getByTestId("event-submit-button"));

      let monthView = screen.getByTestId("month-view");
      expect(monthView).toHaveTextContent("반복");

      // 8월 뷰로 변경
      vi.setSystemTime(new Date(2024, 7, 1));
      monthView = screen.getByTestId("month-view");
      expect(monthView).toHaveTextContent("반복");

      // 9월 뷰로 변경
      vi.setSystemTime(new Date(2024, 8, 1));
      monthView = screen.getByTestId("month-view");
      expect(monthView).toHaveTextContent("반복");
    });
  });
});
