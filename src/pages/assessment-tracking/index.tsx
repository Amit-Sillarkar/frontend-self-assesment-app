import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EyeIcon, FileText, Clock, CheckCircle, Percent } from 'lucide-react';
import PageHeader from '@/components/page-header';
import TableCard from '@/components/table-card';
import DataTable from '@/components/data-table';
import SearchFilterBar from '@/components/search-filter-bar';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePagination } from '@/components/table-pagination';
import type { ColumnDef, RowAction } from '@/types/table';
import { submittedAssessments } from '@/mockdata/assessment-tracking';
import { type AssessmentTrackingRecord } from './type';
import AssessmentViewModal from './components/assessment-view-modal';
import { getStatusBadge } from './components/statusbadge';


const COLUMNS: ColumnDef<AssessmentTrackingRecord>[] = [
  {
    key: "employeeName",
    header: "Employee Name",
    render: (r) => (
      <span className="font-medium text-foreground text-sm">{r.employeeName}</span>
    ),
  },
  {
    key: "department",
    header: "Department",
    hideBelow: "lg",
    render: (r) => (
      <span className="text-xs text-muted-foreground">{r.department}</span>
    ),
  },
  {
    key: "assessmentName",
    header: "Assessment",
    render: (r) => (
      <span className="text-sm">{r.assessmentName}</span>
    ),
  },
  {
    key: "submittedOn",
    header: "Submitted On",
    hideBelow: "md",
    render: (r) => (
      <span className="text-xs text-muted-foreground">{r.submittedOn}</span>
    ),
  },
  {
    key: "score",
    header: "Score",
    render: (r) => (
      <span className="font-medium text-sm">{r.score}</span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (r) => getStatusBadge(r.status),
  },
];

export default function AssessmentTrackingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [designationFilter, setDesignationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const allData = submittedAssessments as AssessmentTrackingRecord[];

  // --- 1. DYNAMIC DASHBOARD STATS ---
  const dashboardStats = useMemo(() => {
    const total = allData.length;
    const pending = allData.filter(item => item.status === 'Under Review').length;
    const completed = allData.filter(item => item.status === 'Completed').length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { total, pending, completed, rate };
  }, [allData]);

  // --- 2. DYNAMIC DROPDOWN OPTIONS ---
  const uniqueDesignations = useMemo(() => {
    const departments = allData.map(item => item.department);
    return Array.from(new Set(departments));
  }, [allData]);

  const uniqueStatuses = useMemo(() => {
    const statuses = allData.map(item => item.status);
    return Array.from(new Set(statuses));
  }, [allData]);

  // --- 3. URL MODAL STATE ---
  const viewRecordId = searchParams.get("viewRecord");
  const viewRecord = useMemo(
    () => allData.find((r) => r.id === viewRecordId) || null,
    [allData, viewRecordId]
  );

  // --- 4. DATA FILTERING ---
  const filteredData = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    
    return allData.filter(item => {
      // Search matching
      const matchesSearch = item.employeeName.toLowerCase().includes(lowerQuery) ||
                            item.assessmentName.toLowerCase().includes(lowerQuery);
      
      // Status matching (Exact match now since options are dynamically generated)
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      
      // Designation/Department matching (Exact match)
      const matchesDesignation = designationFilter === "all" || item.department === designationFilter;

      return matchesSearch && matchesStatus && matchesDesignation;
    });
  }, [allData, searchQuery, statusFilter, designationFilter]);

  // Initialize Pagination Hook
  const { paginated, PaginationBar } = usePagination(filteredData);

  // Clear modal URL parameter
  const clearModals = () => {
    searchParams.delete("viewRecord");
    setSearchParams(searchParams);
  };

  // Define Row Actions
  const rowActions: RowAction<AssessmentTrackingRecord>[] = [
    {
      icon: <EyeIcon className="w-4 h-4" />,
      label: "View Submission",
      onClick: (record) => {
        searchParams.set("viewRecord", record.id);
        setSearchParams(searchParams);
      },
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title="Assessment Tracking" 
        subtitle="Monitor and track all submitted assessments across the organization"
      />

      {/* --- DASHBOARD METRICS --- */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 pt-2">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">Total Assessments</p>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold">{dashboardStats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">All submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold">{dashboardStats.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting action</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">Completed</p>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold">{dashboardStats.completed}</div>
            <p className="text-xs text-muted-foreground mt-1">Fully processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
              <Percent className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{dashboardStats.rate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Based on total</p>
          </CardContent>
        </Card>
      </div>

      <TableCard 
        title="Submitted Assessments"
        count={filteredData.length}
        searchArea={
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <SearchFilterBar 
              search={searchQuery} 
              onSearchChange={setSearchQuery} 
              searchPlaceholder="Search by employee or assessment..." 
            />
            
            <Select value={designationFilter} onValueChange={setDesignationFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Designation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Designations</SelectItem>
                {/* Dynamically mapped designations */}
                {uniqueDesignations.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {/* Dynamically mapped statuses */}
                {uniqueStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      >
        <DataTable
          columns={COLUMNS}
          data={paginated}
          actions={rowActions}
          emptyMessage="No submitted assessments found matching your criteria."
        />
        <PaginationBar />
      </TableCard>

      {/* Responsive View Modal */}
      <AssessmentViewModal record={viewRecord} onClose={clearModals} />
    </div>
  );
}