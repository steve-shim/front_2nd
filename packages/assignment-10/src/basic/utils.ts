export const fill2 = (n: number) => `0${n}`.substr(-2);

export const parseHnM = (current: number) => {
  const date = new Date(current);
  return `${fill2(date.getHours())}:${fill2(date.getMinutes())}`;
};

const getTimeRange = (value: string): number[] => {
  const [start, end] = value.split('~').map(Number);
  if (end === undefined) return [start];
  return Array(end - start + 1)
    .fill(start)
    .map((v, k) => v + k);
};

export const parseSchedule = (schedule: string) => {
  const schedules = schedule.split('<p>');
  return schedules.map(schedule => {
    const reg = /^([가-힣])(\d+(~\d+)?)(.*)/;

    const [day] = schedule.split(/(\d+)/);

    const range = getTimeRange(schedule.replace(reg, '$2'));

    const room = schedule.replace(reg, '$4')?.replace(/\(|\)/g, '');

    return { day, range, room };
  });
};

export function deepEquals(target1, target2) {
  console.log('target1, target2', target1, target2);
  // 재귀적으로 내부 객체까지 비교
  if (target1 === target2) {
    return true;
  }
  if (Array.isArray(target1) && Array.isArray(target2) && target1.length === target2.length) {
    return target1.every((v, k) => deepEquals(v, target2[k]));
  }
  if (target1.constructor === Object && target2.constructor === Object) {
    const key1 = Object.keys(target1);
    const key2 = Object.keys(target2);
    return (
      target1 === target2 || (key1.length === key2.length && key1.every(key => deepEquals(target1[key], target2[key])))
    );
  }
  return false;
}
