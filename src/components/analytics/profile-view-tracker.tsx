"use client";

import { useEffect } from "react";

export function ProfileViewTracker({ username }: { username: string }) {
  useEffect(() => {
    void fetch(`/api/profiles/${encodeURIComponent(username)}/view`, {
      method: "POST",
      keepalive: true,
      credentials: "omit",
    });
  }, [username]);

  return null;
}
