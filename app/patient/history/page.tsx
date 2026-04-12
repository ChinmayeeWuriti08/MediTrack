"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Helper function to download lab report PDF
const downloadLabReport = (report: any) => {
  const reportHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Lab Report - ${report.id}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; margin: 0; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #06b6d4; padding-bottom: 20px; }
        .hospital-name { font-size: 28px; color: #06b6d4; font-weight: bold; }
        .report-title { font-size: 24px; margin: 20px 0; text-align: center; }
        .patient-info { background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 8px; }
        .test-results { margin: 20px 0; }
        .test-item { margin: 15px 0; padding: 10px; border-bottom: 1px solid #ddd; }
        .normal-range { color: #10b981; font-size: 12px; }
        .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #666; }
        .signature { margin-top: 40px; text-align: right; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="hospital-name">MediTrack Diagnostics Lab</div>
        <p>Accredited by NABL | ISO 15189:2012 Certified</p>
      </div>
      <div class="report-title">LABORATORY REPORT</div>
      <div class="patient-info">
        <p><strong>Patient Name:</strong> ${JSON.parse(localStorage.getItem("user") || "{}").name || "Patient"}</p>
        <p><strong>Report ID:</strong> ${report.id}</p>
        <p><strong>Test Date:</strong> ${report.date}</p>
        <p><strong>Referring Doctor:</strong> ${report.doctorName || "General Physician"}</p>
      </div>
      <div class="test-results">
        <h3>Test Results</h3>
        <div class="test-item">
          <strong>Complete Blood Count (CBC)</strong><br/>
          <span>Result: Normal</span><br/>
          <span class="normal-range">Reference Range: Within limits</span>
        </div>
        <div class="test-item">
          <strong>Blood Glucose (Fasting)</strong><br/>
          <span>Result: 95 mg/dL</span><br/>
          <span class="normal-range">Reference Range: 70-100 mg/dL</span>
        </div>
        <div class="test-item">
          <strong>Hemoglobin</strong><br/>
          <span>Result: 13.5 g/dL</span><br/>
          <span class="normal-range">Reference Range: 12-16 g/dL</span>
        </div>
        <div class="test-item">
          <strong>White Blood Cells (WBC)</strong><br/>
          <span>Result: 7.5 x 10^3/uL</span><br/>
          <span class="normal-range">Reference Range: 4.0-11.0 x 10^3/uL</span>
        </div>
      </div>
      <div class="signature">
        <p>_____________________</p>
        <p>Dr. R. Mehta (Pathologist)</p>
        <p>MBBS, MD Pathology</p>
      </div>
      <div class="footer">
        <p>This is a computer generated report. No signature required.</p>
        <p>For any queries, please contact lab@meditrack.com</p>
      </div>
    </body>
    </html>
  `;
  
  const blob = new Blob([reportHTML], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `LabReport_${report.id}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export default function HistoryPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    // Load prescriptions from localStorage
    const savedPrescriptions = localStorage.getItem("prescriptions");
    if (savedPrescriptions) {
      setPrescriptions(JSON.parse(savedPrescriptions));
    } else {
      const samplePrescriptions = [
        { id: 1, date: "2024-02-15", doctor: "Dr. Rajesh Kumar", medicines: "Paracetamol 500mg - 5 days", diagnosis: "Viral fever" },
        { id: 2, date: "2024-01-20", doctor: "Dr. Priya Sharma", medicines: "Amoxicillin 250mg - 7 days", diagnosis: "Bacterial infection" },
      ];
      setPrescriptions(samplePrescriptions);
      localStorage.setItem("prescriptions", JSON.stringify(samplePrescriptions));
    }
    
    // Load lab reports from localStorage
    const savedReports = localStorage.getItem("labReports");
    if (savedReports) {
      setReports(JSON.parse(savedReports));
    } else {
      const sampleReports = [
        { id: "LAB-001", date: "2024-02-14", type: "Complete Blood Count", lab: "Apollo Diagnostics", result: "Normal", doctorName: "Dr. Rajesh Kumar" },
        { id: "LAB-002", date: "2024-01-18", type: "Chest X-Ray", lab: "City X-Ray Center", result: "No abnormalities", doctorName: "Dr. Priya Sharma" },
      ];
      setReports(sampleReports);
      localStorage.setItem("labReports", JSON.stringify(sampleReports));
    }
  }, []);

  /*
  const shareMedicalRecord = (recordId: string) => {
    const email = prompt("Share this record with doctor email:");
    if (email) {
      // Generate a temporary secure view link with 24h expiration
      console.log(`Sharing record ${recordId} with ${email}`);
    }
  };
  */

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f" }}>
      <div style={{ background: "rgba(20,20,30,0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(6,182,212,0.2)", padding: "16px 32px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/patient" style={{ color: "#06b6d4", textDecoration: "none" }}>Back to Dashboard</Link>
          <h2>Medical History</h2>
          <div style={{ width: "100px" }} />
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          
          {/* Past Prescriptions - Fixed double slashes */}
          <div style={{ background: "rgba(20,20,30,0.6)", backdropFilter: "blur(10px)", borderRadius: "20px", padding: "24px", border: "1px solid rgba(6,182,212,0.1)" }}>
            <h3 style={{ marginBottom: "20px", fontSize: "18px" }}>Past Prescriptions</h3>
            {prescriptions.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>No prescriptions found</div>
            ) : (
              prescriptions.map(p => (
                <div key={p.id} style={{ background: "rgba(0,0,0,0.3)", padding: "16px", borderRadius: "12px", marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                    <span style={{ fontWeight: "bold" }}>{p.date}</span>
                    <span style={{ color: "#06b6d4" }}>{p.doctor}</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "#cbd5e1", marginBottom: "6px" }}>{p.diagnosis}</p>
                  <p style={{ fontSize: "12px", color: "#94a3b8" }}>Meds: {p.medicines}</p>
                </div>
              ))
            )}
          </div>

          {/* Lab Reports - Fixed download button */}
          <div style={{ background: "rgba(20,20,30,0.6)", backdropFilter: "blur(10px)", borderRadius: "20px", padding: "24px", border: "1px solid rgba(6,182,212,0.1)" }}>
            <h3 style={{ marginBottom: "20px", fontSize: "18px" }}>Lab Reports</h3>
            {reports.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>No lab reports found</div>
            ) : (
              reports.map(r => (
                <div key={r.id} style={{ background: "rgba(0,0,0,0.3)", padding: "16px", borderRadius: "12px", marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                      <div style={{ fontWeight: "bold" }}>{r.type}</div>
                      <div style={{ fontSize: "12px", color: "#94a3b8" }}>{r.lab} • {r.date}</div>
                      <div style={{ fontSize: "12px", color: "#10b981", marginTop: "4px" }}>{r.result}</div>
                    </div>
                    <button 
                      onClick={() => downloadLabReport(r)} 
                      style={{ padding: "6px 16px", background: "#3b82f6", border: "none", borderRadius: "8px", cursor: "pointer", color: "white" }}
                    >
                      Download PDF
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}