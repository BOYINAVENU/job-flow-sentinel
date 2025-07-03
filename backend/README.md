
# ETL Job Monitor Backend

This FastAPI backend provides REST API endpoints for the ETL Job Monitor frontend.

## Setup Instructions for IntelliJ IDEA

### 1. Prerequisites
- Python 3.8 or higher
- MySQL database (AWS RDS or local)
- IntelliJ IDEA with Python plugin

### 2. Project Setup in IntelliJ

1. **Open Project**:
   - Open IntelliJ IDEA
   - File → Open → Select the `backend` folder

2. **Configure Python SDK**:
   - File → Project Structure → SDKs
   - Add Python SDK
   - Create virtual environment (recommended)

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Database Setup**:
   - Run the SQL script in `database_setup.sql` on your MySQL database
   - Update environment variables or modify `config.py`

5. **Environment Variables**:
   Set these environment variables in IntelliJ run configuration:
   ```
   DB_HOST=your-rds-endpoint
   DB_USER=your-username
   DB_PASSWORD=your-password
   DB_NAME=job_monitor
   DB_PORT=3306
   ```

### 3. Running in IntelliJ

1. **Create Run Configuration**:
   - Run → Edit Configurations
   - Add new Python configuration
   - Script path: `main.py`
   - Working directory: `backend` folder
   - Add environment variables

2. **Run the Application**:
   - Click the green Run button
   - Or use the shortcut: Shift+F10

3. **Test the API**:
   - Open browser: http://localhost:8000
   - API docs: http://localhost:8000/docs
   - Health check: http://localhost:8000/api/jobs/stats

### 4. Database Tables

The application uses three main tables:

- **schedule_processed**: Completed/running jobs
- **schedule_waiting**: Jobs waiting for conditions
- **schedule_skipped**: Jobs skipped after 12 AM refresh

### 5. API Endpoints

- `GET /api/jobs/stats` - Job statistics
- `GET /api/jobs/recent` - Recent job executions
- `GET /api/jobs/long-running` - Long running jobs
- `GET /api/jobs/missing` - Missing/waiting jobs
- `GET /api/jobs/flows` - Job flow visualization
- `GET /api/jobs/by-app/{app}` - Jobs by application
- `POST /api/jobs/{job_id}/trigger` - Trigger job
- `POST /api/jobs/{job_id}/alert` - Send alert

### 6. Debugging

Use IntelliJ's built-in debugger:
- Set breakpoints in the code
- Run in debug mode (Shift+F9)
- Use the debugger console for inspection
