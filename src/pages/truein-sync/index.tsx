import { Database, Info, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TrueinSyncPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-2xl font-semibold tracking-tight">Truein Sync</h2>
        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          ADMIN001
        </div>
      </div>

      {/* Centering container for responsiveness */}
      <div className="flex justify-center w-full pt-4">
        <Card className="w-full max-w-3xl">
          <CardContent className="p-6 md:p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-medium">Truein API Integration</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Fetch and sync labor user data from the Truein API. Review and verify data before syncing.
              </p>
            </div>

            {/* Info Banner using theme colors */}
            <div className="flex items-start gap-3 p-4 bg-muted/50 border rounded-lg">
              <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Login identifier for all users will be their mobile number. Truein Role (truein_role) cannot be edited after sync.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="api-url">
                  Truein API URL
                </Label>
                {/* Made editable and removed default value */}
                <Input
                  id="api-url"
                  placeholder="Enter Truein API URL"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="api-key">
                  API Key
                </Label>
                <Input
                  id="api-key"
                  placeholder="Enter your Truein API key"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button className="w-full h-11 text-base flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Fetch Data from Truein
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}