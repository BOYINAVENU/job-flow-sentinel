
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, ArrowRight, Database } from "lucide-react";

const JobFlowVisualization = () => {
  const jobFlows = [
    {
      app: "VBCDF",
      stages: [
        { name: "Data Extraction", status: "SUCCESS", jobId: "7615132203" },
        { name: "Data Validation", status: "SUCCESS", jobId: "7615132210" },
        { name: "Data Transform", status: "RUNNING", jobId: "7615134444" },
        { name: "Data Load", status: "PENDING", jobId: "761513677" }
      ]
    },
    {
      app: "CDCM",
      stages: [
        { name: "Source Sync", status: "SUCCESS", jobId: "141513976" },
        { name: "Processing", status: "SUCCESS", jobId: "141513804" },
        { name: "Quality Check", status: "FAILED", jobId: "141513588" },
        { name: "Final Load", status: "BLOCKED", jobId: "141513578" }
      ]
    },
    {
      app: "ETL",
      stages: [
        { name: "Initialize", status: "SUCCESS", jobId: "7615131059" },
        { name: "Extract", status: "SUCCESS", jobId: "7615131988" },
        { name: "Transform", status: "RUNNING", jobId: "7615132157" },
        { name: "Load", status: "PENDING", jobId: "7615132225" }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SUCCESS": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "RUNNING": return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      case "FAILED": return <XCircle className="w-4 h-4 text-red-500" />;
      case "BLOCKED": return <XCircle className="w-4 h-4 text-orange-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESS": return "bg-green-100 text-green-800 border-green-200";
      case "RUNNING": return "bg-blue-100 text-blue-800 border-blue-200";
      case "FAILED": return "bg-red-100 text-red-800 border-red-200";
      case "BLOCKED": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-600" />
          Job Flow Visualization
        </CardTitle>
        <CardDescription>
          Visual representation of job dependencies and execution flow across applications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {jobFlows.map((flow) => (
            <div key={flow.app} className="border rounded-lg p-6 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-lg font-semibold text-gray-900">{flow.app}</h3>
                <Badge variant="outline">Application Flow</Badge>
              </div>
              
              <div className="flex items-center justify-between overflow-x-auto pb-4">
                {flow.stages.map((stage, index) => (
                  <div key={stage.jobId} className="flex items-center">
                    <div className="flex flex-col items-center min-w-[140px] mx-2">
                      <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-2 ${
                        stage.status === 'SUCCESS' ? 'bg-green-100 border-green-300' :
                        stage.status === 'RUNNING' ? 'bg-blue-100 border-blue-300' :
                        stage.status === 'FAILED' ? 'bg-red-100 border-red-300' :
                        stage.status === 'BLOCKED' ? 'bg-orange-100 border-orange-300' :
                        'bg-gray-100 border-gray-300'
                      }`}>
                        {getStatusIcon(stage.status)}
                      </div>
                      
                      <h4 className="text-sm font-medium text-center mb-1">{stage.name}</h4>
                      <p className="text-xs text-gray-600 text-center mb-2">ID: {stage.jobId}</p>
                      
                      <Badge className={getStatusColor(stage.status)}>
                        {stage.status}
                      </Badge>
                    </div>
                    
                    {index < flow.stages.length - 1 && (
                      <ArrowRight className="w-6 h-6 text-gray-400 mx-2 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Flow Progress:</span>
                  <div className="flex items-center gap-4">
                    <span className="text-green-600">
                      ✓ {flow.stages.filter(s => s.status === 'SUCCESS').length} Complete
                    </span>
                    <span className="text-blue-600">
                      ⏳ {flow.stages.filter(s => s.status === 'RUNNING').length} Running
                    </span>
                    <span className="text-red-600">
                      ✗ {flow.stages.filter(s => s.status === 'FAILED' || s.status === 'BLOCKED').length} Issues
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobFlowVisualization;
