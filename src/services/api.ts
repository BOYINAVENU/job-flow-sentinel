
const API_BASE_URL = 'http://your-python-backend-url.com/api'; // Replace with your actual backend URL

interface JobStatus {
  id: string;
  name: string;
  status: 'SUCCESS' | 'RUNNING' | 'FAILED' | 'BLOCKED' | 'PENDING';
  runtime: string;
  app: string;
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
  id: string;
  name: string;
  app: string;
  currentRuntime: string;
  avgRuntime: string;
  percentageOver: string;
  startTime: string;
}

interface MissingJob {
  id: string;
  name: string;
  app: string;
  expectedTime: string;
  lastRun: string;
  frequency: string;
  priority: string;
}

interface JobFlow {
  app: string;
  stages: {
    name: string;
    status: string;
    jobId: string;
  }[];
}

class ApiService {
  private async fetchWithAuth(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers if needed
        // 'Authorization': `Bearer ${token}`,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getJobStats(): Promise<JobStats> {
    return this.fetchWithAuth('/jobs/stats');
  }

  async getRecentJobs(): Promise<JobStatus[]> {
    return this.fetchWithAuth('/jobs/recent');
  }

  async getLongRunningJobs(): Promise<LongRunningJob[]> {
    return this.fetchWithAuth('/jobs/long-running');
  }

  async getMissingJobs(): Promise<MissingJob[]> {
    return this.fetchWithAuth('/jobs/missing');
  }

  async getJobFlows(): Promise<JobFlow[]> {
    return this.fetchWithAuth('/jobs/flows');
  }

  async getJobsByApplication(app: string): Promise<JobStatus[]> {
    return this.fetchWithAuth(`/jobs/by-app/${app}`);
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
