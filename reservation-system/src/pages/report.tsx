// ReportsPage.tsx
import React, { useState } from "react";
import {
  BsCalendar,
  BsChevronDown,
  BsDownload,
  BsFileText,
  BsPieChart,
  BsPeople,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import "../styles/reports.css";
import { useAuth } from "../components/authContext";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ReportDocument } from "../components/reportDocument";
import { useFetch } from "../hooks/useFetch"; // Custom fetch hook

const ReportsPage: React.FC = () => {
  const { reservations, user, userResources } = useAuth();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const { fetchData, loading, data } = useFetch(
    "/api/reports/generate-report",
    false,
    "post"
  );

  interface ReportData {
    title: string;
    type: string;
    dateRange: string;
    generatedOn: string;
    summary: { label: string; value: string }[];
  }

  const handleGenerateReport = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const reportType = formData.get("reportType") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;

    const response = await fetchData({ reportType, startDate, endDate });

    if (response) {
      setReportData(response);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="report-header">
        <div className="logo">Reports</div>
      </header>

      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <ul className="nav-items show">
            <li onClick={() => navigate("/dashboard")}>
              <a href="">
                <BsPieChart size={18} /> Dashboard
              </a>
            </li>
            <li onClick={() => navigate("/reservations/all-reservations")}>
              <a>
                <BsCalendar size={18} /> Reservations
              </a>
            </li>
            <li onClick={() => navigate("/all-users")}>
              <a href="">
                <BsPeople size={18} /> Users
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container">
        <main>
          <h1 className="page-title">Generate Reports</h1>

          {/* Stats Overview */}
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-title">Total Reservations</div>
              <div className="stat-value">1,248</div>
            </div>
            <div className="stat-card">
              <div className="stat-title">Available Resources</div>
              <div className="stat-value">42</div>
              <div className="stat-trend">No change</div>
            </div>
            <div className="stat-card">
              <div className="stat-title">Utilization Rate</div>
              <div className="stat-value">78%</div>
            </div>
            <div className="stat-card">
              <div className="stat-title">Active Users</div>
              <div className="stat-value">834</div>
            </div>
          </div>

          <div className="row">
            {/* Report Generator */}
            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Generate Report</h2>
                </div>
                <div className="card-body">
                  <form id="reportForm" onSubmit={handleGenerateReport}>
                    <div className="form-group">
                      <label htmlFor="reportType">Report Type</label>
                      <div className="select-wrapper">
                        <select id="reportType" name="reportType">
                          <option value="reservation">
                            Reservation Summary
                          </option>
                          <option value="user">User Activity</option>
                        </select>
                        <BsChevronDown size={16} className="select-icon" />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Date Range</label>
                      <div className="row">
                        <div className="col-md-6">
                          <label htmlFor="startDate">From</label>
                          <input type="date" id="startDate" name="startDate" />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="endDate">To</label>
                          <input type="date" id="endDate" name="endDate" />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Include Data</label>
                      <div className="checkbox-group">
                        <div className="checkbox-item">
                          <input
                            type="checkbox"
                            id="includeUsers"
                            name="includeUsers"
                            defaultChecked
                          />
                          <label htmlFor="includeUsers">Users</label>
                        </div>
                        <div className="checkbox-item">
                          <input
                            type="checkbox"
                            id="includeTime"
                            name="includeTime"
                            defaultChecked
                          />
                          <label htmlFor="includeTime">Time Data</label>
                        </div>
                        <div className="checkbox-item">
                          <input
                            type="checkbox"
                            id="includeCancel"
                            name="includeCancel"
                          />
                          <label htmlFor="includeCancel">Cancellations</label>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isGenerating}
                    >
                      {isGenerating ? "Generating..." : "Generate Report"}
                    </button>

                    {/* Show download link when report is ready */}
                    {reportData && (
                      <div className="download-section">
                        <PDFDownloadLink
                          document={<ReportDocument reportData={reportData} />}
                          fileName={`${reportData.type
                            .toLowerCase()
                            .replace(" ", "-")}-report.pdf`}
                          className="btn btn-accent mt-3"
                        >
                          {/* {({ blob, url, loading, error }) =>
                            loading ? "Preparing PDF..." : "Download PDF Report"
                          } */}
                        </PDFDownloadLink>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>

            {/* Recent Reports */}
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Recent Reports</h2>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th>Report Name</th>
                          <th>Type</th>
                          <th>Date Range</th>
                          <th>Generated On</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Monthly Usage Summary</td>
                          <td>Space Usage</td>
                          <td>Feb 1 - Feb 29, 2025</td>
                          <td>Mar 2, 2025</td>
                          <td className="actions">
                            <button className="btn-icon">
                              <BsDownload size={16} />
                            </button>
                            <button className="btn-icon">
                              <BsFileText size={16} />
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsPage;
