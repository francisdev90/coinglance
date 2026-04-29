"use client";

import { useState, useEffect } from "react";

export function useUpdateTimer(lastUpdated: Date | null): string | null {
  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    if (!lastUpdated) return;
    const tick = () => {
      setSecondsAgo(Math.floor((Date.now() - lastUpdated.getTime()) / 1000));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lastUpdated]);

  if (!lastUpdated) return null;
  if (secondsAgo < 60) return `${secondsAgo}s ago`;
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m ago`;
  return `${Math.floor(secondsAgo / 3600)}h ago`;
}
