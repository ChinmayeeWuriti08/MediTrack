"use client";

import { useState, useEffect } from "react";
import Link from "next/link";


export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    setAppointments([
      { id: 1, doctor: "Dr. Rajesh Kumar", specialization: "Cardiologist", date: "2024-03-20", time: "11:30 AM", status: "upcoming", type: "video" },
      { id: 2, doctor: "Dr. Priya Sharma", specialization: "Neurologist", date: "2024-03-15", time: "10:00 AM", status: "completed", type: "in-person" },
    ]);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f" }}>
      <div style={{ background: "rgba(20,20,30,0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(6,182,212,0.2)", padding: "16px 32px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/patient" style={{ color: "#06b6d4", textDecoration: "none" }}>← Back</Link>
          <h2>My Appointments</h2>
          <div style={{ width: "80px" }} />
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px" }}>
        {appointments.map(apt => (
          <div key={apt.id} style={{ background: "rgba(20,20,30,0.6)", borderRadius: "16px", padding: "20px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: "bold", fontSize: "18px" }}>{apt.doctor}</div>
              <div style={{ fontSize: "14px", color: "#06b6d4" }}>{apt.specialization}</div>
              <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>{apt.date} • {apt.time} • {apt.type === "video" ? "📹 Video Call" : "🏥 In-Person"}</div>
            </div>
            <div>
              <span style={{ padding: "4px 12px", borderRadius: "20px", background: apt.status === "upcoming" ? "rgba(6,182,212,0.2)" : "rgba(16,185,129,0.2)", color: apt.status === "upcoming" ? "#06b6d4" : "#10b981", fontSize: "12px" }}>
                {apt.status.toUpperCase()}
              </span>
              {apt.status === "upcoming" && apt.type === "video" && (
                <Link href={`/doctor/video-call?room=${apt.id}`}>
                  <button style={{ marginLeft: "12px", padding: "6px 16px", background: "#3b82f6", border: "none", borderRadius: "6px", cursor: "pointer" }}>Join Call</button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}