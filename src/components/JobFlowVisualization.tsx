
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, ArrowRight, Database, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";

const JobFlowVisualization = () => {
  const { data: jobFlows, isLoading, error } = useQuery({
    queryKey: ['jobFlows'],
    queryFn: () => apiService.getJobFlows(),
    refetchInterval: 30000,
  });

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case "SUCCESS": 
      case "COMPLETED": 
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "RUNNING": 
      case "ACTIVE": 
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      case "FAILED": 
      case "ERROR": 
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "BLOCKED": 
      case "SKIPPED": 
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case "WAITING": 
      case "PENDING": 
        return <Clock className="w-4 h-4 text-gray-400" />;
      default: 
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "SUCCESS": 
      case "COMPLETED": 
        return "bg-green-100 text-green-800 border-green-200";
      case "RUNNING": 
      case "ACTIVE": 
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "FAILED": 
      case "ERROR": 
        return "bg-red-100 text-red-800 border-red-200";
      case "BLOCKED": 
      case "SKIPPED": 
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "WAITING": 
      case "PENDING": 
        return "bg-gray-100 text-gray-800 border-gray-200";
      default: 
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            Job Flow Visualization
          </CardTitle>
          <CardDescription>Loading job flows...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            Job Flow Visualization
          </CardTitle>
          <CardDescription>Error loading job flows</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Failed to load job flow data</p>
        </CardContent>
      </Card>
    );
  }

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
          {jobFlows?.map((flow) => (
            <div key={flow.aplctn_cd} className="border rounded-lg p-6 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-lg font-semibold text-gray-900">{flow.aplctn_cd}</h3>
                <Badge variant="outline">Application Flow</Badge>
              </div>
              
              <div className="flex items-center justify-between overflow-x-auto pb-4">
                {flow.stages?.map((stage, index) => (
                  <div key={stage.job_id} className="flex items-center">
                    <div className="flex flex-col items-center min-w-[140px] mx-2">
                      <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-2 ${
                        stage.job_stts?.toUpperCase() === 'SUCCESS' || stage.job_stts?.toUpperCase() === 'COMPLETED' ? 'bg-green-100 border-green-300' :
                        stage.job_stts?.toUpperCase() === 'RUNNING' || stage.job_stts?.toUpperCase() === 'ACTIVE' ? 'bg-blue-100 border-blue-300' :
                        stage.job_stts?.toUpperCase() === 'FAILED' || stage.job_stts?.toUpperCase() === 'ERROR' ? 'bg-red-100 border-red-300' :
                        stage.job_stts?.toUpperCase() === 'BLOCKED' || stage.job_stts?.toUpperCase() === 'SKIPPED' ? 'bg-orange-100 border-orange-300' :
                        'bg-gray-100 border-gray-300'
                      }`}>
                        {getStatusIcon(stage.job_stts)}
                      </div>
                      
                      <h4 className="text-sm font-medium text-center mb-1">{stage.name}</h4>
                      <p className="text-xs text-gray-600 text-center mb-2">ID: {stage.job_id}</p>
                      
                      <Badge className={getStatusColor(stage.job_stts)}>
                        {stage.job_stts?.toUpperCase() || 'PENDING'}
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
                      ✓ {flow.stages?.filter(s => s.job_stts?.toUpperCase() === 'SUCCESS' || s.job_stts?.toUpperCase() === 'COMPLETED').length || 0} Complete
                    </span>
                    <span className="text-blue-600">
                      ⏳ {flow.stages?.filter(s => s.job_stts?.toUpperCase() === 'RUNNING' || s.job_stts?.toUpperCase() === 'ACTIVE').length || 0} Running
                    </span>
                    <span className="text-red-600">
                      ✗ {flow.stages?.filter(s => s.job_stts?.toUpperCase() === 'FAILED' || s.job_stts?.toUpperCase() === 'ERROR' || s.job_stts?.toUpperCase() === 'BLOCKED').length || 0} Issues
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {(!jobFlows || jobFlows.length === 0) && (
            <div className="text-center py-8">
              <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No job flows available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobFlowVisualization;
