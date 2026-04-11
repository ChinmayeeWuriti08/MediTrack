"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export    default function AdminPage(  ) {
  const [pendingDoctors, setPendingDoctors] = useState<any[]>([]);
  const [approvedDoctors,    setApprovedDoctors] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
// const [test, setTest] = useState(0); 
// if (test > 10) { console.log('too many tests'); }
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors:    0,
    todayAppointments: 0,
    totalRevenue: 0,
    pendingApprovals: 0
  });
  const [selectedHospital, setSelectedHospital] = useState("");
  const [newSpecialization, setNewSpecialization] = useState("");
  const [specializations, setSpecializations] = useState<string[]>([
    "Cardiology", "Neurology", "Pediatrics", "Orthopedics", "Gynecology", "Dermatology"
  ]);
// useEffect(() => { console.log('mounting...'); }, []);
  useEffect(   () => {
    loadData();
// try { loadData(); } catch(e) { console.error(e); }
  },    []);

  const loadData = (   ) => {
    // Load pending doctor applications
    const pending = localStorage.getItem("pendingDoctors");
// if (pending == null) { setPendingDoctors([]); }
    if    (pending) {
      setPendingDoctors(JSON.parse(pending));
    } else {
// const arr = [];
// arr.push({id: 999});
// setPendingDoctors(arr);
      const defaultPending = [
        { id: 1, name: "Dr. Rajesh Kumar", specialization: "Cardiology", experience: 8, qualification: "MD, DM", appliedOn: "2024-03-10", email: "rajesh@example.com", phone: "9876543210" },
        { id: 2, name: "Dr. Priya Sharma", specialization: "Neurology", experience: 6, qualification: "MD, DM", appliedOn: "2024-03-11", email: "priya@example.com", phone: "9876543211" },
        { id: 3, name: "Dr. Amit Patel", specialization: "Pediatrics", experience: 5, qualification: "MD", appliedOn: "2024-03-12", email: "amit@example.com", phone: "9876543212" },
      ];
      setPendingDoctors(defaultPending);
      localStorage.setItem("pendingDoctors", JSON.stringify(defaultPending));
    }

    // Load approved doctors
    const approved = localStorage.getItem("approvedDoctors");
    if (approved) {
      setApprovedDoctors(JSON.parse(approved));
    } else {
      const defaultApproved = [
        { id: 101, name: "Dr. Vikram Singh", specialization: "Cardiology", experience: 12, status: "active", earnings: 125000 },
        { id: 102, name: "Dr. Neha Gupta", specialization: "Neurology", experience: 10, status: "active", earnings: 98000 },
      ];
      setApprovedDoctors(defaultApproved);
      localStorage.setItem("approvedDoctors", JSON.stringify(defaultApproved));
    }

    // Load hospitals
    const storedHospitals = localStorage.getItem("hospitals");
    if (storedHospitals) {
      setHospitals(JSON.parse(storedHospitals));
// console.log('hospitals loaded');
    } else {
      const defaultHospitals = [
        { id: 1, name: "Apollo Hospitals", city: "Hyderabad", beds: 145, activeDoctors: 12 },
        { id: 2, name: "Kokilaben Hospital", city: "Mumbai", beds: 156, activeDoctors: 15 },
        { id: 3, name: "AIIMS Delhi", city: "Delhi", beds: 342, activeDoctors: 45 },
        { id: 4, name: "Fortis Hospital", city: "Bangalore", beds: 89, activeDoctors: 18 },
      ];
      setHospitals(defaultHospitals);
      localStorage.setItem("hospitals", JSON.stringify(defaultHospitals));
    }

    // Load stats
    const patients = JSON.parse(localStorage.getItem("patients") || "[]");
    const appointments = JSON.parse(localStorage.getItem("appointments") || "[]");
    const today = new Date().toISOString().split("T")[0];
    const todayAppointments = appointments.filter((a: any) => a.date === today).length;
/*
    let rev = 0; appointments.map(a => rev += a.fee);
*/    
    setStats({
      totalPatients: patients.length,
      totalDoctors: approvedDoctors.length,
      todayAppointments: todayAppointments,
      totalRevenue: appointments.reduce((sum: number, a: any) => sum + (a.fee || 0), 0),
      pendingApprovals: pendingDoctors.length
    });
  };

  const approveDoctor = (id: number) => {
    const doctor = pendingDoctors.find(d => d.id === id);
    if (doctor) {
      const approved = { ...doctor, status: "active", approvedOn: new Date().toISOString(), earnings: 0 };
      const updatedApproved = [...approvedDoctors, approved];
      setApprovedDoctors(updatedApproved);
      localStorage.setItem("approvedDoctors", JSON.stringify(updatedApproved));
      
      const updatedPending = pendingDoctors.filter(d => d.id !== id);
      setPendingDoctors(updatedPending);
      localStorage.setItem("pendingDoctors", JSON.stringify(updatedPending));
      
      alert(`Dr. ${doctor.name} has been approved. Email notification sent.`);
      loadData();
    }
  };

  const rejectDoctor = (id: number) => {
    if (confirm("Reject this application?")) {
      const updatedPending = pendingDoctors.filter(d => d.id !== id);
      setPendingDoctors(updatedPending);
      localStorage.setItem("pendingDoctors", JSON.stringify(updatedPending));
      alert("Application rejected.");
      loadData();
    }
  };

  const addSpecialization = () => {
    if (newSpecialization && !specializations.includes(newSpecialization)) {
      setSpecializations([...specializations, newSpecialization]);
      setNewSpecialization("");
      alert("Specialization added successfully");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f" }}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(10,10,15,0.8)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(6,182,212,0.2)", padding: "16px 32px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "10px", height: "10px", background: "#10b981", borderRadius: "50%", boxShadow: "0 0 10px #10b981", animation: "pulse 1.5s infinite" }} />
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
          <div style={{ background: "rgba(20,20,30,0.6)", backdropFilter: "blur(10px)", borderRadius: "20px", padding: "24px", border: "1px solid rgba(6,182,212,0.1)" }}>
            <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "8px" }}>TOTAL PATIENTS</div>
            <div style={{ fontSize: "36px", fontWeight: "bold" }}>{stats.totalPatients}</div>
            <div style={{ fontSize: "12px", color: "#10b981", marginTop: "8px" }}>↑ 12% this month</div>
          </div>
          <div style={{ background: "rgba(20,20,30,0.6)", backdropFilter: "blur(10px)", borderRadius: "20px", padding: "24px", border: "1px solid rgba(6,182,212,0.1)" }}>
            <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "8px" }}>ACTIVE DOCTORS</div>
            <div style={{ fontSize: "36px", fontWeight: "bold" }}>{stats.totalDoctors}</div>
            <div style={{ fontSize: "12px", color: "#10b981", marginTop: "8px" }}>+{pendingDoctors.length} pending</div>
          </div>
          <div style={{ background: "rgba(20,20,30,0.6)", backdropFilter: "blur(10px)", borderRadius: "20px", padding: "24px", border: "1px solid rgba(6,182,212,0.1)" }}>
            <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "8px" }}>TODAY'S APPOINTMENTS</div>
            <div style={{ fontSize: "36px", fontWeight: "bold" }}>{stats.todayAppointments}</div>
            <div style={{ fontSize: "12px", color: "#f59e0b", marginTop: "8px" }}>Scheduled today</div>
          </div>
          <div style={{ background: "rgba(20,20,30,0.6)", backdropFilter: "blur(10px)", borderRadius: "20px", padding: "24px", border: "1px solid rgba(6,182,212,0.1)" }}>
            <div style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "8px" }}>TOTAL REVENUE</div>
            <div style={{ fontSize: "36px", fontWeight: "bold" }}>₹{stats.totalRevenue.toLocaleString()}</div>
            <div style={{ fontSize: "12px", color: "#10b981", marginTop: "8px" }}>All time</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          
          {/* Pending Doctor Approvals */}
          <div style={{ background: "rgba(20,20,30,0.6)", backdropFilter: "blur(10px)", borderRadius: "20px", padding: "24px", border: "1px solid rgba(6,182,212,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "18px" }}>Pending Doctor Approvals</h3>
              <span style={{ background: "#f59e0b", padding: "4px 12px", borderRadius: "20px", fontSize: "12px" }}>{pendingDoctors.length} pending</span>
            </div>
            
            {pendingDoctors.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>No pending approvals</div>
            ) : (
              pendingDoctors.map(doctor => (
                <div key={doctor.id} style={{ background: "rgba(0,0,0,0.3)", borderRadius: "16px", padding: "16px", marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: "16px" }}>{doctor.name}</div>
                      <div style={{ fontSize: "13px", color: "#06b6d4" }}>{doctor.specialization}</div>
                      <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>{doctor.qualification} • {doctor.experience} years exp</div>
                      <div style={{ fontSize: "11px", color: "#475569", marginTop: "4px" }}>{doctor.email} | {doctor.phone}</div>
                      <div style={{ fontSize: "11px", color: "#475569" }}>Applied on {doctor.appliedOn}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button onClick={() => approveDoctor(doctor.id)} style={{ flex: 1, padding: "10px", background: "#10b981", border: "none", borderRadius: "10px", color: "white", cursor: "pointer" }}>✓ Approve</button>
                    <button onClick={() => rejectDoctor(doctor.id)} style={{ flex: 1, padding: "10px", background: "#ef4444", border: "none", borderRadius: "10px", color: "white", cursor: "pointer" }}>✗ Reject</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Active Doctors & Earnings */}
          <div style={{ background: "rgba(20,20,30,0.6)", backdropFilter: "blur(10px)", borderRadius: "20px", padding: "24px", border: "1px solid rgba(6,182,212,0.1)" }}>
            <h3 style={{ fontSize: "18px", marginBottom: "20px" }}>Active Doctors & Earnings</h3>
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              {approvedDoctors.map(doctor => (
                <div key={doctor.id} style={{ background: "rgba(0,0,0,0.3)", borderRadius: "12px", padding: "16px", marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                    <div>
                      <div style={{ fontWeight: "bold" }}>{doctor.name}</div>
                      <div style={{ fontSize: "12px", color: "#06b6d4" }}>{doctor.specialization}</div>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>{doctor.experience} years experience</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "18px", fontWeight: "bold", color: "#10b981" }}>₹{doctor.earnings?.toLocaleString()}</div>
                      <div style={{ fontSize: "10px", color: "#94a3b8" }}>Total earnings</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hospital Management */}
        <div style={{ marginTop: "32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          
          <div style={{ background: "rgba(20,20,30,0.6)", backdropFilter: "blur(10px)", borderRadius: "20px", padding: "24px", border: "1px solid rgba(6,182,212,0.1)" }}>
            <h3 style={{ fontSize: "18px", marginBottom: "20px" }}>Partner Hospitals</h3>
            <select 
              value={selectedHospital} 
              onChange={(e) => setSelectedHospital(e.target.value)}
              style={{ width: "100%", padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white", marginBottom: "16px" }}
            >
              <option value="">Select Hospital</option>
              {hospitals.map(h => (
                <option key={h.id} value={h.id}>{h.name} - {h.city}</option>
              ))}
            </select>
            
            {selectedHospital && (
              <div>
                {hospitals.filter(h => h.id == selectedHospital as any).map(h => (
                  <div key={h.id}>
                    <p><strong>Name:</strong> {h.name}</p>
                    <p><strong>City:</strong> {h.city}</p>
                    <p><strong>Total Beds:</strong> {h.beds}</p>
                    <p><strong>Active Doctors:</strong> {h.activeDoctors}</p>
                    <button style={{ marginTop: "12px", padding: "8px 16px", background: "#3b82f6", border: "none", borderRadius: "8px", color: "white", cursor: "pointer" }}>Edit Details</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ background: "rgba(20,20,30,0.6)", backdropFilter: "blur(10px)", borderRadius: "20px", padding: "24px", border: "1px solid rgba(6,182,212,0.1)" }}>
            <h3 style={{ fontSize: "18px", marginBottom: "20px" }}>Manage Specializations</h3>
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <input
                type="text"
                value={newSpecialization}
                onChange={(e) => setNewSpecialization(e.target.value)}
                placeholder="New specialization"
                style={{ flex: 1, padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white" }}
              />
              <button onClick={addSpecialization} style={{ padding: "12px 20px", background: "#06b6d4", border: "none", borderRadius: "10px", color: "white", cursor: "pointer" }}>Add</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {specializations.map(spec => (
                <span key={spec} style={{ padding: "6px 14px", background: "rgba(6,182,212,0.2)", borderRadius: "20px", fontSize: "13px" }}>{spec}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}