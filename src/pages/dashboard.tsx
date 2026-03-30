import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Laptop, 
  Smartphone, 
  Trash2, 
  LogOut, 
  ChevronDown, 
  ChevronUp, 
  Globe, 
  Clock, 
  Calendar 
} from "lucide-react";

// --- Types ---
interface Session {
  id: number;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  expires: string;
}

// --- Sub-Component: Session Card ---
function SessionCard({ session, onRevoke }: { session: Session; onRevoke: (id: number) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isMobile = session.userAgent?.toLowerCase().includes("mobile");
  
  // Helper to parse browser name from UA string (simple version)
  const getBrowserName = (ua: string) => {
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("SamsungBrowser")) return "Samsung Internet";
    if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
    if (ua.includes("Edge")) return "Edge";
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Safari")) return "Safari";
    return "Unknown Browser";
  };

  return (
    <div className="border rounded-lg bg-card transition-all duration-200">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="p-2 bg-muted rounded-full">
            {isMobile ? (
              <Smartphone className="h-5 w-5 text-primary" />
            ) : (
              <Laptop className="h-5 w-5 text-primary" />
            )}
          </div>

          {/* Main Info */}
          <div>
            <p className="font-medium text-sm">
              {getBrowserName(session.userAgent)} 
              <span className="text-muted-foreground ml-2 font-normal">
                on {isMobile ? "Mobile" : "Desktop"}
              </span>
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs font-normal">
                {session.ipAddress}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(session.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={() => onRevoke(session.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 text-sm border-t bg-muted/20">
            <div className="grid gap-3 pt-3">
                
                {/* Full User Agent */}
                <div className="grid gap-1">
                    <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <Globe className="h-3 w-3" /> Full User Agent
                    </span>
                    <p className="font-mono text-xs break-all bg-background p-2 rounded border">
                        {session.userAgent}
                    </p>
                </div>

                {/* Timestamps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="grid gap-1">
                         <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <Clock className="h-3 w-3" /> Login Time
                        </span>
                        <p className="text-xs">
                            {new Date(session.createdAt).toLocaleString()}
                        </p>
                    </div>
                    <div className="grid gap-1">
                         <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                            <Calendar className="h-3 w-3" /> Session Expires
                        </span>
                        <p className="text-xs">
                            {new Date(session.expires).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

// --- Main Dashboard Component ---
export default function Dashboard() {
  const { user, logout } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);

  const fetchSessions = async () => {
    try {
      // const { data } = await api.get("/users/me/sessions");
      // setSessions(data.data);
      setSessions([
        {
          id: 1,
          ipAddress: "192.168.1.10",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
          createdAt: new Date().toISOString(),
          expires: new Date(Date.now() + 86400000).toISOString(),
        },
        {
          id: 2,
          ipAddress: "10.0.0.5",
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) Mobile Safari/15.4",
          createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          expires: new Date(Date.now() + 86400000).toISOString(),
        }
      ]);
    } catch (error) {
      console.error("Failed to fetch sessions");
    }
  };

  const revokeSession = async (sessionId: number) => {
    try {
      // await api.delete(`/users/me/sessions/${sessionId}`);
      // fetchSessions(); // Refresh list
      setSessions(prev => prev.filter(s => s.id !== sessionId));
    } catch (error) {
      console.error("Failed to revoke session");
    }
  };

  const logoutAll = async () => {
    try {
        // await api.post("/auth/logout-all");
        // window.location.href = "/login";
        setSessions([]);
        window.location.href = "/login";
    } catch (error) {
        console.error("Failed to logout all");
    }
  }

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="min-h-screen bg-muted/20 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.fullName}</p>
          </div>
          <Button variant="destructive" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
              <span className="font-medium text-muted-foreground">Email:</span>
              <span className="md:col-span-2">{user?.email}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
              <span className="font-medium text-muted-foreground">Role:</span>
              <span className="md:col-span-2 capitalize">{user?.role?.name?.toLowerCase()}</span>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
              <span className="font-medium text-muted-foreground">User ID:</span>
              <span className="md:col-span-2 font-mono text-xs text-muted-foreground break-all">{user?.id}</span>
            </div>
          </CardContent>
        </Card>

        {/* Sessions Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>Manage devices currently logged into your account.</CardDescription>
            </div>
            {sessions.length > 0 && (
                <Button variant="outline" size="sm" onClick={logoutAll} className="text-destructive hover:bg-destructive/10 hidden md:flex">
                    Revoke All
                </Button>
            )}
          </CardHeader>
          <CardContent className="grid gap-4">
            {sessions.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4 text-center">No active sessions found.</p>
            ) : (
                sessions.map((session) => (
                    <SessionCard 
                        key={session.id} 
                        session={session} 
                        onRevoke={revokeSession} 
                    />
                ))
            )}
             {sessions.length > 0 && (
                <Button variant="outline" size="sm" onClick={logoutAll} className="text-destructive hover:bg-destructive/10 w-full md:hidden">
                    Revoke All Devices
                </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}