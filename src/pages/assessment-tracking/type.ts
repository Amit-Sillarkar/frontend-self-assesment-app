export interface AssessmentTrackingRecord {
  id: string;
  employeeName: string;
  department: string;
  assessmentName: string;
  submittedOn: string;
  score: string;
  status: 'Completed' | 'Under Review' | 'Needs Revision';
}