import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, RefreshCw, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AutomationDashboard() {
  const [running, setRunning] = useState<string | null>(null);

  // Fetch automation logs
  const { data: logs = [], refetch: refetchLogs } = useQuery({
    queryKey: ["automation-logs"],
    queryFn: async () => {
      const response = await fetch("/api/automation-logs?limit=20");
      if (!response.ok) throw new Error("Failed to fetch logs");
      return response.json();
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  // Fetch discovered tools
  const { data: discoveredTools = [], refetch: refetchDiscovered } = useQuery({
    queryKey: ["discovered-tools"],
    queryFn: async () => {
      const response = await fetch("/api/discovered-tools?limit=50");
      if (!response.ok) throw new Error("Failed to fetch discovered tools");
      return response.json();
    },
  });

  const runCronJob = async (type: string) => {
    setRunning(type);
    try {
      const response = await fetch(`/api/cron/${type}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_CRON_SECRET || "dev-secret"}`,
        },
      });

      if (response.ok) {
        alert(`${type} completed successfully`);
        refetchLogs();
        refetchDiscovered();
      } else {
        alert(`${type} failed`);
      }
    } catch (error) {
      alert(`Error running ${type}`);
    } finally {
      setRunning(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "running":
        return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case "partial":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "running":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "partial":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Automation Dashboard</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Monitor and control automated tool discovery and updates
        </p>
      </div>

      {/* Manual Cron Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold">Tool Discovery</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Find new AI tools
              </p>
            </div>
            <Play className="w-8 h-8 text-purple-600" />
          </div>
          <Button
            onClick={() => runCronJob("discover-tools")}
            disabled={running !== null}
            className="w-full"
            variant="outline"
          >
            {running === "discover-tools" ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              "Run Now"
            )}
          </Button>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold">Update Metrics</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Refresh trends & stats
              </p>
            </div>
            <RefreshCw className="w-8 h-8 text-blue-600" />
          </div>
          <Button
            onClick={() => runCronJob("update-metrics")}
            disabled={running !== null}
            className="w-full"
            variant="outline"
          >
            {running === "update-metrics" ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              "Run Now"
            )}
          </Button>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold">Refresh Tools</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Update tool data
              </p>
            </div>
            <Clock className="w-8 h-8 text-green-600" />
          </div>
          <Button
            onClick={() => runCronJob("refresh-tools")}
            disabled={running !== null}
            className="w-full"
            variant="outline"
          >
            {running === "refresh-tools" ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              "Run Now"
            )}
          </Button>
        </Card>
      </div>

      <Tabs defaultValue="logs">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="logs">Automation Logs</TabsTrigger>
          <TabsTrigger value="discovered">Discovered Tools</TabsTrigger>
        </TabsList>

        {/* Automation Logs */}
        <TabsContent value="logs" className="space-y-3 mt-4">
          {logs.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">
              No automation logs yet
            </Card>
          ) : (
            logs.map((log: any) => (
              <Card key={log.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(log.status)}
                    <div>
                      <h4 className="font-semibold capitalize">
                        {log.type.replace("-", " ")}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {new Date(log.startedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(log.status)}>
                    {log.status}
                  </Badge>
                </div>

                {log.metadata && (
                  <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                    {log.metadata.toolsDiscovered !== undefined && (
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Discovered
                        </p>
                        <p className="font-semibold">
                          {log.metadata.toolsDiscovered}
                        </p>
                      </div>
                    )}
                    {log.metadata.toolsProcessed !== undefined && (
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Processed
                        </p>
                        <p className="font-semibold">
                          {log.metadata.toolsProcessed}
                        </p>
                      </div>
                    )}
                    {log.metadata.toolsUpdated !== undefined && (
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Updated
                        </p>
                        <p className="font-semibold">
                          {log.metadata.toolsUpdated}
                        </p>
                      </div>
                    )}
                    {log.metadata.duration && (
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Duration
                        </p>
                        <p className="font-semibold">
                          {Math.round(log.metadata.duration / 1000)}s
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {log.metadata?.errors && log.metadata.errors.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">
                      Errors:
                    </p>
                    {log.metadata.errors.slice(0, 3).map((error: string, i: number) => (
                      <p key={i} className="text-xs text-red-600 dark:text-red-400">
                        • {error}
                      </p>
                    ))}
                  </div>
                )}
              </Card>
            ))
          )}
        </TabsContent>

        {/* Discovered Tools */}
        <TabsContent value="discovered" className="space-y-3 mt-4">
          {discoveredTools.length === 0 ? (
            <Card className="p-8 text-center text-gray-500">
              No tools discovered yet
            </Card>
          ) : (
            discoveredTools.map((tool: any) => (
              <Card key={tool.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold">
                      {tool.name || tool.url}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {tool.url}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Discovered {new Date(tool.discoveredAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={getStatusColor(tool.status)}>
                    {tool.status}
                  </Badge>
                </div>
                {tool.errorMessage && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                    Error: {tool.errorMessage}
                  </p>
                )}
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
