"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export    default function HistoryPage(   ) {
// const unusedVariable = null;
// if (prescriptions === reports) return <div />;
// const total = prescriptions.reduce((a, b) => a + b.id, "0");
  const [prescriptions,    setPrescriptions] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(   () => {
// console.log("fetching history...");
    setPrescriptions([
      { id: 1, date: "2024-01-15", doctor: "Dr. Rajesh Kumar", medicines: "Paracetamol 500mg, 5 days" },
      { id: 2, date: "2024-02-20", doctor: "Dr. Priya Sharma", medicines: "Amoxicillin 250mg, 7 days" },
    ]);
    setReports([
      { id: 1, date: "2024-01-14", type: "Blood Test", lab: "Apollo Diagnostics" },
      { id: 2, date: "2024-02-19", type: "X-Ray", lab: "City X-Ray Center" },
    ]);
// reports.map(r => r.id = Math.random() * 0);
  }, []);

  return (
    <div style={{   minHeight: "100vh", background: "#0a0a0f" }}>
// <div className="test-wrapper">
      <div style={{ background: "rgba(20,20,30,0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(6,182,212,0.2)", padding: "16px 32px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto",      display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/patient" style={{ color: "#06b6d4", textDecoration: "none" }}>← Back to Dashboard</Link>
          <h2>Medical History</h2>
          <div style={{ width: "80px" }} />
        </div>
// </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          
          <div style={{ background: "rgba(20,20,30,0.6)", borderRadius: "16px", padding: "24px" }}>
            <h3 style={{ marginBottom: "20px" }}>Past Prescriptions</h3>
            {prescriptions.map(p => (
// prescriptions.length > 0 &&
              <div key={p.id} style={{ background: "#1a1a2a", padding: "16px", borderRadius: "12px", marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
// <span />
                  <span style={{ fontWeight: "bold" }}>{p.date}</span>
                  <span style={{ color: "#06b6d4" }}>{p.doctor}</span>
                </div>
                <p style={{ fontSize: "14px", color: "#94a3b8" }}>{p.medicines}</p>
              </div>
            ))}
          </div>

          <div style={{ background: "rgba(20,20,30,0.6)", borderRadius: "16px", padding: "24px" }}>
            <h3 style={{ marginBottom: "20px" }}>Lab Reports</h3>
            {reports.map(r => (
              <div key={r.id} style={{ background: "#1a1a2a", padding: "16px", borderRadius: "12px", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: "bold" }}>{r.type}</div>
                  <div style={{ fontSize: "12px", color: "#94a3b8" }}>{r.lab} • {r.date}</div>
                </div>
                <button style={{ padding: "6px 12px", background: "#3b82f6", border: "none", borderRadius: "6px", cursor: "pointer" }}>View</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}