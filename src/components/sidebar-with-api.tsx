"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApi } from "@/lib/hooks/useApi";
import { Upload, Download, Plus, Settings, CloudDownload } from "lucide-react";
import type {
  StudentOption,
  AcademicYearOption,
  CurriculumOption,
} from "@/lib/types";

interface SidebarWithApiProps {
  studentIds: StudentOption[];
  academicYears: AcademicYearOption[];
  curricula: CurriculumOption[];
  selectedAcademicYear: AcademicYearOption;
  selectedCurriculum: CurriculumOption;
  selectedStudentId?: StudentOption;
  onStudentSelect?: (student: StudentOption) => void;
  onAcademicYearSelect?: (year: AcademicYearOption) => void;
  onCurriculumSelect?: (curriculum: CurriculumOption) => void;
}

export function SidebarWithApi({
  studentIds,
  academicYears,
  curricula,
  selectedAcademicYear,
  selectedCurriculum,
  selectedStudentId,
  onStudentSelect,
  onAcademicYearSelect,
  onCurriculumSelect,
}: SidebarWithApiProps) {
  const [isLocal, setIsLocal] = useState(true);
  const [popup, setPopup] = useState<any>(null);

  const {
    isLoading,
    error,
    runningTotals,
    downloadDegreePlan,
    downloadDegreePlanBatch,
    getStudentAttributes,
    getLogs,
    clearError,
    updateFilteredTotal,
  } = useApi();

  // Filter students based on selected criteria
  const filteredStudentIds = studentIds.filter((item) => {
    return (
      (selectedCurriculum.value === "All Curricula" ||
        selectedCurriculum.value === item.curriculum) &&
      (selectedAcademicYear.value === "All Academic Years" ||
        selectedAcademicYear.value === item.academicYear)
    );
  });

  // Update filtered total when filters change
  React.useEffect(() => {
    updateFilteredTotal(filteredStudentIds.length);
  }, [filteredStudentIds.length, updateFilteredTotal]);

  const handleDownloadSingle = async () => {
    if (!selectedStudentId) return;

    try {
      await downloadDegreePlan(selectedStudentId.value);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleDownloadBatch = async () => {
    const studentIdsToDownload = filteredStudentIds.map(
      (student) => student.value
    );

    try {
      await downloadDegreePlanBatch(studentIdsToDownload, { toLocal: isLocal });
    } catch (error) {
      console.error("Batch download failed:", error);
    }
  };

  const handleGetStudentAttributes = async () => {
    if (!selectedStudentId) return;

    try {
      const attributes = await getStudentAttributes(selectedStudentId.value);
      setPopup(attributes);
    } catch (error) {
      console.error("Failed to get student attributes:", error);
    }
  };

  const handleGetLogs = async () => {
    try {
      const logs = await getLogs();
      setPopup(logs);
    } catch (error) {
      console.error("Failed to get logs:", error);
    }
  };

  return (
    <div className="w-80 h-screen bg-background border-r border-border flex flex-col">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-6">
          {/* Upload Area */}
          <div className="w-full aspect-[3] bg-muted rounded-lg flex flex-col justify-center items-center border border-dashed border-border hover:bg-accent transition-colors">
            <Upload />
            <h3 className="text-sm font-medium text-muted-foreground">
              Upload CSV
            </h3>
          </div>

          {/* Student Selection Area */}
          <div className="space-y-2">
            {/* Your existing ComboBox components would go here */}
            {/* This is where you'd integrate your student, department, year, major selectors */}
          </div>

          {/* Status Section */}
          <div className="space-y-3">
            <div className="rounded-lg border p-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Filtered Students</span>
                <span className="font-medium">
                  {runningTotals.totalFiltered}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Completed</span>
                <span className="font-medium text-green-600">
                  {runningTotals.completed}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Failed</span>
                <span className="font-medium text-destructive">
                  {runningTotals.failed}
                </span>
              </div>
              {error && (
                <div className="flex items-center justify-between text-sm">
                  <span>Status</span>
                  <span className="font-medium text-destructive">Error</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Download Tabs & User Profile - Fixed at bottom */}
      <div className="border-t border-border bg-background">
        {/* Download Tabs */}
        <div className="p-4 pb-2">
          <Tabs
            value={isLocal ? "local" : "server"}
            onValueChange={(value) => setIsLocal(value === "local")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="local">Local</TabsTrigger>
              <TabsTrigger value="server">Server</TabsTrigger>
            </TabsList>

            {/* Action Buttons */}
            <div className="space-y-2 mt-3">
              <Button
                className="w-full"
                onClick={handleDownloadSingle}
                disabled={!selectedStudentId || isLoading}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Single
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleDownloadBatch}
                disabled={filteredStudentIds.length === 0 || isLoading}
              >
                <CloudDownload className="mr-2 h-4 w-4" />
                Download Batch ({filteredStudentIds.length})
              </Button>

              {/* Additional Action Buttons */}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={handleGetStudentAttributes}
                  disabled={!selectedStudentId || isLoading}
                >
                  Attributes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={handleGetLogs}
                  disabled={isLoading}
                >
                  Logs
                </Button>
              </div>
            </div>

            {/* Loading Indicator */}
            {isLoading && (
              <div className="mt-3 text-xs text-muted-foreground text-center">
                Processing downloads...
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive">
                {error.message}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-4 p-0 text-xs"
                  onClick={clearError}
                >
                  Dismiss
                </Button>
              </div>
            )}
          </Tabs>
        </div>

        {/* User Profile */}
        <div className="p-4 pt-2 border-t border-border/50">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/avatars/user.jpg" alt="User" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">John Doe</p>
              <p className="text-xs text-muted-foreground truncate">
                john.doe@uci.edu
              </p>
            </div>
            <Settings className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
          </div>
        </div>
      </div>

      {/* Popup Modal (you'd want to implement a proper modal component) */}
      {popup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md max-h-96 overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Data</h3>
              <Button variant="ghost" size="sm" onClick={() => setPopup(null)}>
                ×
              </Button>
            </div>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(popup, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
