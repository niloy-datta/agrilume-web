"use client";

import { useEffect, useRef } from "react";

/** Always holds the latest value; updated after render so event handlers never see stale state. */
export function useLatest<T>(value: T) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref;
}
