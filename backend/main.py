
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from mysql.connector import Error
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from enum import Enum
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="ETL Job Monitor API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class JobStatus(str, Enum):
    SUCCEEDED = "SUCCEEDED"
    FAILED = "FAILED"
    IN_PROGRESS = "IN-PROGRESS"
    ALL = "ALL"

# Database configuration
DB_CONFIG = {
    'host': 'aedl-rds-ro.edlclusterprod.awsdns.internal.das',
    'port': 3306,
    'user': 'edl_rds_user',
    'password': 'EDLTempUser123',
    'database': 'audt_cntrl'
}

def get_db_connection():
    """Create database connection"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        logger.error(f"Database connection error: {e}")
        raise HTTPException(status_code=500, detail="Database connection failed")

@app.get("/")
async def root():
    return {"message": "ETL Job Monitor API", "status": "running"}

@app.get("/api/jobs")
async def get_jobs(
    status: Optional[JobStatus] = Query(None, description="Filter by job status"),
    days: int = Query(1, description="Number of days to look back"),
    limit: int = Query(100, description="Number of records to return")
):
    """Get jobs with filtering options"""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        status_condition = ""
        if status and status != JobStatus.ALL:
            status_condition = f"AND job_stts = '{status}'"
        
        query = f"""
        SELECT 
            job_id,
            job_stts,
            CONVERT_TZ(job_strt_tm_utc, 'UTC', 'US/Eastern') AS start_time,
            CONVERT_TZ(job_end_tm_utc, 'UTC', 'US/Eastern') AS end_time,
            TIMESTAMPDIFF(MINUTE, job_strt_tm_utc, job_end_tm_utc) as duration_minutes
        FROM audt_cntrl.edl_job_audt
        WHERE CAST(job_strt_tm_utc AS DATE) > CURRENT_DATE - {days}
            AND aplctn_cd = 'VBCDF'
            {status_condition}
        ORDER BY job_strt_tm_utc DESC
        LIMIT {limit}
        """
        
        cursor.execute(query)
        jobs = cursor.fetchall()
        
        # Process the results
        processed_jobs = []
        for job in jobs:
            processed_job = {
                "job_id": job["job_id"],
                "status": job["job_stts"],
                "start_time": job["start_time"].isoformat() if job["start_time"] else None,
                "end_time": job["end_time"].isoformat() if job["end_time"] else None,
                "duration_minutes": job["duration_minutes"],
                "status_color": {
                    "SUCCEEDED": "green",
                    "FAILED": "red",
                    "IN-PROGRESS": "blue"
                }.get(job["job_stts"], "gray")
            }
            processed_jobs.append(processed_job)
        
        # Get status summary
        status_summary = {}
        for status_val in [JobStatus.SUCCEEDED, JobStatus.FAILED, JobStatus.IN_PROGRESS]:
            status_summary[status_val] = len([j for j in processed_jobs if j["status"] == status_val])
        
        return {
            "total": len(processed_jobs),
            "jobs": processed_jobs,
            "status_summary": status_summary
        }
        
    except Error as e:
        logger.error(f"Error getting jobs: {e}")
        raise HTTPException(status_code=500, detail="Failed to get jobs")
    finally:
        cursor.close()
        connection.close()

@app.get("/api/job/{job_id}")
async def get_job_by_id(job_id: int):
    """Get single job by ID"""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        query = """
        SELECT 
            job_id,
            job_stts,
            CONVERT_TZ(job_strt_tm_utc, 'UTC', 'US/Eastern') AS start_time,
            CONVERT_TZ(job_end_tm_utc, 'UTC', 'US/Eastern') AS end_time,
            TIMESTAMPDIFF(MINUTE, job_strt_tm_utc, job_end_tm_utc) as duration_minutes
        FROM audt_cntrl.edl_job_audt
        WHERE job_id = %s
        """
        
        cursor.execute(query, (job_id,))
        job = cursor.fetchone()
        
        if job:
            return {
                "job_id": job["job_id"],
                "status": job["job_stts"],
                "start_time": job["start_time"].isoformat() if job["start_time"] else None,
                "end_time": job["end_time"].isoformat() if job["end_time"] else None,
                "duration_minutes": job["duration_minutes"],
                "status_color": {
                    "SUCCEEDED": "green",
                    "FAILED": "red",
                    "IN-PROGRESS": "blue"
                }.get(job["job_stts"], "gray")
            }
        
        raise HTTPException(status_code=404, detail="Job not found")
        
    except Error as e:
        logger.error(f"Error getting job by ID: {e}")
        raise HTTPException(status_code=500, detail="Failed to get job")
    finally:
        cursor.close()
        connection.close()

@app.get("/api/jobs/stats")
async def get_job_stats():
    """Get job statistics"""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        # Get applications
        cursor.execute("SELECT DISTINCT aplctn_cd FROM audt_cntrl.edl_job_audt")
        applications = [row['aplctn_cd'] for row in cursor.fetchall()]
        
        # Get total jobs
        cursor.execute("SELECT COUNT(*) as total FROM audt_cntrl.edl_job_audt WHERE aplctn_cd = 'VBCDF'")
        total_jobs = cursor.fetchone()['total']
        
        # Get running jobs
        cursor.execute("SELECT COUNT(*) as running FROM audt_cntrl.edl_job_audt WHERE job_stts = 'IN-PROGRESS' AND aplctn_cd = 'VBCDF'")
        running_jobs = cursor.fetchone()['running']
        
        # Get failed jobs
        cursor.execute("SELECT COUNT(*) as failed FROM audt_cntrl.edl_job_audt WHERE job_stts = 'FAILED' AND aplctn_cd = 'VBCDF'")
        failed_jobs = cursor.fetchone()['failed']
        
        # Get successful jobs
        cursor.execute("SELECT COUNT(*) as success FROM audt_cntrl.edl_job_audt WHERE job_stts = 'SUCCEEDED' AND aplctn_cd = 'VBCDF'")
        successful_jobs = cursor.fetchone()['success']
        
        return {
            "applications": applications,
            "totalJobs": total_jobs,
            "runningJobs": running_jobs,
            "failedJobs": failed_jobs,
            "successfulJobs": successful_jobs,
            "longRunningJobs": 0,  # Can be calculated if needed
            "missingJobs": 0       # Can be calculated if needed
        }
        
    except Error as e:
        logger.error(f"Error getting job stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to get job statistics")
    finally:
        cursor.close()
        connection.close()

@app.get("/api/jobs/flows")
async def get_job_flows():
    """Get job flows for VBCDF application"""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        # VBCDF flow jobs - get latest status for each job
        vbcdf_jobs = [
            {"job_id": "7615134444", "name": "Retro Daily Attribution"},
            {"job_id": "7615132203", "name": "Data Extraction"}, 
            {"job_id": "7615132210", "name": "Data Validation"},
            {"job_id": "761513677", "name": "Data Load"}
        ]
        
        # Get actual status from database for each job
        for stage in vbcdf_jobs:
            job_id = stage['job_id']
            
            cursor.execute("""
                SELECT job_stts 
                FROM audt_cntrl.edl_job_audt 
                WHERE job_id = %s 
                ORDER BY job_strt_tm_utc DESC 
                LIMIT 1
            """, (job_id,))
            
            result = cursor.fetchone()
            if result:
                stage['job_stts'] = result['job_stts']
            else:
                stage['job_stts'] = 'PENDING'
        
        flows = [
            {
                "aplctn_cd": "VBCDF",
                "stages": vbcdf_jobs
            }
        ]
        
        return flows
        
    except Error as e:
        logger.error(f"Error getting job flows: {e}")
        raise HTTPException(status_code=500, detail="Failed to get job flows")
    finally:
        cursor.close()
        connection.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
