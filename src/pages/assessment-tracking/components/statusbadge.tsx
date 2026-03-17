import { Badge } from "lucide-react";

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Completed':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-none">Completed</Badge>;
    case 'Under Review':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-none">Under Review</Badge>;
    case 'Needs Revision':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-none">Needs Revision</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};