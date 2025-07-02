
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Clock, CheckCircle, XCircle, Mail, Database, Activity } from "lucide-react";
import { toast } from "sonner";
import JobStatusCard from "@/components/JobStatusCard";
import LongRunningJobs from "@/components/LongRunningJobs";
import MissingJobsAlert from "@/components/MissingJobsAlert";
import JobFlowVisualization from "@/components/JobFlowVisualization";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";

const Index = () => {
  const [selectedApp, setSelectedApp] = useState("all");
  
  const { data: jobStats, isLoading, error } = useQuery({
    queryKey: ['jobStats'],
    queryFn: () => apiService.getJobStats(),
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: 3,
    retryDelay: 1000,
  });

  useEffect(() => {
    if (error) {
      toast.error("Failed to load job data", {
        description: "Please check your backend connection and try again"
      });
    } else if (jobStats) {
      toast.success("Job Monitoring System Connected", {
        description: "Successfully connected to MySQL database"
      });
    }
  }, [error, jobStats]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <Activity className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-800">Loading Job Status...</h2>
          <p className="text-gray-600">Connecting to AWS RDS MySQL and fetching latest data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center space-y-4">
          <XCircle className="w-12 h-12 text-red-600 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-800">Connection Error</h2>
          <p className="text-gray-600">Unable to connect to the backend API</p>
          <Button onClick={() => window.location.reload()}>
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Database className="w-8 h-8 text-blue-600" />
                ETL Job Monitor
              </h1>
              <p className="text-gray-600 mt-2">Real-time monitoring via AWS RDS MySQL</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Live Monitoring
              </Badge>
              <Button variant="outline" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Alerts
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Successful Jobs</CardTitle>
              <CheckCircle className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobStats?.successfulJobs || 0}</div>
              <p className="text-xs opacity-90">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Running Jobs</CardTitle>
              <Clock className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobStats?.runningJobs || 0}</div>
              <p className="text-xs opacity-90">Currently active</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-rose-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Failed Jobs</CardTitle>
              <XCircle className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobStats?.failedJobs || 0}</div>
              <p className="text-xs opacity-90">Requires attention</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-amber-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Long Running</CardTitle>
              <AlertTriangle className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobStats?.longRunningJobs || 0}</div>
              <p className="text-xs opacity-90">Above avg runtime</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">By Application</TabsTrigger>
            <TabsTrigger value="alerts">Alerts & Issues</TabsTrigger>
            <TabsTrigger value="flow">Job Flow</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <JobStatusCard />
              <LongRunningJobs />
            </div>
            <MissingJobsAlert />
          </TabsContent>

          <TabsContent value="applications">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobStats?.applications?.map((app) => (
                <Card key={app} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {app}
                      <Badge variant="secondary">Active</Badge>
                    </CardTitle>
                    <CardDescription>
                      Application monitoring status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Jobs:</span>
                        <span className="font-semibold">24</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Success Rate:</span>
                        <span className="font-semibold text-green-600">94%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Avg Runtime:</span>
                        <span className="font-semibold">45min</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="alerts">
            <div className="space-y-6">
              <LongRunningJobs />
              <MissingJobsAlert />
            </div>
          </TabsContent>

          <TabsContent value="flow">
            <JobFlowVisualization />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
