// Backend configuration
export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

// WebSocket protocol based on current protocol
export const getWebSocketProtocol = () => {
  if (typeof window !== "undefined") {
    return window.location.protocol === "https:" ? "wss" : "ws";
  }
  return "ws";
};

// API endpoints
export const API_ENDPOINTS = {
  DEGREE_PLAN_DOWNLOAD: "/degree_plan/download",
  DEGREE_PLAN_DOWNLOAD_BATCH: "/degree_plan/download/batch",
  DEGREE_PLAN_DOWNLOAD_SERVER: "/degree_plan/download/server",
  DEGREE_PLAN_DOWNLOAD_BATCH_PROGRESS: "/degree_plan/download/batch/progress",
  STUDENT_ATTRIBUTES: "/student_attributes",
  LOGS: "/logs",
} as const;
