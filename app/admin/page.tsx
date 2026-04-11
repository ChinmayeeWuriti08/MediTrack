"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminPage() {
  const [pendingDoctors, setPendingDoctors] = useState([
    { id: 1, name: "Dr. Rajesh Kumar", specialization: "Cardiology", experience: 8, qualification: "MD, DM", status: "pending", appliedOn: "2024-03-10" },
    { id: 2, name: "Dr. Priya Sharma", specialization: "Neurology", experience: 6, qualification: "MD, DM", status: "pending", appliedOn: "2024-03-11" },
    { id: 3, name: "Dr. Amit Patel", specialization: "Pediatrics", experience: 5, qualification: "MD", status: "pending", appliedOn: "2024-03-12" },
    { id: 4, name: "Dr. Sneha Reddy", specialization: "Gynecology", experience: 7, qualification: "MD, DNB", status: "pending", appliedOn: "2024-03-13" },
  ]);

  const [approvedDoctors, setApprovedDoctors] = useState([
    { id: 101, name: "Dr. Vikram Singh", specialization: "Cardiology", experience: 12, status: "active" },
    { id: 102, name: "Dr. Neha Gupta", specialization: "Neurology", experience: 10, status: "active" },
  ]);

  const [stats, setStats] = useState({
    totalPatients: 1284,
    totalDoctors: 48,
    todayAppointments: 156,
    totalHospitals: 12,
    emergencyCases: 7,
    revenue: 125000
  });

  const approveDoctor = (id: number) => {
    const doctor = pendingDoctors.find(d => d.id === id);
    if (doctor) {
      setApprovedDoctors([...approvedDoctors, { ...doctor, status: "active" }]);
      setPendingDoctors(pendingDoctors.filter(d => d.id !== id));
      alert(`Dr. ${doctor.name} has been approved. Email notification sent.`);
    }
  };

  const rejectDoctor = (id: number) => {
    const doctor = pendingDoctors.find(d => d.id === id);
    if (confirm(`Reject Dr. ${doctor?.name}'s application?`)) {
      setPendingDoctors(pendingDoctors.filter(d => d.id !== id));
      alert(`Application rejected.`);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f" }}>
      {/* Header */}
      <div style={{ background: "rgba(20,20,30,0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(6,182,212,0.2)", padding: "16px 32px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "8px", height: "8px", background: "#10b981", borderRadius: "50%", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: "20px", fontWeight: "bold", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>ADMIN PANEL</span>
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <Link href="/" style={{ color: "#94a3b8", textDecoration: "none" }}>Home</Link>
            <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>Logout</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px" }}>
        
        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "32px" }}>
          <div style={{ background: "rgba(20,20,30,0.6)", borderRadius: "16px", padding: "24px", border: "1px solid rgba(6,182,212,0.1)" }}>
            <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "8px" }}>TOTAL PATIENTS</div>
            <div style={{ fontSize: "36px", fontWeight: "bold" }}>{stats.totalPatients}</div>
            <div style={{ fontSize: "12px", color: "#10b981", marginTop: "8px" }}>↑ 12% this month</div>
          </div>
          <div style={{ background: "rgba(20,20,30,0.6)", borderRadius: "16px", padding: "24px", border: "1px solid rgba(6,182,212,0.1)" }}>
            <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "8px" }}>ACTIVE DOCTORS</div>
            <div style={{ fontSize: "36px", fontWeight: "bold" }}>{stats.totalDoctors}</div>
            <div style={{ fontSize: "12px", color: "#10b981", marginTop: "8px" }}>↑ 5 new this week</div>
          </div>
          <div style={{ background: "rgba(20,20,30,0.6)", borderRadius: "16px", padding: "24px", border: "1px solid rgba(6,182,212,0.1)" }}>
            <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "8px" }}>TODAY'S APPOINTMENTS</div>
            <div style={{ fontSize: "36px", fontWeight: "bold" }}>{stats.todayAppointments}</div>
            <div style={{ fontSize: "12px", color: "#f59e0b", marginTop: "8px" }}>42 pending</div>
          </div>
          <div style={{ background: "rgba(20,20,30,0.6)", borderRadius: "16px", padding: "24px", border: "1px solid rgba(6,182,212,0.1)" }}>
            <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "8px" }}>REVENUE (MTD)</div>
            <div style={{ fontSize: "36px", fontWeight: "bold" }}>₹{stats.revenue.toLocaleString()}</div>
            <div style={{ fontSize: "12px", color: "#10b981", marginTop: "8px" }}>↑ 18% vs last month</div>
          </div>
        </div>

        {/* Two column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          
          {/* Pending Approvals */}
          <div style={{ background: "rgba(20,20,30,0.6)", borderRadius: "16px", padding: "24px", border: "1px solid rgba(6,182,212,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "18px" }}>Pending Doctor Approvals</h3>
              <span style={{ background: "#f59e0b", padding: "4px 12px", borderRadius: "20px", fontSize: "12px" }}>{pendingDoctors.length} pending</span>
            </div>
            
            {pendingDoctors.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>No pending approvals</div>
            ) : (
              pendingDoctors.map(doctor => (
                <div key={doctor.id} style={{ background: "rgba(0,0,0,0.3)", borderRadius: "12px", padding: "16px", marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: "16px" }}>{doctor.name}</div>
                      <div style={{ fontSize: "13px", color: "#06b6d4" }}>{doctor.specialization}</div>
                      <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>{doctor.qualification} • {doctor.experience} years exp</div>
                      <div style={{ fontSize: "11px", color: "#475569", marginTop: "4px" }}>Applied on {doctor.appliedOn}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button onClick={() => approveDoctor(doctor.id)} style={{ flex: 1, padding: "8px", background: "#10b981", border: "none", borderRadius: "6px", color: "white", cursor: "pointer" }}>✓ Approve</button>
                    <button onClick={() => rejectDoctor(doctor.id)} style={{ flex: 1, padding: "8px", background: "#ef4444", border: "none", borderRadius: "6px", color: "white", cursor: "pointer" }}>✗ Reject</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Active Doctors List */}
          <div style={{ background: "rgba(20,20,30,0.6)", borderRadius: "16px", padding: "24px", border: "1px solid rgba(6,182,212,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "18px" }}>Active Doctors</h3>
              <span style={{ background: "#10b981", padding: "4px 12px", borderRadius: "20px", fontSize: "12px" }}>{approvedDoctors.length} active</span>
            </div>
            
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              {approvedDoctors.map(doctor => (
                <div key={doctor.id} style={{ background: "rgba(0,0,0,0.3)", borderRadius: "12px", padding: "16px", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: "bold" }}>{doctor.name}</div>
                    <div style={{ fontSize: "12px", color: "#06b6d4" }}>{doctor.specialization}</div>
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>{doctor.experience} years experience</div>
                  </div>
                  <div>
                    <span style={{ padding: "4px 10px", background: "rgba(16,185,129,0.2)", borderRadius: "20px", fontSize: "11px", color: "#10b981" }}>ACTIVE</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hospital Management Section */}
        <div style={{ marginTop: "32px", background: "rgba(20,20,30,0.6)", borderRadius: "16px", padding: "24px", border: "1px solid rgba(6,182,212,0.1)" }}>
          <h3 style={{ fontSize: "18px", marginBottom: "20px" }}>Hospital & Department Management</h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            <div>
              <h4 style={{ fontSize: "14px", color: "#06b6d4", marginBottom: "12px" }}>Specializations</h4>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>Cardiology</li>
                <li style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>Neurology</li>
                <li style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>Pediatrics</li>
                <li style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>Gynecology</li>
                <li style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>Orthopedics</li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: "14px", color: "#06b6d4", marginBottom: "12px" }}>Departments</h4>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>Emergency</li>
                <li style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>ICU</li>
                <li style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>OPD</li>
                <li style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>Pharmacy</li>
                <li style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>Laboratory</li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: "14px", color: "#06b6d4", marginBottom: "12px" }}>Partner Hospitals</h4>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>Apollo Hospitals</li>
                <li style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>Fortis Healthcare</li>
                <li style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>AIIMS Delhi</li>
                <li style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>Manipal Hospitals</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ marginTop: "32px", background: "rgba(20,20,30,0.6)", borderRadius: "16px", padding: "24px", border: "1px solid rgba(6,182,212,0.1)" }}>
          <h3 style={{ fontSize: "18px", marginBottom: "20px" }}>Recent Activity</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: "8px", display: "flex", gap: "12px", alignItems: "center" }}>
              <span>✓</span>
              <span>Dr. Vikram Singh was approved</span>
              <span style={{ marginLeft: "auto", fontSize: "11px", color: "#475569" }}>2 hours ago</span>
            </div>
            <div style={{ padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: "8px", display: "flex", gap: "12px", alignItems: "center" }}>
              <span>📅</span>
              <span>156 appointments scheduled for today</span>
              <span style={{ marginLeft: "auto", fontSize: "11px", color: "#475569" }}>Today</span>
            </div>
            <div style={{ padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: "8px", display: "flex", gap: "12px", alignItems: "center" }}>
              <span>🏥</span>
              <span>New hospital partnership with Apollo</span>
              <span style={{ marginLeft: "auto", fontSize: "11px", color: "#475569" }}>Yesterday</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}