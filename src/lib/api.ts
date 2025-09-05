import { BACKEND_URL, API_ENDPOINTS, getWebSocketProtocol } from "./constants";
import type {
  StudentAttributes,
  LogEntry,
  BatchProgressData,
  DownloadOptions,
  ApiError,
} from "./types";

// Utility function to handle API errors
const handleApiError = async (response: Response): Promise<never> => {
  const error: ApiError = {
    message: `HTTP ${response.status}: ${response.statusText}`,
    status: response.status,
  };

  try {
    const errorData = await response.json();
    error.details = errorData;
    error.message = errorData.message || error.message;
  } catch {
    // If response is not JSON, use default error message
  }

  throw error;
};

// Download individual student degree plan
export async function downloadDegreePlan(studentId: string): Promise<void> {
  const url = `${BACKEND_URL}${API_ENDPOINTS.DEGREE_PLAN_DOWNLOAD}?student_id=${studentId}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      await handleApiError(response);
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const today = new Date();

    // Format downloaded file name
    a.download = `${studentId}_AcadYear_Major_DegreePlan_With_Metrics_${today
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "")}.csv`;
    a.href = blobUrl;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    window.URL.revokeObjectURL(blobUrl);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error downloading degree plan:", error);
    throw error;
  }
}

// Download batch of degree plans
export async function downloadDegreePlanBatch(
  studentIds: string[],
  options: DownloadOptions = {},
  onProgress?: (
    progress: number,
    total: number,
    completed?: number,
    failed?: number
  ) => void
): Promise<void> {
  const { toLocal = false } = options;
  const url = toLocal
    ? `${BACKEND_URL}${API_ENDPOINTS.DEGREE_PLAN_DOWNLOAD_BATCH}`
    : `${BACKEND_URL}${API_ENDPOINTS.DEGREE_PLAN_DOWNLOAD_SERVER}`;

  const wsUrl = `${BACKEND_URL.replace("https", getWebSocketProtocol())}${
    API_ENDPOINTS.DEGREE_PLAN_DOWNLOAD_BATCH_PROGRESS
  }`;

  const numStudents = studentIds.length;
  let ws: WebSocket | null = null;
  const startTime = Date.now();

  try {
    // Set up WebSocket for progress tracking
    if (onProgress) {
      ws = await openWebSocket(wsUrl, (data: BatchProgressData) => {
        onProgress(data.progress, numStudents, data.completed, data.failed);

        if (data.progress === numStudents) {
          const endTime = Date.now();
          const totalTime = (endTime - startTime) / 1000;
          console.log(
            `${numStudents} completed in ${totalTime.toFixed(2)} seconds`
          );
        }

        if (data.error) {
          console.error("WebSocket error:", data.error);
          ws?.close();
        }
      });
    }

    // Make the API request
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student_ids: studentIds }),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    // Handle local download
    if (toLocal) {
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = blobUrl;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    }
  } catch (error) {
    console.error("Error downloading batch:", error);
    throw error;
  } finally {
    ws?.close();
  }
}

// Get student attributes
export async function getStudentAttributes(
  studentId: string
): Promise<StudentAttributes> {
  const url = `${BACKEND_URL}${API_ENDPOINTS.STUDENT_ATTRIBUTES}?student_id=${studentId}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      await handleApiError(response);
    }

    const attributes = await response.json();
    return attributes;
  } catch (error) {
    console.error("Error fetching student attributes:", error);
    throw error;
  }
}

// Get logs (requires authentication)
export async function getLogs(): Promise<LogEntry[]> {
  const url = `${BACKEND_URL}${API_ENDPOINTS.LOGS}`;
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication token not found");
  }

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const logs = await response.json();
    return logs;
  } catch (error) {
    console.error("Error fetching logs:", error);
    throw error;
  }
}

// WebSocket helper function
function openWebSocket(
  url: string,
  onMessage: (data: BatchProgressData) => void
): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(url);

    socket.onopen = () => {
      console.log("WebSocket connection established");
      resolve(socket);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      reject(error);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };
  });
}
