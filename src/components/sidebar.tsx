"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useApi } from "@/lib/hooks/useApi";
import type {
  StudentOption,
  AcademicYearOption,
  CurriculumOption,
} from "@/lib/types";
import {
  Home,
  Settings,
  User,
  BookOpen,
  GraduationCap,
  Calendar,
  FileText,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  Trash2,
  Edit,
  Check,
  ChevronsUpDown,
} from "lucide-react";

export default function Sidebar() {
  // State for each combobox
  const [studentOpen, setStudentOpen] = React.useState(false);
  const [studentValue, setStudentValue] = React.useState("");
  const [departmentOpen, setDepartmentOpen] = React.useState(false);
  const [departmentValue, setDepartmentValue] = React.useState("");
  const [yearOpen, setYearOpen] = React.useState(false);
  const [yearValue, setYearValue] = React.useState("");
  const [majorOpen, setMajorOpen] = React.useState(false);
  const [majorValue, setMajorValue] = React.useState("");
  const [isLocalTab, setIsLocalTab] = React.useState(true);

  // API hook for managing downloads and totals
  const {
    runningTotals,
    updateFilteredTotal,
    downloadDegreePlan,
    downloadDegreePlanBatch,
  } = useApi();

  // Data for each combobox
  const students = [
    { value: "john-doe", label: "John Doe" },
    { value: "jane-smith", label: "Jane Smith" },
    { value: "alex-johnson", label: "Alex Johnson" },
    { value: "maria-garcia", label: "Maria Garcia" },
    { value: "david-chen", label: "David Chen" },
    { value: "sarah-wilson", label: "Sarah Wilson" },
    { value: "michael-brown", label: "Michael Brown" },
    { value: "emily-davis", label: "Emily Davis" },
    { value: "robert-miller", label: "Robert Miller" },
    { value: "lisa-anderson", label: "Lisa Anderson" },
  ];

  const departments = [
    { value: "cs", label: "Computer Science" },
    { value: "math", label: "Mathematics" },
    { value: "physics", label: "Physics" },
    { value: "chemistry", label: "Chemistry" },
    { value: "biology", label: "Biology" },
    { value: "engineering", label: "Engineering" },
    { value: "psychology", label: "Psychology" },
    { value: "history", label: "History" },
    { value: "english", label: "English" },
    { value: "economics", label: "Economics" },
  ];

  const academicYears = [
    { value: "2024-2025", label: "2024-2025" },
    { value: "2023-2024", label: "2023-2024" },
    { value: "2022-2023", label: "2022-2023" },
    { value: "2021-2022", label: "2021-2022" },
    { value: "2020-2021", label: "2020-2021" },
    { value: "2019-2020", label: "2019-2020" },
  ];

  const majors = [
    { value: "computer-science", label: "Computer Science" },
    { value: "software-engineering", label: "Software Engineering" },
    { value: "data-science", label: "Data Science" },
    { value: "applied-mathematics", label: "Applied Mathematics" },
    { value: "pure-mathematics", label: "Pure Mathematics" },
    { value: "theoretical-physics", label: "Theoretical Physics" },
    { value: "applied-physics", label: "Applied Physics" },
    { value: "organic-chemistry", label: "Organic Chemistry" },
    { value: "biochemistry", label: "Biochemistry" },
    { value: "molecular-biology", label: "Molecular Biology" },
    { value: "mechanical-engineering", label: "Mechanical Engineering" },
    { value: "electrical-engineering", label: "Electrical Engineering" },
    { value: "civil-engineering", label: "Civil Engineering" },
    { value: "clinical-psychology", label: "Clinical Psychology" },
    { value: "cognitive-psychology", label: "Cognitive Psychology" },
    { value: "american-history", label: "American History" },
    { value: "world-history", label: "World History" },
    { value: "english-literature", label: "English Literature" },
    { value: "creative-writing", label: "Creative Writing" },
    { value: "macroeconomics", label: "Macroeconomics" },
    { value: "microeconomics", label: "Microeconomics" },
  ];

  // Calculate filtered students based on current selections
  const filteredStudents = React.useMemo(() => {
    return students.filter((student) => {
      const matchesDepartment =
        !departmentValue ||
        departments.find((d) => d.value === departmentValue)?.label ===
          student.label.split(" ")[0]; // Simple matching logic
      const matchesYear =
        !yearValue ||
        academicYears.find((y) => y.value === yearValue)?.label === "2024-2025"; // Simple matching logic
      const matchesMajor =
        !majorValue ||
        majors.find((m) => m.value === majorValue)?.label.includes("Computer"); // Simple matching logic

      return matchesDepartment && matchesYear && matchesMajor;
    });
  }, [studentValue, departmentValue, yearValue, majorValue]);

  // Update filtered total whenever filters change
  React.useEffect(() => {
    updateFilteredTotal(filteredStudents.length);
  }, [filteredStudents.length, updateFilteredTotal]);

  // Reusable ComboBox component
  const ComboBox = ({
    open,
    setOpen,
    value,
    setValue,
    data,
    placeholder,
  }: {
    open: boolean;
    setOpen: (open: boolean) => void;
    value: string;
    setValue: (value: string) => void;
    data: { value: string; label: string }[];
    placeholder: string;
  }) => (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? data.find((item) => item.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0">
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
          />
          <CommandEmpty>No {placeholder.toLowerCase()} found.</CommandEmpty>
          <CommandGroup>
            {data.map((item) => (
              <CommandItem
                key={item.value}
                value={item.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={`mr-2 h-4 w-4 ${
                    value === item.value ? "opacity-100" : "opacity-0"
                  }`}
                />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="w-80 h-screen bg-background border-r border-border flex flex-col">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          {/* <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">UCI Curricular Analytics</p>
        </div> */}

          {/* Quick Actions */}
          {/* <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="justify-start">
              <Plus className="mr-2 h-4 w-4" />
              New
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div> */}

          {/* Filter Options */}
          <div className="space-y-3">
            {/* <h3 className="text-sm font-medium text-muted-foreground">Filters</h3> */}
            <div className="w-full aspect-[3] bg-muted rounded-lg flex flex-col justify-center items-center border border-dashed border-outline">
              <Upload />
              <h3 className="text-sm font-medium text-muted-foreground">
                Upload CSV
              </h3>
            </div>
            <div className="space-y-2">
              <ComboBox
                open={studentOpen}
                setOpen={setStudentOpen}
                value={studentValue}
                setValue={setStudentValue}
                data={students}
                placeholder="Student"
              />

              <ComboBox
                open={departmentOpen}
                setOpen={setDepartmentOpen}
                value={departmentValue}
                setValue={setDepartmentValue}
                data={departments}
                placeholder="Department"
              />

              <ComboBox
                open={yearOpen}
                setOpen={setYearOpen}
                value={yearValue}
                setValue={setYearValue}
                data={academicYears}
                placeholder="Academic Year"
              />

              <ComboBox
                open={majorOpen}
                setOpen={setMajorOpen}
                value={majorValue}
                setValue={setMajorValue}
                data={majors}
                placeholder="Major"
              />
            </div>
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
            </div>
          </div>
        </div>
      </div>

      {/* Download Tabs & User Profile - Fixed at bottom */}
      <div>
        {/* Download Tabs */}
        <div className="p-4 pb-2">
          <Tabs
            value={isLocalTab ? "local" : "server"}
            onValueChange={(value) => setIsLocalTab(value === "local")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="local">Local</TabsTrigger>
              <TabsTrigger value="server">Server</TabsTrigger>
            </TabsList>

            {/* Action Buttons */}
            <div className="space-y-2 mt-3">
              {/* Single Student Download */}
              <Button
                className="w-full"
                onClick={() => {
                  if (studentValue) {
                    if (isLocalTab) {
                      // Local download - use single download API (always downloads locally)
                      downloadDegreePlan(studentValue);
                    } else {
                      // Server download - use batch API with single student
                      downloadDegreePlanBatch([studentValue], {
                        toLocal: false,
                      });
                    }
                  }
                }}
                disabled={!studentValue}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Selected {isLocalTab ? "(Local)" : "(Server)"}
              </Button>

              {/* Batch Download All Filtered */}
              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  downloadDegreePlanBatch(
                    filteredStudents.map((s) => s.value),
                    { toLocal: isLocalTab }
                  )
                }
                disabled={filteredStudents.length === 0}
              >
                <Plus className="mr-2 h-4 w-4" />
                Download All Filtered ({filteredStudents.length})
              </Button>
            </div>
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
    </div>
  );
}
