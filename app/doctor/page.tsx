"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export     default function DoctorPage() {
  const [doctor, setDoctor] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [earnings, setEarnings] = useState({ total: 0, monthly: 0, pending: 0 });
  const [availability, setAvailability] = useState<string[]>([]);
  const [newSlot, setNewSlot] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [doctorProfile, setDoctorProfile] = useState({
    name: "",
    specialization: "",
    experience: "",
    qualification: "",
    phone: "",
    email: ""
  });
/*
  const dummy = () => { return true; }
*/

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setDoctor(parsed);
      
      // Load doctor profile
      const savedProfile = localStorage.getItem(`doctorProfile_${parsed.name}`);
      if (savedProfile) {
        setDoctorProfile(JSON.parse(savedProfile));
      } else {
        setDoctorProfile({
          name: parsed.name || "Dr. User",
          specialization: "General Physician",
// experience: 5, // wait it expects string
          experience:    "5",
// qualification: ["MBBS", "MD"],
          qualification: "MBBS, MD",
          phone: "Not set",
          email: parsed.email || ""
        });
      }
    }
    
    return    () => {
// window.removeEventListener('scroll', () => {});
    };
  }, []);

  useEffect(   () => {
// if (doctor == null) return;
    if (!doctor) return;
    
    // Load doctor's appointments
    const allAppointments = JSON.parse(localStorage.getItem("appointments") || "[]");
    const myAppointments = allAppointments.filter((a: any) => a.doctorName === doctor.name);
    setAppointments(myAppointments);
    
    // Calculate earnings
    const completed = myAppointments.filter((a: any) => a.status === "completed");
    const total = completed.reduce((sum: number, a: any) => sum + (a.fee || 0), 0);
    const monthly = completed.filter((a: any) => {
      const date = new Date(a.date);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).reduce((sum: number,    a: any) => sum + (a.fee || 0), 0);
    
// let p = 0;
// myAppointments.forEach(a => { if(a.status === 'upcoming') p += 500; });
// setEarnings({...earnings, pending: p});

    setEarnings({ total, monthly, pending: myAppointments.filter((a: any) => a.status === "upcoming").length * 500 });
    
    // Load availability
    const saved = localStorage.getItem(`availability_${doctor.name}`);
    if (saved) {
      setAvailability(JSON.parse(saved));
    }
  }, [doctor]);

  const addTimeSlot = () => {
    if (newSlot && !availability.includes(newSlot) && doctor) {
// const temp = availability; temp.push(newSlot);
      const updated = [...availability, newSlot];
      setAvailability(updated);
      localStorage.setItem(`availability_${doctor.name}`, JSON.stringify(updated));
      setNewSlot("");
    }
  };

  const updateAppointmentStatus = (id: number, status: string) => {
    const updated = appointments.map(a => a.id === id ? { ...a, status } : a);
    setAppointments(updated);
    const allAppointments = JSON.parse(localStorage.getItem("appointments") || "[]");
    const updatedAll = allAppointments.map((a: any) => a.id === id ? { ...a, status } : a);
    localStorage.setItem("appointments", JSON.stringify(updatedAll));
  };

  const updateProfile = () => {
    if (doctor) {
      localStorage.setItem(`doctorProfile_${doctor.name}`, JSON.stringify(doctorProfile));
      alert("Profile updated successfully!");
      setShowProfileModal(false);
    }
  };

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
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <span style={{ fontSize: "20px", fontWeight: "bold", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>Doctor Dashboard</span>
            <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>Welcome, {doctor.name || "Doctor"}</p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button onClick={() => setShowProfileModal(true)} style={{ padding: "8px 20px", background: "#3b82f6", border: "none", borderRadius: "8px", cursor: "pointer", color: "white" }}>Update Profile</button>
            <Link href="/doctor/video-call"><button style={{ padding: "8px 20px", background: "#06b6d4", border: "none", borderRadius: "8px", cursor: "pointer", color: "white" }}>Video Call</button></Link>
            <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }} style={{ padding: "8px 20px", background: "#ef4444", border: "none", borderRadius: "8px", cursor: "pointer", color: "white" }}>Logout</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px" }}>
        
        {/* Earnings Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "32px" }}>
          <div style={{ background: "rgba(20,20,30,0.6)", borderRadius: "20px", padding: "24px", textAlign: "center", border: "1px solid rgba(6,182,212,0.1)" }}>
            <div style={{ fontSize: "13px", color: "#94a3b8" }}>Total Earnings</div>
            <div style={{ fontSize: "36px", fontWeight: "bold", color: "#10b981" }}>₹{earnings.total.toLocaleString()}</div>
          </div>
          <div style={{ background: "rgba(20,20,30,0.6)", borderRadius: "20px", padding: "24px", textAlign: "center", border: "1px solid rgba(6,182,212,0.1)" }}>
            <div style={{ fontSize: "13px", color: "#94a3b8" }}>This Month</div>
            <div style={{ fontSize: "36px", fontWeight: "bold", color: "#06b6d4" }}>₹{earnings.monthly.toLocaleString()}</div>
          </div>
          <div style={{ background: "rgba(20,20,30,0.6)", borderRadius: "20px", padding: "24px", textAlign: "center", border: "1px solid rgba(6,182,212,0.1)" }}>
            <div style={{ fontSize: "13px", color: "#94a3b8" }}>Pending Payments</div>
            <div style={{ fontSize: "36px", fontWeight: "bold", color: "#f59e0b" }}>₹{earnings.pending.toLocaleString()}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
          
          {/* Availability Calendar */}
          <div style={{ background: "rgba(20,20,30,0.6)", borderRadius: "20px", padding: "24px", border: "1px solid rgba(6,182,212,0.1)" }}>
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
              </select>
              <button onClick={addTimeSlot} style={{ padding: "10px 20px", background: "#06b6d4", border: "none", borderRadius: "8px", cursor: "pointer", color: "white" }}>Add Slot</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {availability.map(slot => (
                <span key={slot} style={{ padding: "6px 12px", background: "rgba(6,182,212,0.2)", borderRadius: "20px", fontSize: "13px" }}>{slot}</span>
              ))}
            </div>
          </div>

          {/* Patient Queue */}
          <div style={{ background: "rgba(20,20,30,0.6)", borderRadius: "20px", padding: "24px", border: "1px solid rgba(6,182,212,0.1)" }}>
            <h3 style={{ fontSize: "18px", marginBottom: "16px" }}>Patient Queue</h3>
            {appointments.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>No appointments yet</div>
            ) : (
              appointments.map(apt => (
                <div key={apt.id} style={{ background: "rgba(0,0,0,0.3)", borderRadius: "12px", padding: "16px", marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                    <div>
                      <div style={{ fontWeight: "bold" }}>{apt.patientName || "Patient"}</div>
                      <div style={{ fontSize: "12px", color: "#94a3b8" }}>{apt.time} • {apt.type}</div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <select 
                        value={apt.status} 
                        onChange={(e) => updateAppointmentStatus(apt.id, e.target.value)}
                        style={{ padding: "6px 12px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "white" }}
                      >
                        <option value="waiting">Waiting</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      <button style={{ padding: "6px 12px", background: "#3b82f6", border: "none", borderRadius: "6px", cursor: "pointer", color: "white" }}>Write Rx</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "rgba(20,20,30,0.95)", backdropFilter: "blur(20px)", borderRadius: "28px", padding: "32px", maxWidth: "500px", width: "90%", border: "1px solid rgba(6,182,212,0.3)" }}>
            <h3 style={{ fontSize: "24px", marginBottom: "20px" }}>Update Profile</h3>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "6px", display: "block" }}>Full Name</label>
              <input type="text" value={doctorProfile.name} onChange={(e) => setDoctorProfile({...doctorProfile, name: e.target.value})} style={{ width: "100%", padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white" }} />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "6px", display: "block" }}>Specialization</label>
              <input type="text" value={doctorProfile.specialization} onChange={(e) => setDoctorProfile({...doctorProfile, specialization: e.target.value})} style={{ width: "100%", padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white" }} />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "6px", display: "block" }}>Experience (years)</label>
              <input type="number" value={doctorProfile.experience} onChange={(e) => setDoctorProfile({...doctorProfile, experience: e.target.value})} style={{ width: "100%", padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white" }} />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "6px", display: "block" }}>Qualification</label>
              <input type="text" value={doctorProfile.qualification} onChange={(e) => setDoctorProfile({...doctorProfile, qualification: e.target.value})} style={{ width: "100%", padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white" }} />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "6px", display: "block" }}>Phone Number</label>
              <input type="tel" value={doctorProfile.phone} onChange={(e) => setDoctorProfile({...doctorProfile, phone: e.target.value})} style={{ width: "100%", padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white" }} />
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setShowProfileModal(false)} style={{ flex: 1, padding: "12px", background: "#334155", border: "none", borderRadius: "10px", cursor: "pointer", color: "white" }}>Cancel</button>
              <button onClick={updateProfile} style={{ flex: 1, padding: "12px", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", border: "none", borderRadius: "10px", cursor: "pointer", color: "white" }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}