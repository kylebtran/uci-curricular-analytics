// Student and curriculum related types
export interface StudentOption {
  value: string;
  label: string;
  curriculum?: string;
  academicYear?: string;
}

export interface AcademicYearOption {
  value: string;
  label: string;
}

export interface CurriculumOption {
  value: string;
  label: string;
}

// API Response types
export interface StudentAttributes {
  studentId: string;
  name?: string;
  major?: string;
  academicYear?: string;
  curriculum?: string;
  gpa?: number;
  credits?: number;
  // Add other student attributes as needed
  [key: string]: any;
}

export interface LogEntry {
  timestamp: string;
  level: "info" | "warning" | "error" | "debug";
  message: string;
  details?: any;
}

export interface BatchProgressData {
  progress: number;
  total: number;
  completed: number;
  failed: number;
  error?: string;
}

// Running totals for sidebar display
export interface RunningTotals {
  totalFiltered: number;
  completed: number;
  failed: number;
}

// WebSocket message types
export interface WebSocketMessage {
  type: "progress" | "error" | "complete";
  data: BatchProgressData;
}

// Download options
export interface DownloadOptions {
  toLocal?: boolean;
}

// API Error type
export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}
