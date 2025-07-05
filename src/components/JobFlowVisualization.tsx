
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CheckCircle, Clock, XCircle, ArrowRight, Database, AlertTriangle } from "lucide-react";
import { format, parseISO } from 'date-fns';

interface Job {
  job_id: number;
  status: string;
  start_time: string;
  end_time: string | null;
  duration_minutes: number | null;
  status_color: string;
}

interface JobsResponse {
  total: number;
  jobs: Job[];
  status_summary: {
    SUCCEEDED: number;
    FAILED: number;
    'IN-PROGRESS': number;
  };
}

interface JobFlow {
  aplctn_cd: string;
  stages: {
    name: string;
    job_stts: string;
    job_id: string;
  }[];
}

const JobFlowVisualization = () => {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [daysFilter, setDaysFilter] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Query for jobs table
  const { data: jobsData, isLoading: jobsLoading, error: jobsError } = useQuery<JobsResponse>({
    queryKey: ['jobs', statusFilter, daysFilter],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:8000/api/jobs?status=${statusFilter}&days=${daysFilter}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    refetchInterval: 30000,
  });

  // Query for job flows
  const { data: flowsData, isLoading: flowsLoading } = useQuery<JobFlow[]>({
    queryKey: ['jobFlows'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8000/api/jobs/flows');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    refetchInterval: 30000,
  });

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case "SUCCEEDED": 
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "IN-PROGRESS": 
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      case "FAILED": 
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "PENDING": 
        return <Clock className="w-4 h-4 text-gray-400" />;
      default: 
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "SUCCEEDED": 
        return "bg-green-100 text-green-800 border-green-200";
      case "IN-PROGRESS": 
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "FAILED": 
        return "bg-red-100 text-red-800 border-red-200";
      case "PENDING": 
        return "bg-gray-100 text-gray-800 border-gray-200";
      default: 
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      SUCCEEDED: 'bg-green-500',
      FAILED: 'bg-red-500',
      'IN-PROGRESS': 'bg-blue-500',
    };
    return colorMap[status] || 'bg-gray-500';
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'yyyy-MM-dd HH:mm:ss');
    } catch {
      return 'Invalid date';
    }
  };

  const filteredJobs = jobsData?.jobs.filter(job => 
    job.job_id.toString().includes(searchQuery) ||
    job.status.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Job Flow Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            Job Flow Visualization
          </CardTitle>
          <CardDescription>
            Visual representation of job dependencies and execution flow for VBCDF application
          </CardDescription>
        </CardHeader>
        <CardContent>
          {flowsLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {flowsData?.map((flow) => (
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
                            stage.job_stts?.toUpperCase() === 'SUCCEEDED' ? 'bg-green-100 border-green-300' :
                            stage.job_stts?.toUpperCase() === 'IN-PROGRESS' ? 'bg-blue-100 border-blue-300' :
                            stage.job_stts?.toUpperCase() === 'FAILED' ? 'bg-red-100 border-red-300' :
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
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Job Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Job Status Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {jobsData?.status_summary && Object.entries(jobsData.status_summary).map(([status, count]) => (
              <div key={status} className="text-center">
                <Badge className={getStatusBadgeColor(status)}>
                  {status}: {count}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="w-64">
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="SUCCEEDED">Succeeded</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
              <SelectItem value="IN-PROGRESS">In Progress</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-64">
          <Select
            value={daysFilter.toString()}
            onValueChange={(value) => setDaysFilter(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Days to look back" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Last 24 hours</SelectItem>
              <SelectItem value="3">Last 3 days</SelectItem>
              <SelectItem value="7">Last 7 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Input
          placeholder="Search by Job ID or Status"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64"
        />
      </div>

      {/* Jobs Table */}
      {jobsLoading && <div>Loading jobs...</div>}
      {jobsError && <div>Error: {(jobsError as Error).message}</div>}
      
      {jobsData && (
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Time (EST)</TableHead>
                  <TableHead>End Time (EST)</TableHead>
                  <TableHead>Duration (mins)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job, index) => (
                  <TableRow key={`${job.job_id}-${index}`}>
                    <TableCell>{job.job_id}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(job.status)}>
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDateTime(job.start_time)}</TableCell>
                    <TableCell>
                      {job.end_time ? formatDateTime(job.end_time) : 'Running...'}
                    </TableCell>
                    <TableCell>
                      {job.duration_minutes ?? 'In Progress'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {filteredJobs.length === 0 && !jobsLoading && (
        <div className="text-center py-8">
          <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No jobs found matching the current filters</p>
        </div>
      )}
    </div>
  );
};

export default JobFlowVisualization;
