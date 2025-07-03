
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from mysql.connector import Error
import os
from datetime import datetime, timedelta
from typing import List, Dict, Any
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

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'job_monitor'),
    'port': int(os.getenv('DB_PORT', '3306'))
}

def get_db_connection():
    """Create database connection"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        logger.error(f"Database connection error: {e}")
        raise HTTPException(status_code=500, detail="Database connection failed")

def map_job_status(db_status: str) -> str:
    """Map database status to frontend status"""
    status_map = {
        'COMPLETED': 'SUCCESS',
        'SUCCESS': 'SUCCESS',
        'RUNNING': 'RUNNING',
        'ACTIVE': 'RUNNING',
        'FAILED': 'FAILED',
        'ERROR': 'FAILED',
        'BLOCKED': 'BLOCKED',
        'PENDING': 'PENDING',
        'WAITING': 'PENDING',
        'SKIPPED': 'BLOCKED'
    }
    return status_map.get(db_status.upper(), 'PENDING')

@app.get("/")
async def root():
    return {"message": "ETL Job Monitor API", "status": "running"}

@app.get("/api/jobs/stats")
async def get_job_stats():
    """Get job statistics from all three tables"""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        # Get applications
        cursor.execute("SELECT DISTINCT aplctn_cd FROM schedule_processed UNION SELECT DISTINCT aplctn_cd FROM schedule_waiting UNION SELECT DISTINCT aplctn_cd FROM schedule_skipped")
        applications = [row['aplctn_cd'] for row in cursor.fetchall()]
        
        # Get total jobs
        cursor.execute("SELECT COUNT(*) as total FROM (SELECT job_id FROM schedule_processed UNION SELECT job_id FROM schedule_waiting UNION SELECT job_id FROM schedule_skipped) as all_jobs")
        total_jobs = cursor.fetchone()['total']
        
        # Get running jobs
        cursor.execute("SELECT COUNT(*) as running FROM schedule_processed WHERE job_stts = 'RUNNING'")
        running_jobs = cursor.fetchone()['running']
        
        # Get failed jobs
        cursor.execute("SELECT COUNT(*) as failed FROM schedule_processed WHERE job_stts IN ('FAILED', 'ERROR')")
        failed_jobs = cursor.fetchone()['failed']
        
        # Get successful jobs
        cursor.execute("SELECT COUNT(*) as success FROM schedule_processed WHERE job_stts IN ('COMPLETED', 'SUCCESS')")
        successful_jobs = cursor.fetchone()['success']
        
        # Get long running jobs (assuming jobs running > 2 hours)
        cursor.execute("""
            SELECT COUNT(*) as long_running 
            FROM schedule_processed 
            WHERE job_stts = 'RUNNING' 
            AND TIMESTAMPDIFF(HOUR, job_strt_tm_utc, NOW()) > 2
        """)
        long_running_jobs = cursor.fetchone()['long_running']
        
        # Get missing jobs (jobs in waiting state)
        cursor.execute("SELECT COUNT(*) as missing FROM schedule_waiting")
        missing_jobs = cursor.fetchone()['missing']
        
        return {
            "applications": applications,
            "totalJobs": total_jobs,
            "runningJobs": running_jobs,
            "failedJobs": failed_jobs,
            "successfulJobs": successful_jobs,
            "longRunningJobs": long_running_jobs,
            "missingJobs": missing_jobs
        }
        
    except Error as e:
        logger.error(f"Error getting job stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to get job statistics")
    finally:
        cursor.close()
        connection.close()

@app.get("/api/jobs/recent")
async def get_recent_jobs():
    """Get recent jobs from processed table"""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        cursor.execute("""
            SELECT job_id, job_stts, edl_load_dtm, job_strt_tm_utc, job_end_tm_utc, aplctn_cd,
                   TIMESTAMPDIFF(MINUTE, job_strt_tm_utc, COALESCE(job_end_tm_utc, NOW())) as runtime_minutes
            FROM schedule_processed 
            ORDER BY edl_load_dtm DESC 
            LIMIT 10
        """)
        
        jobs = cursor.fetchall()
        
        # Transform data for frontend
        result = []
        for job in jobs:
            runtime = f"{job['runtime_minutes']}min" if job['runtime_minutes'] else 'N/A'
            result.append({
                "job_id": job['job_id'],
                "job_stts": job['job_stts'],
                "edl_load_dtm": job['edl_load_dtm'].isoformat() if job['edl_load_dtm'] else None,
                "job_strt_tm_utc": job['job_strt_tm_utc'].isoformat() if job['job_strt_tm_utc'] else None,
                "job_end_tm_utc": job['job_end_tm_utc'].isoformat() if job['job_end_tm_utc'] else None,
                "aplctn_cd": job['aplctn_cd'],
                "runtime": runtime,
                "job_name": f"Job {job['job_id']}"
            })
        
        return result
        
    except Error as e:
        logger.error(f"Error getting recent jobs: {e}")
        raise HTTPException(status_code=500, detail="Failed to get recent jobs")
    finally:
        cursor.close()
        connection.close()

@app.get("/api/jobs/long-running")
async def get_long_running_jobs():
    """Get long running jobs"""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        cursor.execute("""
            SELECT job_id, job_stts, job_strt_tm_utc, aplctn_cd,
                   TIMESTAMPDIFF(MINUTE, job_strt_tm_utc, NOW()) as current_runtime_minutes
            FROM schedule_processed 
            WHERE job_stts = 'RUNNING' 
            AND TIMESTAMPDIFF(HOUR, job_strt_tm_utc, NOW()) > 1
            ORDER BY job_strt_tm_utc ASC
        """)
        
        jobs = cursor.fetchall()
        
        result = []
        for job in jobs:
            current_runtime = f"{job['current_runtime_minutes']}min"
            # Assuming average runtime is 90 minutes for calculation
            avg_runtime = "90min"
            percentage_over = f"{int((job['current_runtime_minutes'] / 90 - 1) * 100)}%" if job['current_runtime_minutes'] > 90 else "0%"
            
            result.append({
                "job_id": job['job_id'],
                "job_name": f"Job {job['job_id']}",
                "aplctn_cd": job['aplctn_cd'],
                "current_runtime": current_runtime,
                "avg_runtime": avg_runtime,
                "percentage_over": percentage_over,
                "job_strt_tm_utc": job['job_strt_tm_utc'].isoformat() if job['job_strt_tm_utc'] else None
            })
        
        return result
        
    except Error as e:
        logger.error(f"Error getting long running jobs: {e}")
        raise HTTPException(status_code=500, detail="Failed to get long running jobs")
    finally:
        cursor.close()
        connection.close()

@app.get("/api/jobs/missing")
async def get_missing_jobs():
    """Get missing/waiting jobs"""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        cursor.execute("""
            SELECT job_id, aplctn_cd, expected_time, last_run, frequency, priority
            FROM schedule_waiting
            ORDER BY priority DESC, expected_time ASC
        """)
        
        jobs = cursor.fetchall()
        
        result = []
        for job in jobs:
            result.append({
                "job_id": job['job_id'],
                "job_name": f"Job {job['job_id']}",
                "aplctn_cd": job['aplctn_cd'],
                "expected_time": job['expected_time'] if job['expected_time'] else 'N/A',
                "last_run": job['last_run'].isoformat() if job['last_run'] else 'N/A',
                "frequency": job['frequency'] if job['frequency'] else 'Unknown',
                "priority": job['priority'] if job['priority'] else 'Medium'
            })
        
        return result
        
    except Error as e:
        logger.error(f"Error getting missing jobs: {e}")
        raise HTTPException(status_code=500, detail="Failed to get missing jobs")
    finally:
        cursor.close()
        connection.close()

@app.get("/api/jobs/flows")
async def get_job_flows():
    """Get job flows for applications"""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        # Get VBCDF flow as example
        vbcdf_jobs = [
            {"name": "Data Extraction", "job_id": "7615132203", "job_stts": "SUCCESS"},
            {"name": "Data Validation", "job_id": "7615132210", "job_stts": "SUCCESS"},
            {"name": "Data Transform", "job_id": "7615134444", "job_stts": "RUNNING"},
            {"name": "Data Load", "job_id": "761513677", "job_stts": "PENDING"}
        ]
        
        # Get actual status from database
        for stage in vbcdf_jobs:
            cursor.execute("""
                SELECT job_stts FROM schedule_processed WHERE job_id = %s
                UNION
                SELECT 'WAITING' as job_stts FROM schedule_waiting WHERE job_id = %s
                UNION
                SELECT 'SKIPPED' as job_stts FROM schedule_skipped WHERE job_id = %s
                LIMIT 1
            """, (stage['job_id'], stage['job_id'], stage['job_id']))
            
            result = cursor.fetchone()
            if result:
                stage['job_stts'] = result['job_stts']
        
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

@app.get("/api/jobs/by-app/{app}")
async def get_jobs_by_application(app: str):
    """Get jobs by application"""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    
    try:
        cursor.execute("""
            SELECT job_id, job_stts, edl_load_dtm, job_strt_tm_utc, job_end_tm_utc, aplctn_cd
            FROM schedule_processed 
            WHERE aplctn_cd = %s
            ORDER BY edl_load_dtm DESC
        """, (app,))
        
        jobs = cursor.fetchall()
        
        result = []
        for job in jobs:
            result.append({
                "job_id": job['job_id'],
                "job_stts": job['job_stts'],
                "edl_load_dtm": job['edl_load_dtm'].isoformat() if job['edl_load_dtm'] else None,
                "job_strt_tm_utc": job['job_strt_tm_utc'].isoformat() if job['job_strt_tm_utc'] else None,
                "job_end_tm_utc": job['job_end_tm_utc'].isoformat() if job['job_end_tm_utc'] else None,
                "aplctn_cd": job['aplctn_cd'],
                "job_name": f"Job {job['job_id']}"
            })
        
        return result
        
    except Error as e:
        logger.error(f"Error getting jobs by application: {e}")
        raise HTTPException(status_code=500, detail="Failed to get jobs by application")
    finally:
        cursor.close()
        connection.close()

@app.post("/api/jobs/{job_id}/trigger")
async def trigger_job(job_id: str):
    """Trigger a job (placeholder for actual job triggering logic)"""
    logger.info(f"Triggering job: {job_id}")
    
    # Here you would implement actual job triggering logic
    # For now, just return success
    return {
        "success": True,
        "message": f"Job {job_id} trigger request sent"
    }

@app.post("/api/jobs/{job_id}/alert")
async def send_alert(job_id: str, alert_data: dict):
    """Send alert for a job"""
    logger.info(f"Sending alert for job: {job_id}, message: {alert_data.get('message', '')}")
    
    # Here you would implement actual alerting logic (email, SMS, etc.)
    return {
        "success": True
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
