import { http, HttpResponse } from "msw";

let events = [
  {
    id: 1,
    title: "팀 회의",
    date: "2024-07-20",
    startTime: "10:00",
    endTime: "11:00",
    description: "주간 팀 미팅",
    location: "회의실 A",
    category: "업무",
    repeat: { type: "weekly", interval: 1 },
    notificationTime: 1,
  },
  {
    id: 2,
    title: "점심 약속",
    date: "2024-07-21",
    startTime: "12:30",
    endTime: "13:30",
    description: "동료와 점심 식사",
    location: "회사 근처 식당",
    category: "개인",
    repeat: { type: "none", interval: 0 },
    notificationTime: 1,
  },
  {
    id: 3,
    title: "프로젝트 마감",
    date: "2024-07-25",
    startTime: "09:00",
    endTime: "18:00",
    description: "분기별 프로젝트 마감",
    location: "사무실",
    category: "업무",
    repeat: { type: "none", interval: 0 },
    notificationTime: 1,
  },
  {
    id: 4,
    title: "생일 파티",
    date: "2024-07-28",
    startTime: "19:00",
    endTime: "22:00",
    description: "친구 생일 축하",
    location: "친구 집",
    category: "개인",
    repeat: { type: "yearly", interval: 1 },
    notificationTime: 1,
  },
  {
    id: 5,
    title: "운동",
    date: "2024-07-22",
    startTime: "18:00",
    endTime: "19:00",
    description: "주간 운동",
    location: "헬스장",
    category: "개인",
    repeat: { type: "weekly", interval: 1 },
    notificationTime: 1,
  },
  {
    id: 6,
    title: "알림 테스트",
    description: "알림 테스트",
    location: "알림 테스트",
    category: "개인",
    repeat: { type: "weekly", interval: 1 },
    notificationTime: 10,
    ...(() => {
      const now = new Date();
      const startTime = new Date(now.getTime() + 5 * 60000); // 5분 후
      const endTime = new Date(startTime.getTime() + 60 * 60000); // 시작시간으로부터 1시간 후

      const formatDate = (date) => {
        return date.toISOString().split("T")[0];
      };

      const formatTime = (date) => {
        return date.toTimeString().split(" ")[0].substring(0, 5);
      };

      return {
        date: formatDate(now),
        startTime: formatTime(startTime),
        endTime: formatTime(endTime),
      };
    })(),
  },
];

export const mockApiHandlers = [
  // 일정 조회
  http.get("/api/events", () => {
    return HttpResponse.json(events);
  }),

  // 일정 추가
  http.post("/api/events", async ({ request }) => {
    const updates = await request.json();
    const newEvent = {
      id: Date.now(),
      ...updates,
    };
    events.push(newEvent);
    return HttpResponse.json(newEvent, { status: 201 });
  }),

  // 일정 수정
  http.put("/api/events/:id", async ({ params, request }) => {
    const { id } = params;
    const updates = await request.json();
    const eventIndex = events.findIndex((event) => event.id === parseInt(id));
    console.log("msw server", eventIndex);
    if (eventIndex > -1) {
      events[eventIndex] = { ...events[eventIndex], ...updates };
      return HttpResponse.json(events[eventIndex]);
    } else {
      return HttpResponse.json("Event not found", { status: 404 });
    }
  }),

  // 일정 삭제
  http.delete("/api/events/:id", ({ params }) => {
    const { id } = params;
    events = events.filter((event) => event.id !== parseInt(id));
    return new HttpResponse(null, { status: 204 });
  }),
];
