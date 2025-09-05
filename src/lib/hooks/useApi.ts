"use client";

import { useState, useCallback } from "react";
import {
  downloadDegreePlan,
  downloadDegreePlanBatch,
  getStudentAttributes,
  getLogs,
} from "../api";
import type {
  StudentAttributes,
  LogEntry,
  DownloadOptions,
  ApiError,
  RunningTotals,
} from "../types";

// Custom hook for API operations
export function useApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [runningTotals, setRunningTotals] = useState<RunningTotals>({
    totalFiltered: 0,
    completed: 0,
    failed: 0,
  });

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Update filtered total (call this when filters change)
  const updateFilteredTotal = useCallback((total: number) => {
    setRunningTotals((prev) => ({
      ...prev,
      totalFiltered: total,
    }));
  }, []);

  // Download single degree plan
  const handleDownloadDegreePlan = useCallback(async (studentId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await downloadDegreePlan(studentId);
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Download batch degree plans
  const handleDownloadDegreePlanBatch = useCallback(
    async (studentIds: string[], options: DownloadOptions = {}) => {
      setIsLoading(true);
      setError(null);

      // Set initial totals
      setRunningTotals((prev) => ({
        ...prev,
        totalFiltered: studentIds.length,
        completed: 0,
        failed: 0,
      }));

      try {
        await downloadDegreePlanBatch(
          studentIds,
          options,
          (progress, total, completed, failed) => {
            setRunningTotals((prev) => ({
              ...prev,
              completed: completed || 0,
              failed: failed || 0,
            }));
          }
        );
      } catch (err) {
        setError(err as ApiError);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Get student attributes
  const handleGetStudentAttributes = useCallback(
    async (studentId: string): Promise<StudentAttributes> => {
      setIsLoading(true);
      setError(null);

      try {
        const attributes = await getStudentAttributes(studentId);
        return attributes;
      } catch (err) {
        setError(err as ApiError);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Get logs
  const handleGetLogs = useCallback(async (): Promise<LogEntry[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const logs = await getLogs();
      return logs;
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    runningTotals,
    clearError,
    updateFilteredTotal,
    downloadDegreePlan: handleDownloadDegreePlan,
    downloadDegreePlanBatch: handleDownloadDegreePlanBatch,
    getStudentAttributes: handleGetStudentAttributes,
    getLogs: handleGetLogs,
  };
}
