"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Appointment {
  id: number;
  patientName: string;
  age: number;
  gender: string;
  time: string;
  date: string;
  status: "waiting" | "in-progress" | "completed";
  type: "video" | "in-person";
  symptoms: string;
  phone: string;
}

interface DoctorStats {
  totalPatients: number;
  todayAppointments: number;
  completedAppointments: number;
  totalEarnings: number;
  monthlyEarnings: number;
  rating: number;
  yearsExperience: number;
}

export default function DoctorPage() {
  const [doctor, setDoctor] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<DoctorStats>({
    totalPatients: 0,
    todayAppointments: 0,
    completedAppointments: 0,
    totalEarnings: 0,
    monthlyEarnings: 0,
    rating: 4.8,
    yearsExperience: 12
  });
  const [availability, setAvailability] = useState<string[]>(["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"]);
  const [newSlot, setNewSlot] = useState("");
  const [showPrescriptionModal, setShowPrescriptionModal] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState<"today" | "all" | "earnings">("today");
  const [earningsHistory, setEarningsHistory] = useState<any[]>([]);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setDoctor(parsed);
    }
    
    // Load fake appointments data
    loadFakeData();
  }, []);

  const loadFakeData = () => {
    // Today's appointments with fake data
    const todayAppointments: Appointment[] = [
      { id: 1, patientName: "Mukesh Kumar", age: 45, gender: "Male", time: "09:00 AM", date: new Date().toISOString().split("T")[0], status: "completed", type: "in-person", symptoms: "Chest pain, shortness of breath", phone: "9876543210" },
      { id: 2, patientName: "Priya Sharma", age: 32, gender: "Female", time: "10:00 AM", date: new Date().toISOString().split("T")[0], status: "completed", type: "video", symptoms: "Severe headache, nausea", phone: "9876543211" },
      { id: 3, patientName: "Amit Patel", age: 28, gender: "Male", time: "11:00 AM", date: new Date().toISOString().split("T")[0], status: "in-progress", type: "in-person", symptoms: "Fever, cough, fatigue", phone: "9876543212" },
      { id: 4, patientName: "Sneha Reddy", age: 38, gender: "Female", time: "02:00 PM", date: new Date().toISOString().split("T")[0], status: "waiting", type: "in-person", symptoms: "Joint pain, swelling", phone: "9876543213" },
      { id: 5, patientName: "Vikram Singh", age: 52, gender: "Male", time: "03:00 PM", date: new Date().toISOString().split("T")[0], status: "waiting", type: "video", symptoms: "High BP, dizziness", phone: "9876543214" },
      { id: 6, patientName: "Neha Gupta", age: 29, gender: "Female", time: "04:00 PM", date: new Date().toISOString().split("T")[0], status: "waiting", type: "in-person", symptoms: "Stomach pain, vomiting", phone: "9876543215" },
    ];
    setAppointments(todayAppointments);
    
    // Calculate stats
    const completed = todayAppointments.filter(a => a.status === "completed").length;
    const todayCount = todayAppointments.length;
    
    setStats({
      totalPatients: 1247,
      todayAppointments: todayCount,
      completedAppointments: completed,
      totalEarnings: 284500,
      monthlyEarnings: 45200,
      rating: 4.9,
      yearsExperience: 12
    });
    
    // Earnings history
    const earningsData = [
      { month: "Jan", amount: 38500 },
      { month: "Feb", amount: 41200 },
      { month: "Mar", amount: 39800 },
      { month: "Apr", amount: 45200 },
      { month: "May", amount: 47800 },
      { month: "Jun", amount: 51200 },
    ];
    setEarningsHistory(earningsData);
  };

  const updateAppointmentStatus = (id: number, status: "waiting" | "in-progress" | "completed") => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a));
    
    // Update stats if completed
    if (status === "completed") {
      setStats(prev => ({
        ...prev,
        completedAppointments: prev.completedAppointments + 1,
        monthlyEarnings: prev.monthlyEarnings + 500
      }));
    }
  };

  const addTimeSlot = () => {
    if (newSlot && !availability.includes(newSlot)) {
      setAvailability([...availability, newSlot]);
      setNewSlot("");
    }
  };

  const savePrescription = (appointmentId: number, medicines: string, notes: string) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (appointment) {
      const prescription = {
        id: Date.now(),
        patientName: appointment.patientName,
        doctorName: doctor?.name || "Dr. User",
        date: new Date().toISOString().split("T")[0],
        medicines: medicines,
        notes: notes,
        followUp: "1 week"
      };
      
      // Save to localStorage
      const existing = localStorage.getItem("prescriptions");
      const prescriptions = existing ? JSON.parse(existing) : [];
      prescriptions.push(prescription);
      localStorage.setItem("prescriptions", JSON.stringify(prescriptions));
      
      alert(`Prescription saved for ${appointment.patientName}`);
      setShowPrescriptionModal(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "waiting": return "#f59e0b";
      case "in-progress": return "#06b6d4";
      case "completed": return "#10b981";
      default: return "#6b7280";
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "waiting": return { bg: "rgba(245,158,11,0.15)", text: "Waiting" };
      case "in-progress": return { bg: "rgba(6,182,212,0.15)", text: "In Progress" };
      case "completed": return { bg: "rgba(16,185,129,0.15)", text: "Completed" };
      default: return { bg: "rgba(107,114,128,0.15)", text: "Unknown" };
    }
  };

  const filteredAppointments = selectedTab === "today" 
    ? appointments 
    : selectedTab === "all" 
      ? appointments 
      : [];

  if (!doctor) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f" }}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(10,10,15,0.8)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(6,182,212,0.2)", padding: "16px 32px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "bold", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>
              Doctor Dashboard
            </h1>
            <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>
              Welcome back, {doctor.name || "Dr. User"} • Rating: {stats.rating} • {stats.yearsExperience} years experience
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <Link href="/doctor/video-call">
              <button style={{ padding: "8px 20px", background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.3)", borderRadius: "10px", cursor: "pointer", color: "#06b6d4" }}>
                Video Call
              </button>
            </Link>
            <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }} style={{ padding: "8px 20px", background: "#ef4444", border: "none", borderRadius: "10px", cursor: "pointer", color: "white" }}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px" }}>
        
        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "20px", marginBottom: "32px" }}>
          <div style={{ background: "rgba(20,20,30,0.6)", borderRadius: "20px", padding: "20px", border: "1px solid rgba(6,182,212,0.1)" }}>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>Total Patients</div>
            <div style={{ fontSize: "32px", fontWeight: "bold", marginTop: "8px" }}>{stats.totalPatients}</div>
            <div style={{ fontSize: "11px", color: "#10b981", marginTop: "4px" }}>↑ 124 this month</div>
          </div>
          <div style={{ background: "rgba(20,20,30,0.6)", borderRadius: "20px", padding: "20px", border: "1px solid rgba(6,182,212,0.1)" }}>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>Today's Patients</div>
            <div style={{ fontSize: "32px", fontWeight: "bold", marginTop: "8px" }}>{stats.todayAppointments}</div>
            <div style={{ fontSize: "11px", color: "#f59e0b", marginTop: "4px" }}>{appointments.filter(a => a.status === "waiting").length} waiting</div>
          </div>
          <div style={{ background: "rgba(20,20,30,0.6)", borderRadius: "20px", padding: "20px", border: "1px solid rgba(6,182,212,0.1)" }}>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>Completed</div>
            <div style={{ fontSize: "32px", fontWeight: "bold", marginTop: "8px" }}>{stats.completedAppointments}</div>
            <div style={{ fontSize: "11px", color: "#10b981", marginTop: "4px" }}>Today</div>
          </div>
          <div style={{ background: "rgba(20,20,30,0.6)", borderRadius: "20px", padding: "20px", border: "1px solid rgba(6,182,212,0.1)" }}>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>Monthly Earnings</div>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#10b981", marginTop: "8px" }}>₹{stats.monthlyEarnings.toLocaleString()}</div>
            <div style={{ fontSize: "11px", color: "#10b981", marginTop: "4px" }}>↑ 8% vs last month</div>
          </div>
          <div style={{ background: "rgba(20,20,30,0.6)", borderRadius: "20px", padding: "20px", border: "1px solid rgba(6,182,212,0.1)" }}>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>Total Earnings</div>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#10b981", marginTop: "8px" }}>₹{stats.totalEarnings.toLocaleString()}</div>
            <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>All time</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "12px" }}>
          <button onClick={() => setSelectedTab("today")} style={{ padding: "8px 24px", background: selectedTab === "today" ? "rgba(6,182,212,0.2)" : "transparent", border: selectedTab === "today" ? "1px solid #06b6d4" : "none", borderRadius: "30px", cursor: "pointer", color: selectedTab === "today" ? "#06b6d4" : "#94a3b8" }}>
            Today's Queue ({appointments.length})
          </button>
          <button onClick={() => setSelectedTab("earnings")} style={{ padding: "8px 24px", background: selectedTab === "earnings" ? "rgba(6,182,212,0.2)" : "transparent", border: selectedTab === "earnings" ? "1px solid #06b6d4" : "none", borderRadius: "30px", cursor: "pointer", color: selectedTab === "earnings" ? "#06b6d4" : "#94a3b8" }}>
            Earnings History
          </button>
          <button onClick={() => setSelectedTab("all")} style={{ padding: "8px 24px", background: selectedTab === "all" ? "rgba(6,182,212,0.2)" : "transparent", border: selectedTab === "all" ? "1px solid #06b6d4" : "none", borderRadius: "30px", cursor: "pointer", color: selectedTab === "all" ? "#06b6d4" : "#94a3b8" }}>
            All Appointments
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          
          {/* Left Column - Patient Queue */}
          <div style={{ background: "rgba(20,20,30,0.6)", backdropFilter: "blur(10px)", borderRadius: "24px", padding: "24px", border: "1px solid rgba(6,182,212,0.1)" }}>
            <h3 style={{ fontSize: "18px", marginBottom: "20px" }}>Patient Queue</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "500px", overflowY: "auto" }}>
              {filteredAppointments.map(apt => {
                const statusBadge = getStatusBadge(apt.status);
                return (
                  <div key={apt.id} style={{ background: "rgba(0,0,0,0.3)", borderRadius: "16px", padding: "16px", borderLeft: `3px solid ${getStatusColor(apt.status)}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
                      <div>
                        <div style={{ fontWeight: "bold", fontSize: "16px" }}>{apt.patientName}</div>
                        <div style={{ fontSize: "12px", color: "#94a3b8" }}>{apt.age} yrs • {apt.gender} • {apt.phone}</div>
                        <div style={{ fontSize: "12px", color: "#06b6d4", marginTop: "4px" }}>Time: {apt.time} • {apt.type === "video" ? "Video" : "In-Person"}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ padding: "4px 12px", background: statusBadge.bg, borderRadius: "20px", fontSize: "11px", color: getStatusColor(apt.status) }}>
                          {statusBadge.text}
                        </span>
                      </div>
                    </div>
                    <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "12px" }}>
                      <strong>Symptoms:</strong> {apt.symptoms}
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <select 
                        value={apt.status} 
                        onChange={(e) => updateAppointmentStatus(apt.id, e.target.value as any)}
                        style={{ padding: "6px 12px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "white", fontSize: "12px" }}
                      >
                        <option value="waiting">Waiting</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button 
                        onClick={() => setShowPrescriptionModal(apt)} 
                        style={{ padding: "6px 16px", background: "#3b82f6", border: "none", borderRadius: "8px", cursor: "pointer", color: "white", fontSize: "12px" }}
                      >
                        Write Prescription
                      </button>
                      {apt.type === "video" && apt.status === "in-progress" && (
                        <Link href={`/doctor/video-call?room=room-${apt.id}`}>
                          <button style={{ padding: "6px 16px", background: "#06b6d4", border: "none", borderRadius: "8px", cursor: "pointer", color: "white", fontSize: "12px" }}>
                            Start Call
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Availability & Earnings */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Availability Calendar */}
            <div style={{ background: "rgba(20,20,30,0.6)", backdropFilter: "blur(10px)", borderRadius: "24px", padding: "24px", border: "1px solid rgba(6,182,212,0.1)" }}>
              <h3 style={{ fontSize: "18px", marginBottom: "16px" }}>Availability Calendar</h3>
              <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <select
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  style={{ flex: 1, padding: "10px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "white" }}
                >
                  <option value="">Select time slot</option>
                  <option>09:00 AM</option><option>10:00 AM</option><option>11:00 AM</option>
                  <option>02:00 PM</option><option>03:00 PM</option><option>04:00 PM</option>
                  <option>05:00 PM</option><option>06:00 PM</option>
                </select>
                <button onClick={addTimeSlot} style={{ padding: "10px 20px", background: "#06b6d4", border: "none", borderRadius: "8px", cursor: "pointer", color: "white" }}>Add Slot</button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {availability.map(slot => (
                  <span key={slot} style={{ padding: "6px 14px", background: "rgba(6,182,212,0.15)", borderRadius: "20px", fontSize: "13px", color: "#06b6d4" }}>{slot}</span>
                ))}
              </div>
            </div>

            {/* Earnings Chart */}
            {selectedTab === "earnings" && (
              <div style={{ background: "rgba(20,20,30,0.6)", backdropFilter: "blur(10px)", borderRadius: "24px", padding: "24px", border: "1px solid rgba(6,182,212,0.1)" }}>
                <h3 style={{ fontSize: "18px", marginBottom: "20px" }}>Monthly Earnings</h3>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "200px", paddingBottom: "10px" }}>
                  {earningsHistory.map((item, idx) => (
                    <div key={idx} style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ height: `${(item.amount / 60000) * 160}px`, background: "#3b82f6", opacity: 0.7, borderRadius: "6px 6px 0 0", marginBottom: "8px", width: "100%" }} />
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>{item.month}</div>
                      <div style={{ fontSize: "10px", color: "#10b981" }}>₹{Math.round(item.amount / 1000)}k</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "20px", padding: "16px", background: "rgba(0,0,0,0.3)", borderRadius: "12px", textAlign: "center" }}>
                  <div style={{ fontSize: "14px", color: "#94a3b8" }}>Average per month</div>
                  <div style={{ fontSize: "28px", fontWeight: "bold", color: "#10b981" }}>₹{Math.round(earningsHistory.reduce((sum, i) => sum + i.amount, 0) / earningsHistory.length).toLocaleString()}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prescription Modal */}
      {showPrescriptionModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "rgba(20,20,30,0.95)", backdropFilter: "blur(20px)", borderRadius: "28px", padding: "32px", maxWidth: "500px", width: "100%", border: "1px solid rgba(6,182,212,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "22px" }}>Prescription</h3>
              <button onClick={() => setShowPrescriptionModal(null)} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "20px", cursor: "pointer" }}>x</button>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <p><strong>Patient:</strong> {showPrescriptionModal.patientName}</p>
              <p><strong>Age:</strong> {showPrescriptionModal.age} yrs</p>
              <p><strong>Symptoms:</strong> {showPrescriptionModal.symptoms}</p>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "6px", display: "block" }}>Medicines</label>
              <textarea id="medicines" rows={4} placeholder="Enter medicines with dosage..." style={{ width: "100%", padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white", resize: "none" }} />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "6px", display: "block" }}>Notes / Instructions</label>
              <textarea id="notes" rows={3} placeholder="Additional instructions for patient..." style={{ width: "100%", padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white", resize: "none" }} />
            </div>
            <button 
              onClick={() => savePrescription(
                showPrescriptionModal.id, 
                (document.getElementById("medicines") as HTMLTextAreaElement).value,
                (document.getElementById("notes") as HTMLTextAreaElement).value
              )} 
              style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", border: "none", borderRadius: "12px", color: "white", cursor: "pointer", fontSize: "16px" }}
            >
              Save Prescription
            </button>
          </div>
        </div>
      )}
    </div>
  );
}