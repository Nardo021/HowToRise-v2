"use client";

import { useEffect } from "react";

async function report(scope: string, message: string, stack?: string) {
  try {
    await fetch("/api/errors/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scope,
        message,
        stack,
        path: window.location.pathname,
        userAgent: navigator.userAgent
      })
    });
  } catch {
    // ignore
  }
}

export function ErrorObserver() {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      void report("frontend", event.message, event.error?.stack);
    };
    const onReject = (event: PromiseRejectionEvent) => {
      void report("frontend", String(event.reason));
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onReject);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onReject);
    };
  }, []);
  return null;
}
