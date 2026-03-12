import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon, ClipboardList, ClockIcon, AlertCircle } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageHeader from "@/components/page-header";

import { MOCK_PENDING_ASSESSMENTS } from "@/mockdata/pending-assessments";

// Date formatter
function formatDisplayDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function PendingAssessmentsPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("latest");

    // ── Filtering and Sorting ──
    const filteredAndSorted = useMemo(() => {
        let result = MOCK_PENDING_ASSESSMENTS.filter(a => 
            a.title.toLowerCase().includes(search.toLowerCase()) || 
            a.description.toLowerCase().includes(search.toLowerCase())
        );

        if (sort === "latest") {
            result = result.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
        } else if (sort === "expiring") {
            result = result.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        }
        return result;
    }, [search, sort]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <PageHeader title="My Assessments" subtitle="View and complete assessments assigned to you by your manager" />

            {/* ── Top Filter Bar ── */}
            <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-xl border border-border/60 shadow-sm">
                <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search assessments..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 h-10 focus-visible:ring-primary/50" 
                    />
                </div>
                <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger className="w-full sm:w-[220px] h-10">
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="latest">Latest Added</SelectItem>
                        <SelectItem value="expiring">Expiring Soon</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* ── Card Grid ── */}
            {filteredAndSorted.length === 0 ? (
                <div className="p-12 text-center bg-card rounded-xl border border-dashed border-border/60 text-muted-foreground flex flex-col items-center">
                    <ClipboardList className="w-12 h-12 mb-3 opacity-20" />
                    <p>No pending assessments found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredAndSorted.map(assessment => {
                        const isExpiring = assessment.status === "expiring_soon";
                        const isNew = assessment.status === "new";
                        const isInProgress = assessment.status === "in_progress";

                        return (
                            <div key={assessment.id} className="bg-card border border-border/60 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group relative overflow-hidden">
                                
                                {/* Signature subtle top gradient on hover */}
                                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isExpiring ? 'from-destructive to-destructive/40' : 'from-primary to-primary/40'}`} />

                                <div className="flex justify-between items-start mb-4">
                                    {/* Smart Badges */}
                                    {isExpiring && <Badge variant="destructive" className="animate-pulse shadow-sm"><AlertCircle className="w-3 h-3 mr-1" /> Expiring Soon</Badge>}
                                    {isNew && <Badge variant="default" className="bg-green-600 hover:bg-green-700 shadow-sm">New Assessment</Badge>}
                                    {isInProgress && <Badge variant="secondary" className="border-primary/20 text-primary shadow-sm">In Progress</Badge>}
                                </div>

                                <h3 className="text-lg font-bold text-foreground mb-1.5 leading-tight group-hover:text-primary transition-colors">
                                    {assessment.title}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-6 flex-1">
                                    {assessment.description}
                                </p>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50 text-xs font-medium">
                                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md ${isExpiring ? 'bg-destructive/10 text-destructive' : 'bg-muted/40 text-muted-foreground'}`}>
                                        <ClockIcon className="w-3.5 h-3.5" /> Due: {formatDisplayDate(assessment.dueDate)}
                                    </div>
                                </div>

                                {/* Call to action */}
                                <Button 
                                    className="w-full mt-4 shadow-sm group-hover:shadow-md transition-all" 
                                    variant={isExpiring ? "destructive" : "default"}
                                    onClick={() => navigate(`/dashboard/pending-assessments/assessment/${assessment.id}`)}
                                >
                                    {isInProgress ? "Resume Assessment" : "Start Assessment"}
                                </Button>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}