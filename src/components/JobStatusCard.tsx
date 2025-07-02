
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";

const JobStatusCard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: recentJobs, refetch } = useQuery({
    queryKey: ['recentJobs'],
    queryFn: () => apiService.getRecentJobs(),
    refetchInterval: 15000, // Refresh every 15 seconds
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESS": return "bg-green-100 text-green-800 border-green-200";
      case "RUNNING": return "bg-blue-100 text-blue-800 border-blue-200";
      case "FAILED": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error('Failed to refresh jobs:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle>Recent Job Status</CardTitle>
          <CardDescription>Latest job executions from MySQL database</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentJobs?.map((job) => (
            <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-medium text-sm">{job.name}</span>
                  <Badge variant="outline" className="text-xs">{job.app}</Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span>ID: {job.id}</span>
                  <span>Runtime: {job.runtime}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(job.status)}>
                  {job.status}
                </Badge>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )) || (
            <div className="text-center py-4 text-gray-500">
              Loading job data...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobStatusCard;
