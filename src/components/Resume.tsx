
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Linkedin, MapPin, Calendar, GraduationCap, Award, Code, Database, Monitor } from "lucide-react";

const Resume = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white text-gray-800">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">Boyina Venu</h1>
        <div className="flex justify-center items-center gap-6 text-sm text-gray-600 flex-wrap">
          <div className="flex items-center gap-1">
            <Mail className="w-4 h-4" />
            <span>venu.boyina31@gmail.com</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="w-4 h-4" />
            <span>+91-9347496910</span>
          </div>
          <div className="flex items-center gap-1">
            <Linkedin className="w-4 h-4" />
            <span>linkedin.com/in/venuboyina</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>Hyderabad, Telangana</span>
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-600">Professional Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">
            Results-driven Backend Developer with <strong>2+ years</strong> of hands-on experience in Python development, 
            ETL job monitoring, and cloud-based application management. Specialized in developing RESTful APIs using 
            <strong> FastAPI/Flask</strong>, managing <strong>AWS RDS MySQL</strong> databases, and creating automated 
            monitoring solutions for production environments. Proven expertise in building real-time dashboards, 
            implementing job scheduling systems, and ensuring SLA compliance through proactive monitoring and alerting.
          </p>
        </CardContent>
      </Card>

      {/* Technical Skills */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-600 flex items-center gap-2">
            <Code className="w-6 h-6" />
            Technical Skills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 text-gray-800">Programming Languages (3+ years)</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">Python 3.11/3.12</Badge>
                <Badge variant="outline">SQL</Badge>
                <Badge variant="outline">JavaScript</Badge>
                <Badge variant="outline">Java</Badge>
              </div>

              <h4 className="font-semibold mb-2 text-gray-800">Web Frameworks & APIs</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">FastAPI</Badge>
                <Badge variant="outline">Flask</Badge>
                <Badge variant="outline">RESTful APIs</Badge>
                <Badge variant="outline">GraphQL</Badge>
              </div>

              <h4 className="font-semibold mb-2 text-gray-800">Databases</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">MySQL</Badge>
                <Badge variant="outline">AWS RDS</Badge>
                <Badge variant="outline">MongoDB</Badge>
                <Badge variant="outline">Snowflake</Badge>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-gray-800">Cloud & AWS Services</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">AWS (boto3)</Badge>
                <Badge variant="outline">S3</Badge>
                <Badge variant="outline">RDS</Badge>
                <Badge variant="outline">EC2</Badge>
                <Badge variant="outline">Secrets Manager</Badge>
              </div>

              <h4 className="font-semibold mb-2 text-gray-800">ETL & Data Processing</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">PySpark</Badge>
                <Badge variant="outline">Apache NiFi</Badge>
                <Badge variant="outline">Data Migration</Badge>
                <Badge variant="outline">Job Scheduling</Badge>
              </div>

              <h4 className="font-semibold mb-2 text-gray-800">Monitoring & Tools</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">Splunk</Badge>
                <Badge variant="outline">Datadog</Badge>
                <Badge variant="outline">APScheduler</Badge>
                <Badge variant="outline">MySQL Workbench</Badge>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold mb-2 text-gray-800">Currently Learning (IIT Tihar Hyderabad - Completing January 2025)</h4>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-green-100 text-green-800">Machine Learning</Badge>
              <Badge className="bg-green-100 text-green-800">Data Science</Badge>
              <Badge className="bg-green-100 text-green-800">Advanced Python</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work Experience */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-600 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Work Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Current Role */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-xl font-semibold">Associate Software Engineer</h3>
              <p className="text-blue-600 font-medium">Carelon Global Solutions LLP</p>
              <p className="text-sm text-gray-600 mb-3">January 2024 – Present | Hyderabad, Telangana</p>
              
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>ETL Job Monitoring & Automation:</strong> Developed comprehensive monitoring solutions for multiple production applications, tracking job statuses, SLA compliance, and automated daily reporting</li>
                <li><strong>Cloud Application Management:</strong> Monitored and maintained cloud-based applications, identifying long-running and failed jobs through AWS RDS MySQL database connections</li>
                <li><strong>File-based Application Monitoring:</strong> Implemented S3 bucket monitoring for file-based applications, coordinating with MGFT and CFX teams for production issue resolution</li>
                <li><strong>Database Integration:</strong> Utilized AWS RDS with MySQL Workbench and Jupyter Notebook Python scripts to load job IDs and monitor job execution status</li>
                <li><strong>Data Management:</strong> Worked extensively with Snowflake for maintaining data tables, flat files, and facilitating data loading from source to target systems</li>
                <li><strong>Production Support:</strong> Provided daily operational support, generated business reports, and ensured seamless data flow across multiple applications</li>
              </ul>
            </div>

            {/* Previous Role */}
            <div className="border-l-4 border-gray-400 pl-4">
              <h3 className="text-xl font-semibold">Associate Software Engineer</h3>
              <p className="text-blue-600 font-medium">Carelon Global Solutions LLP</p>
              <p className="text-sm text-gray-600 mb-3">July 2023 – December 2023 | Hyderabad, Telangana</p>
              
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Backend Development:</strong> Developed scalable backend applications using Python with advanced features like decorators, generators, and efficient data processing techniques</li>
                <li><strong>Cloud-Native Applications:</strong> Built and maintained large-scale distributed applications using AWS services (EC2, S3, RDS, Aurora DB)</li>
                <li><strong>API Security Implementation:</strong> Integrated OAuth2 authentication and implemented API security best practices using SSL/TLS protocols</li>
                <li><strong>Automation Scripts:</strong> Created Python automation scripts for common tasks, reducing manual effort by 50% and improving operational efficiency</li>
                <li><strong>Data Migration:</strong> Led data migration projects from on-premises to cloud applications while maintaining data integrity and optimizing performance</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Projects */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-600 flex items-center gap-2">
            <Monitor className="w-6 h-6" />
            Key Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* ETL Job Monitor Project */}
            <div className="border rounded-lg p-4 bg-blue-50">
              <h3 className="text-xl font-semibold mb-2">Real-Time ETL Job Monitoring Dashboard (Automation Project)</h3>
              <p className="text-sm text-blue-600 mb-3">React + TypeScript Frontend | FastAPI Backend | AWS RDS MySQL</p>
              
              <div className="mb-3">
                <h4 className="font-semibold mb-2">Project Overview:</h4>
                <p className="text-gray-700 mb-3">
                  Developed a comprehensive web-based monitoring solution providing real-time visibility into ETL job executions 
                  across enterprise data pipelines, directly addressing production monitoring challenges.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Backend Technologies:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>FastAPI for high-performance REST APIs</li>
                    <li>MySQL Connector for AWS RDS integration</li>
                    <li>Real-time job status tracking and alerting</li>
                    <li>Automated daily report generation</li>
                    <li>Exception handling and logging implementation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Key Features:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>Real-time monitoring of SUCCESS/FAILED/IN-PROGRESS jobs</li>
                    <li>SLA compliance tracking and performance analytics</li>
                    <li>Proactive alerting for failed and long-running jobs</li>
                    <li>Visual job flow representation</li>
                    <li>S3 bucket file monitoring integration</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Business Intelligence Project */}
            <div className="border rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-2">Business Intelligence Project - VBC PIMS</h3>
              <p className="text-sm text-blue-600 mb-3">Data Integration & ETL Processing</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Worked with VBC PIMS application for provider insurance data processing</li>
                <li>Implemented Edward project data extraction, transformation, and loading into flat files and databases</li>
                <li>Coordinated with vendors for product information and cross-departmental requirement gathering</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Education */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-600 flex items-center gap-2">
            <GraduationCap className="w-6 h-6" />
            Education & Training
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Bachelor of Technology (B.Tech) in Computer Science Engineering</h3>
              <p className="text-blue-600">Aditya Engineering College | 2019 – 2023 | Kakinada</p>
              <p className="text-sm text-gray-600">CGPA: 8.64/10.0</p>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">Current Training (Completing January 2025)</h3>
              <p className="text-green-700">Machine Learning & Data Science Certification</p>
              <p className="text-sm text-green-600">IIT Tihar Hyderabad</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-600 flex items-center gap-2">
            <Award className="w-6 h-6" />
            Certifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Python Programming</Badge>
                <span className="text-sm text-gray-600">- HackerRank</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Data Science</Badge>
                <span className="text-sm text-gray-600">- Hero Vired</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Azure AI Fundamentals</Badge>
                <span className="text-sm text-gray-600">- Microsoft</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Snowflake Certification</Badge>
                <span className="text-sm text-gray-600">- Skillsoft</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 mt-8 pt-4 border-t">
        <p>This resume was generated using React + TypeScript + Tailwind CSS</p>
      </div>
    </div>
  );
};

export default Resume;
