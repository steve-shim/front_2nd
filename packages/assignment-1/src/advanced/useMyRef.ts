// export function useMyRef<T>(initValue: T | null) {
//   return { current: initValue };
// }

// import { useMemo } from "react";

// export function useMyRef<T>(initValue: T | null) {
//   const item = { current: initValue };
//   const ref = useMemo(() => item, []);
//   return ref;
// }

import { useState } from "react";

export function useMyRef<T>(initValue: T | null) {
  // 사실 ref도 state의 한 종류입니다. set을 하지 않기 때문에, 언제나 동일한 state로 존재합니다.
  const [ref] = useState<{ current: typeof initValue }>({ current: initValue });
  return ref;
}
