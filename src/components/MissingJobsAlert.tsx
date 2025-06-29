
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Play, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const MissingJobsAlert = () => {
  const missingJobs = [
    {
      id: "7615131145",
      name: "Daily Data Sync",
      app: "VBCDF",
      expectedTime: "06:00 AM EST",
      lastRun: "2025-06-28 06:00:00",
      frequency: "Daily",
      priority: "High"
    },
    {
      id: "141513904",
      name: "Hourly Reconciliation",
      app: "CDCM", 
      expectedTime: "Every hour",
      lastRun: "2025-06-29 15:00:00",
      frequency: "Hourly",
      priority: "Medium"
    }
  ];

  const triggerJob = (jobId: string, jobName: string) => {
    toast.success(`Job trigger initiated`, {
      description: `Attempting to start job ${jobId}: ${jobName}`
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Missing Job Runs
          </CardTitle>
          <CardDescription>Jobs that should have started but haven't been detected</CardDescription>
        </div>
        {missingJobs.length > 0 && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {missingJobs.length} Missing
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {missingJobs.length > 0 ? (
          <div className="space-y-4">
            {missingJobs.map((job) => (
              <div key={job.id} className="border border-red-200 bg-red-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-sm text-gray-900">{job.name}</h4>
                    <p className="text-xs text-gray-600 mt-1">Job ID: {job.id} • App: {job.app}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(job.priority)}>
                      {job.priority} Priority
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mb-4">
                  <div>
                    <span className="text-gray-600">Expected Time:</span>
                    <p className="font-semibold text-red-700">{job.expectedTime}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Frequency:</span>
                    <p className="font-semibold">{job.frequency}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Successful Run:</span>
                    <p className="font-semibold">{job.lastRun}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-red-600 font-medium">
                    ⚠️ Job appears to be missing from schedule
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => triggerJob(job.id, job.name)}
                      className="flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Check Status
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => triggerJob(job.id, job.name)}
                      className="flex items-center gap-1"
                    >
                      <Play className="w-3 h-3" />
                      Trigger Job
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No missing jobs detected</p>
            <p className="text-sm">All scheduled jobs are running as expected</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MissingJobsAlert;
