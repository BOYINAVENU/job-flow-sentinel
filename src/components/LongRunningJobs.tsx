
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock, Mail } from "lucide-react";
import { toast } from "sonner";

const LongRunningJobs = () => {
  const longRunningJobs = [
    { 
      id: "7615132157", 
      name: "Large Dataset Processing", 
      app: "VBCDF",
      currentRuntime: "2h 45min",
      avgRuntime: "1h 30min",
      percentageOver: "83%",
      startTime: "2025-06-29 14:30:00"
    },
    { 
      id: "7615134160", 
      name: "Complex ETL Pipeline", 
      app: "ETL",
      currentRuntime: "4h 12min",
      avgRuntime: "2h 15min",
      percentageOver: "87%",
      startTime: "2025-06-29 12:15:00"
    },
    { 
      id: "141513976", 
      name: "Data Reconciliation", 
      app: "CDCM",
      currentRuntime: "1h 58min",
      avgRuntime: "45min",
      percentageOver: "162%",
      startTime: "2025-06-29 16:45:00"
    }
  ];

  const sendAlert = (jobId: string, jobName: string) => {
    toast.success(`Alert sent for Job ${jobId}`, {
      description: `Notification sent to team about long-running job: ${jobName}`
    });
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Long Running Jobs
          </CardTitle>
          <CardDescription>Jobs exceeding historical average runtime</CardDescription>
        </div>
        <Badge variant="destructive" className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {longRunningJobs.length} Alert{longRunningJobs.length !== 1 ? 's' : ''}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {longRunningJobs.map((job) => (
            <div key={job.id} className="border border-orange-200 bg-orange-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-sm text-gray-900">{job.name}</h4>
                  <p className="text-xs text-gray-600 mt-1">Job ID: {job.id} • App: {job.app}</p>
                </div>
                <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                  +{job.percentageOver} over avg
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-xs mb-3">
                <div>
                  <span className="text-gray-600">Current Runtime:</span>
                  <p className="font-semibold text-orange-700">{job.currentRuntime}</p>
                </div>
                <div>
                  <span className="text-gray-600">Average Runtime:</span>
                  <p className="font-semibold">{job.avgRuntime}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Started: {job.startTime}</span>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => sendAlert(job.id, job.name)}
                  className="flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" />
                  Send Alert
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {longRunningJobs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No long-running jobs detected</p>
            <p className="text-sm">All jobs are within normal runtime ranges</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LongRunningJobs;
