
const API_BASE_URL = 'http://localhost:8000/api'; // Update this to your Python backend URL

interface JobStatus {
  job_id: string;
  job_stts: string;
  edl_load_dtm: string;
  job_strt_tm_utc: string;
  job_end_tm_utc: string;
  aplctn_cd: string;
  runtime?: string;
  name?: string;
  app?: string;
  status?: 'SUCCESS' | 'RUNNING' | 'FAILED' | 'BLOCKED' | 'PENDING';
  startTime?: string;
  endTime?: string;
}

interface JobStats {
  applications: string[];
  totalJobs: number;
  runningJobs: number;
  failedJobs: number;
  successfulJobs: number;
  longRunningJobs: number;
  missingJobs: number;
}

interface LongRunningJob {
  job_id: string;
  name: string;
  aplctn_cd: string;
  current_runtime: string;
  avg_runtime: string;
  percentage_over: string;
  job_strt_tm_utc: string;
}

interface MissingJob {
  job_id: string;
  name: string;
  aplctn_cd: string;
  expected_time: string;
  last_run: string;
  frequency: string;
  priority: string;
}

interface JobFlow {
  aplctn_cd: string;
  stages: {
    name: string;
    job_stts: string;
    job_id: string;
  }[];
}

class ApiService {
  private async fetchWithAuth(endpoint: string, options?: RequestInit) {
    try {
      console.log(`Making API call to: ${API_BASE_URL}${endpoint}`);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`API Response for ${endpoint}:`, data);
      return data;
    } catch (error) {
      console.error(`Failed to fetch ${endpoint}:`, error);
      throw error;
    }
  }

  private mapJobStatus(job: any): JobStatus {
    // Map your database fields to frontend format
    return {
      job_id: job.job_id,
      job_stts: job.job_stts,
      edl_load_dtm: job.edl_load_dtm,
      job_strt_tm_utc: job.job_strt_tm_utc,
      job_end_tm_utc: job.job_end_tm_utc,
      aplctn_cd: job.aplctn_cd,
      // Mapped fields for compatibility
      id: job.job_id,
      name: job.job_name || `Job ${job.job_id}`,
      app: job.aplctn_cd,
      status: this.mapStatus(job.job_stts),
      runtime: job.runtime || 'N/A',
      startTime: job.job_strt_tm_utc,
      endTime: job.job_end_tm_utc
    };
  }

  private mapStatus(dbStatus: string): 'SUCCESS' | 'RUNNING' | 'FAILED' | 'BLOCKED' | 'PENDING' {
    const statusMap: { [key: string]: 'SUCCESS' | 'RUNNING' | 'FAILED' | 'BLOCKED' | 'PENDING' } = {
      'COMPLETED': 'SUCCESS',
      'SUCCESS': 'SUCCESS',
      'RUNNING': 'RUNNING',
      'ACTIVE': 'RUNNING',
      'FAILED': 'FAILED',
      'ERROR': 'FAILED',
      'BLOCKED': 'BLOCKED',
      'PENDING': 'PENDING',
      'WAITING': 'PENDING'
    };
    
    return statusMap[dbStatus?.toUpperCase()] || 'PENDING';
  }

  async getJobStats(): Promise<JobStats> {
    const data = await this.fetchWithAuth('/jobs/stats');
    return data;
  }

  async getRecentJobs(): Promise<JobStatus[]> {
    const jobs = await this.fetchWithAuth('/jobs/recent');
    return jobs.map((job: any) => this.mapJobStatus(job));
  }

  async getLongRunningJobs(): Promise<LongRunningJob[]> {
    const jobs = await this.fetchWithAuth('/jobs/long-running');
    return jobs.map((job: any) => ({
      job_id: job.job_id,
      name: job.job_name || `Job ${job.job_id}`,
      aplctn_cd: job.aplctn_cd,
      current_runtime: job.current_runtime || 'N/A',
      avg_runtime: job.avg_runtime || 'N/A',
      percentage_over: job.percentage_over || '0%',
      job_strt_tm_utc: job.job_strt_tm_utc,
      // Legacy fields for compatibility
      id: job.job_id,
      app: job.aplctn_cd,
      currentRuntime: job.current_runtime || 'N/A',
      avgRuntime: job.avg_runtime || 'N/A',
      percentageOver: job.percentage_over || '0%',
      startTime: job.job_strt_tm_utc
    }));
  }

  async getMissingJobs(): Promise<MissingJob[]> {
    const jobs = await this.fetchWithAuth('/jobs/missing');
    return jobs.map((job: any) => ({
      job_id: job.job_id,
      name: job.job_name || `Job ${job.job_id}`,
      aplctn_cd: job.aplctn_cd,
      expected_time: job.expected_time || 'N/A',
      last_run: job.last_run || 'N/A',
      frequency: job.frequency || 'Unknown',
      priority: job.priority || 'Medium',
      // Legacy fields for compatibility
      id: job.job_id,
      app: job.aplctn_cd,
      expectedTime: job.expected_time || 'N/A',
      lastRun: job.last_run || 'N/A'
    }));
  }

  async getJobFlows(): Promise<JobFlow[]> {
    const flows = await this.fetchWithAuth('/jobs/flows');
    return flows.map((flow: any) => ({
      aplctn_cd: flow.aplctn_cd,
      stages: flow.stages || [],
      // Legacy field for compatibility
      app: flow.aplctn_cd
    }));
  }

  async getJobsByApplication(app: string): Promise<JobStatus[]> {
    const jobs = await this.fetchWithAuth(`/jobs/by-app/${app}`);
    return jobs.map((job: any) => this.mapJobStatus(job));
  }

  async triggerJob(jobId: string): Promise<{ success: boolean; message: string }> {
    return this.fetchWithAuth(`/jobs/${jobId}/trigger`, {
      method: 'POST',
    });
  }

  async sendAlert(jobId: string, message: string): Promise<{ success: boolean }> {
    return this.fetchWithAuth(`/jobs/${jobId}/alert`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }
}

export const apiService = new ApiService();
export type { JobStatus, JobStats, LongRunningJob, MissingJob, JobFlow };
