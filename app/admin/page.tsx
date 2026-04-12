"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Hospital {
  id: number;
  name: string;
  city: string;
  beds: number;
  activeDoctors: number;
  occupancyRate: number;
  rushLevel: string;
  rushHours: string;
}

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  experience: number;
  status: string;
  earnings: number;
  patientsAttended: number;
}

interface Appointment {
  id: number;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: string;
}

export default function AdminPage() {
  const [pendingDoctors, setPendingDoctors] = useState<any[]>([]);
  const [approvedDoctors, setApprovedDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [specializations, setSpecializations] = useState<string[]>([
    "Cardiology", "Neurology", "Pediatrics", "Orthopedics", "Gynecology", "Dermatology", "ENT", "Ophthalmology"
  ]);
  const [newSpecialization, setNewSpecialization] = useState("");
  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    todayAppointments: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    criticalHospitals: 0
  });

  useEffect(() => {
    loadRandomData();
  }, []);

  const loadRandomData = () => {
    // Generate random hospitals with rush data
    const hospitalNames = ["Apollo Hospitals", "Fortis Healthcare", "AIIMS", "Max Super Speciality", "Manipal Hospitals", "Narayana Health", "Kokilaben Hospital", "Lilavati Hospital"];
    const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune"];
    const rushLevels = ["Low Rush", "Medium Rush", "High Rush", "Critical"];
    const rushHoursOptions = ["9AM-12PM", "12PM-3PM", "3PM-6PM", "6PM-9PM", "9AM-1PM & 5PM-8PM"];
    
    const randomHospitals: Hospital[] = hospitalNames.slice(0, 8).map((name, i) => {
      const occupancyRate = Math.floor(Math.random() * 80) + 20;
      let rushLevel = "Low Rush";
      let rushHours = "9AM-12PM";
      
      if (occupancyRate > 75) {
        rushLevel = "High Rush";
        rushHours = "9AM-1PM & 5PM-9PM";
      } else if (occupancyRate > 50) {
        rushLevel = "Medium Rush";
        rushHours = "10AM-1PM & 4PM-7PM";
      } else {
        rushLevel = "Low Rush";
        rushHours = "11AM-2PM";
      }
      
      return {
        id: i + 1,
        name: name,
        city: cities[i % cities.length],
        beds: Math.floor(Math.random() * 300) + 100,
        activeDoctors: Math.floor(Math.random() * 50) + 10,
        occupancyRate: occupancyRate,
        rushLevel: rushLevel,
        rushHours: rushHours
      };
    });
    setHospitals(randomHospitals);
    
    // Generate random doctors
    const doctorNames = ["Dr. Jnana Manojna Wuriti", "Dr. Priya Sharma", "Dr. Amit Patel", "Dr. Sneha Reddy", "Dr. Vikram Singh", "Dr. Neha Gupta", "Dr. Rahul Mehta", "Dr. Anjali Nair"];
    const specializationsList = ["Cardiologist", "Neurologist", "Pediatrician", "Orthopedic", "Gynecologist", "Dermatologist"];
    
    const randomDoctors: Doctor[] = doctorNames.map((name, i) => ({
      id: i + 1,
      name: name,
      specialization: specializationsList[i % specializationsList.length],
      experience: Math.floor(Math.random() * 20) + 5,
      status: "active",
      earnings: Math.floor(Math.random() * 200000) + 50000,
      patientsAttended: Math.floor(Math.random() * 500) + 100
    }));
    setApprovedDoctors(randomDoctors);
    
    // Generate random appointments for today
    const patientNames = ["Raj Malhotra", "Priya Singh", "Amit Verma", "Neha Kapoor", "Vikram Rathore", "Sneha Joshi"];
    const todayAppts: Appointment[] = patientNames.map((name, i) => ({
      id: i + 1,
      patientName: name,
      doctorName: randomDoctors[i % randomDoctors.length].name,
      date: new Date().toISOString().split("T")[0],
      time: ["10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM", "5:00 PM"][i % 5],
      status: ["waiting", "in-progress", "completed"][i % 3]
    }));
    setAppointments(todayAppts);
    
    // Load pending doctors from localStorage or create sample
    const stored = localStorage.getItem("pendingDoctors");
    if (stored) {
      setPendingDoctors(JSON.parse(stored));
    } else {
      const samplePending = [
        { id: 101, name: "Dr. Sanjay Mehta", specialization: "Cardiology", experience: 8, qualification: "MD, DM", appliedOn: "2024-03-10", email: "sanjay@example.com", phone: "9876543210" },
        { id: 102, name: "Dr. Pooja Desai", specialization: "Neurology", experience: 6, qualification: "MD, DM", appliedOn: "2024-03-11", email: "pooja@example.com", phone: "9876543211" },
      ];
      setPendingDoctors(samplePending);
      localStorage.setItem("pendingDoctors", JSON.stringify(samplePending));
    }
    
    // Update stats
    const criticalCount = randomHospitals.filter(h => h.rushLevel === "High Rush" || h.rushLevel === "Critical").length;
    setStats({
      totalPatients: Math.floor(Math.random() * 2000) + 1000,
      totalDoctors: randomDoctors.length,
      todayAppointments: todayAppts.length,
      totalRevenue: Math.floor(Math.random() * 500000) + 200000,
      pendingApprovals: pendingDoctors.length,
      criticalHospitals: criticalCount
    });
  };

  const approveDoctor = (id: number) => {
    const doctor = pendingDoctors.find(d => d.id === id);
    if (doctor) {
      const newDoctor: Doctor = {
        id: Date.now(),
        name: doctor.name,
        specialization: doctor.specialization,
        experience: doctor.experience,
        status: "active",
        earnings: 0,
        patientsAttended: 0
      };
      setApprovedDoctors([...approvedDoctors, newDoctor]);
      setPendingDoctors(pendingDoctors.filter(d => d.id !== id));
      localStorage.setItem("pendingDoctors", JSON.stringify(pendingDoctors.filter(d => d.id !== id)));
      alert(`Dr. ${doctor.name} has been approved`);
      loadRandomData();
    }
  };

  const rejectDoctor = (id: number) => {
    if (confirm("Reject this application?")) {
      setPendingDoctors(pendingDoctors.filter(d => d.id !== id));
      localStorage.setItem("pendingDoctors", JSON.stringify(pendingDoctors.filter(d => d.id !== id)));
      alert("Application rejected");
      loadRandomData();
    }
  };

  const addSpecialization = () => {
    if (newSpecialization && !specializations.includes(newSpecialization)) {
      setSpecializations([...specializations, newSpecialization]);
      setNewSpecialization("");
      alert(`Specialization "${newSpecialization}" added`);
    }
  };

  const deleteSpecialization = (spec: string) => {
    if (confirm(`Remove "${spec}" specialization?`)) {
      setSpecializations(specializations.filter(s => s !== spec));
    }
  };

  /*
  const exportSystemReport = () => {
    const reportData = { timestamp: new Date().toISOString(), stats, hospitals: hospitals.length };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  };
  */

  const getRushColor = (level: string) => {
    switch(level) {
      case "High Rush": return "#ef4444";
      case "Medium Rush": return "#f59e0b";
      case "Low Rush": return "#10b981";
      default: return "#6b7280";
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a" }}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "#0f172a", borderBottom: "1px solid #334155", padding: "16px 32px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "10px", height: "10px", background: "#10b981", borderRadius: "50%" }} />
            <span style={{ fontSize: "20px", fontWeight: "bold", color: "#f1f5f9" }}>ADMIN PANEL</span>
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <button onClick={() => setSelectedTab("overview")} style={{ padding: "6px 16px", background: selectedTab === "overview" ? "rgba(37, 99, 235, 0.1)" : "transparent", border: "none", borderRadius: "20px", color: selectedTab === "overview" ? "#2563eb" : "#94a3b8", cursor: "pointer" }}>Overview</button>
            <button onClick={() => setSelectedTab("hospitals")} style={{ padding: "6px 16px", background: selectedTab === "hospitals" ? "rgba(37, 99, 235, 0.1)" : "transparent", border: "none", borderRadius: "20px", color: selectedTab === "hospitals" ? "#2563eb" : "#94a3b8", cursor: "pointer" }}>Hospitals</button>
            <button onClick={() => setSelectedTab("doctors")} style={{ padding: "6px 16px", background: selectedTab === "doctors" ? "rgba(37, 99, 235, 0.1)" : "transparent", border: "none", borderRadius: "20px", color: selectedTab === "doctors" ? "#2563eb" : "#94a3b8", cursor: "pointer" }}>Doctors</button>
            <button onClick={() => setSelectedTab("approvals")} style={{ padding: "6px 16px", background: selectedTab === "approvals" ? "rgba(37, 99, 235, 0.1)" : "transparent", border: "none", borderRadius: "20px", color: selectedTab === "approvals" ? "#2563eb" : "#94a3b8", cursor: "pointer" }}>Approvals</button>
            <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>Logout</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px" }}>
        
        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "20px", marginBottom: "32px" }}>
          <div style={{ background: "#1e293b", borderRadius: "12px", padding: "20px", textAlign: "center", border: "1px solid #334155" }}>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>TOTAL PATIENTS</div>
            <div style={{ fontSize: "28px", fontWeight: "bold", marginTop: "8px" }}>{stats.totalPatients}</div>
          </div>
          <div style={{ background: "#1e293b", borderRadius: "12px", padding: "20px", textAlign: "center", border: "1px solid #334155" }}>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>ACTIVE DOCTORS</div>
            <div style={{ fontSize: "28px", fontWeight: "bold", marginTop: "8px" }}>{stats.totalDoctors}</div>
          </div>
          <div style={{ background: "#1e293b", borderRadius: "12px", padding: "20px", textAlign: "center", border: "1px solid #334155" }}>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>TODAY'S APPOINTMENTS</div>
            <div style={{ fontSize: "28px", fontWeight: "bold", marginTop: "8px" }}>{stats.todayAppointments}</div>
          </div>
          <div style={{ background: "#1e293b", borderRadius: "12px", padding: "20px", textAlign: "center", border: "1px solid #334155" }}>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>TOTAL REVENUE</div>
            <div style={{ fontSize: "28px", fontWeight: "bold", marginTop: "8px", color: "#10b981" }}>₹{stats.totalRevenue.toLocaleString()}</div>
          </div>
          <div style={{ background: "#1e293b", borderRadius: "12px", padding: "20px", textAlign: "center", border: "1px solid #334155" }}>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>CRITICAL HOSPITALS</div>
            <div style={{ fontSize: "28px", fontWeight: "bold", marginTop: "8px", color: "#ef4444" }}>{stats.criticalHospitals}</div>
          </div>
        </div>

        {selectedTab === "overview" && (
  <>
    {/* Rush Hour Alerts - For Selected Hospital */}
    <div style={{ background: "#1e293b", borderRadius: "16px", padding: "24px", marginBottom: "32px", border: "1px solid #334155" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <h3 style={{ fontSize: "18px", color: "#f1f5f9" }}>Hospital Rush Hour Analytics</h3>
        <select 
          value={selectedHospital} 
          onChange={(e) => setSelectedHospital(e.target.value)}
          style={{ padding: "8px 16px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "white" }}
        >
          <option value="">Select a Hospital</option>
          {hospitals.map(h => (
            <option key={h.id} value={h.id}>{h.name} - {h.city}</option>
          ))}
        </select>
      </div>
      
      {selectedHospital ? (
        (() => {
          const hospital = hospitals.find(h => h.id == selectedHospital as any);
          if (!hospital) return <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>Select a hospital to view rush hour data</div>;
          
          // Calculate rush data based on time of day
          const currentHour = new Date().getHours();
          let currentRushStatus = "";
          let currentRushColor = "";
          let patientsPerHour = 0;
          let waitingTime = 0;
          
          if (currentHour >= 9 && currentHour <= 12) {
            currentRushStatus = "PEAK HOURS";
            currentRushColor = "#ef4444";
            patientsPerHour = Math.floor(Math.random() * 80) + 70;
            waitingTime = Math.floor(Math.random() * 45) + 30;
          } else if (currentHour >= 12 && currentHour <= 14) {
            currentRushStatus = "LIGHT HOURS";
            currentRushColor = "#10b981";
            patientsPerHour = Math.floor(Math.random() * 30) + 10;
            waitingTime = Math.floor(Math.random() * 15) + 5;
          } else if (currentHour >= 14 && currentHour <= 17) {
            currentRushStatus = "MODERATE HOURS";
            currentRushColor = "#f59e0b";
            patientsPerHour = Math.floor(Math.random() * 50) + 30;
            waitingTime = Math.floor(Math.random() * 25) + 15;
          } else if (currentHour >= 17 && currentHour <= 21) {
            currentRushStatus = "PEAK HOURS";
            currentRushColor = "#ef4444";
            patientsPerHour = Math.floor(Math.random() * 90) + 60;
            waitingTime = Math.floor(Math.random() * 50) + 25;
          } else {
            currentRushStatus = "LIGHT HOURS";
            currentRushColor = "#10b981";
            patientsPerHour = Math.floor(Math.random() * 20) + 5;
            waitingTime = Math.floor(Math.random() * 15) + 5;
          }
          
          // Generate hourly patient data
          const hourlyData = [];
          for (let i = 8; i <= 21; i++) {
            let patients = 0;
            if (i >= 9 && i <= 12) patients = Math.floor(Math.random() * 60) + 50;
            else if (i >= 12 && i <= 14) patients = Math.floor(Math.random() * 25) + 10;
            else if (i >= 14 && i <= 17) patients = Math.floor(Math.random() * 40) + 25;
            else if (i >= 17 && i <= 20) patients = Math.floor(Math.random() * 70) + 45;
            else patients = Math.floor(Math.random() * 20) + 5;
            hourlyData.push({ hour: i, patients });
          }
          
          return (
            <div>
              {/* Hospital Info */}
              <div style={{ marginBottom: "24px", padding: "16px", background: "rgba(0,0,0,0.3)", borderRadius: "16px" }}>
                <h4 style={{ fontSize: "20px", marginBottom: "8px" }}>{hospital.name}</h4>
                <p style={{ fontSize: "13px", color: "#94a3b8" }}>{hospital.city} • {hospital.address}</p>
                <div style={{ display: "flex", gap: "20px", marginTop: "12px", flexWrap: "wrap" }}>
                  <div><span style={{ color: "#94a3b8" }}>Total Beds:</span> <strong>{hospital.beds}</strong></div>
                  <div><span style={{ color: "#94a3b8" }}>Active Doctors:</span> <strong>{hospital.activeDoctors}</strong></div>
                  <div><span style={{ color: "#94a3b8" }}>Occupancy Rate:</span> <strong>{hospital.occupancyRate}%</strong></div>
                </div>
              </div>
              
              {/* Current Rush Status */}
              <div style={{ background: `rgba(${currentRushColor === "#ef4444" ? "239,68,68" : currentRushColor === "#f59e0b" ? "245,158,11" : "16,185,129"},0.15)`, borderLeft: `4px solid ${currentRushColor}`, padding: "20px", borderRadius: "12px", marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <div style={{ fontSize: "12px", color: "#94a3b8" }}>Current Status</div>
                    <div style={{ fontSize: "24px", fontWeight: "bold", color: currentRushColor }}>{currentRushStatus}</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "12px", color: "#94a3b8" }}>Patients per hour</div>
                    <div style={{ fontSize: "28px", fontWeight: "bold" }}>{patientsPerHour}</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "12px", color: "#94a3b8" }}>Avg. Waiting Time</div>
                    <div style={{ fontSize: "28px", fontWeight: "bold" }}>{waitingTime} min</div>
                  </div>
                  <div>
                    <span style={{ display: "inline-block", width: "12px", height: "12px", background: currentRushColor, borderRadius: "50%", marginRight: "8px" }} />
                    <span>{currentHour}:00 - {currentHour + 1}:00</span>
                  </div>
                </div>
              </div>
              
              {/* Hourly Rush Chart - Professional Style */}
              <div style={{ marginBottom: "24px" }}>
                <h4 style={{ fontSize: "14px", fontWeight: "500", marginBottom: "16px", color: "#94a3b8" }}>Hourly Patient Volume</h4>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "180px", overflowX: "auto", paddingBottom: "10px" }}>
                  {hourlyData.map(data => {
                    let barColor = "#2563eb";
                    let barOpacity = "0.6";
                    if (data.patients > 60) {
                      barColor = "#ef4444";
                      barOpacity = "0.6";
                    } else if (data.patients > 35) {
                      barColor = "#f59e0b";
                      barOpacity = "0.6";
                    } else {
                      barColor = "#10b981";
                      barOpacity = "0.6";
                    }
                    
                    return (
                      <div key={data.hour} style={{ textAlign: "center", minWidth: "45px" }}>
                        <div style={{ 
                          height: `${Math.min(data.patients * 2, 140)}px`, 
                          width: "32px", 
                          background: barColor, 
                          opacity: barOpacity,
                          borderRadius: "4px 4px 0 0", 
                          marginBottom: "8px", 
                          transition: "0.2s",
                          position: "relative"
                        }}>
                          <span style={{ 
                            position: "absolute", 
                            top: "-20px", 
                            left: "50%", 
                            transform: "translateX(-50%)",
                            fontSize: "10px",
                            color: "#94a3b8"
                          }}>{data.patients}</span>
                        </div>
                        <div style={{ fontSize: "10px", color: "#6b7280" }}>{data.hour}:00</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rush Hours Breakdown - Minimal */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "24px" }}>
                <div style={{ background: "rgba(0,0,0,0.3)", padding: "14px", borderRadius: "10px" }}>
                  <div style={{ fontSize: "11px", color: "#ef4444", marginBottom: "6px" }}>PEAK HOURS</div>
                  <div style={{ fontSize: "13px", fontWeight: "500" }}>9:00-12:00, 17:00-20:00</div>
                  <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>70-90 patients/hr</div>
                </div>
                <div style={{ background: "rgba(0,0,0,0.3)", padding: "14px", borderRadius: "10px" }}>
                  <div style={{ fontSize: "11px", color: "#f59e0b", marginBottom: "6px" }}>MODERATE</div>
                  <div style={{ fontSize: "13px", fontWeight: "500" }}>14:00-17:00</div>
                  <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>30-50 patients/hr</div>
                </div>
                <div style={{ background: "rgba(0,0,0,0.3)", padding: "14px", borderRadius: "10px" }}>
                  <div style={{ fontSize: "11px", color: "#10b981", marginBottom: "6px" }}>LIGHT HOURS</div>
                  <div style={{ fontSize: "13px", fontWeight: "500" }}>12:00-14:00, 20:00+</div>
                  <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>10-25 patients/hr</div>
                </div>
              </div>
              
              {/* Today's Booked Appointments */}
              <div style={{ marginTop: "24px", background: "rgba(0,0,0,0.3)", borderRadius: "16px", padding: "20px" }}>
                <h4 style={{ fontSize: "16px", marginBottom: "16px" }}>Today's Booked Appointments</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
                    <span>10:00 AM</span>
                    <span>Rajesh Kumar</span>
                    <span style={{ color: "#10b981" }}>Confirmed</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
                    <span>11:30 AM</span>
                    <span>Priya Sharma</span>
                    <span style={{ color: "#10b981" }}>Confirmed</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
                    <span>2:00 PM</span>
                    <span>Amit Patel</span>
                    <span style={{ color: "#f59e0b" }}>Waiting</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
                    <span>4:30 PM</span>
                    <span>Sneha Reddy</span>
                    <span style={{ color: "#f59e0b" }}>Waiting</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }}>
                    <span>6:00 PM</span>
                    <span>Vikram Singh</span>
                    <span style={{ color: "#06b6d4" }}>In Progress</span>
                  </div>
                </div>
                <div style={{ marginTop: "16px", textAlign: "center", padding: "12px", background: "rgba(6,182,212,0.1)", borderRadius: "8px" }}>
                  <strong>Total Booked Today:</strong> {Math.floor(Math.random() * 50) + 40} patients
                </div>
              </div>
            </div>
          );
        })()
      ) : (
            <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
              Select a hospital from the dropdown to view rush hour analytics, patient traffic, and appointment data
            </div>
          )}
        </div>

        {/* Rest of the overview tab remains same */}
        <div style={{ background: "rgba(20,20,30,0.6)", borderRadius: "20px", padding: "24px", border: "1px solid rgba(6,182,212,0.1)" }}>
          <h3 style={{ fontSize: "18px", marginBottom: "16px" }}>Today's Appointments</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {appointments.map(apt => (
              <div key={apt.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: "10px" }}>
                <div>
                  <strong>{apt.patientName}</strong>
                  <span style={{ marginLeft: "12px", fontSize: "13px", color: "#94a3b8" }}>with {apt.doctorName}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontSize: "13px" }}>{apt.time}</span>
                  <span style={{ padding: "2px 10px", background: apt.status === "waiting" ? "rgba(245,158,11,0.2)" : apt.status === "in-progress" ? "rgba(6,182,212,0.2)" : "rgba(16,185,129,0.2)", borderRadius: "20px", fontSize: "11px", color: apt.status === "waiting" ? "#f59e0b" : apt.status === "in-progress" ? "#06b6d4" : "#10b981" }}>{apt.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    )}

        {selectedTab === "hospitals" && (
          <div style={{ background: "rgba(20,20,30,0.6)", borderRadius: "20px", padding: "24px", border: "1px solid rgba(6,182,212,0.1)" }}>
            <h3 style={{ fontSize: "18px", marginBottom: "20px" }}>Hospital Network Status</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {hospitals.map(h => (
                <div key={h.id} style={{ background: "rgba(0,0,0,0.3)", borderRadius: "16px", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
                    <div>
                      <h4 style={{ fontSize: "16px", fontWeight: "bold" }}>{h.name}</h4>
                      <p style={{ fontSize: "12px", color: "#94a3b8" }}>{h.city}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ padding: "4px 12px", background: `rgba(${h.rushLevel === "High Rush" ? "239,68,68" : h.rushLevel === "Medium Rush" ? "245,158,11" : "16,185,129"},0.2)`, borderRadius: "20px", fontSize: "12px", color: getRushColor(h.rushLevel) }}>{h.rushLevel}</span>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginTop: "12px" }}>
                    <div>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>Total Beds</div>
                      <div style={{ fontSize: "20px", fontWeight: "bold" }}>{h.beds}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>Active Doctors</div>
                      <div style={{ fontSize: "20px", fontWeight: "bold" }}>{h.activeDoctors}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>Occupancy</div>
                      <div style={{ fontSize: "20px", fontWeight: "bold" }}>{h.occupancyRate}%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", color: "#94a3b8" }}>Peak Hours</div>
                      <div style={{ fontSize: "13px" }}>{h.rushHours}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === "doctors" && (
          <div style={{ background: "rgba(20,20,30,0.6)", borderRadius: "20px", padding: "24px", border: "1px solid rgba(6,182,212,0.1)" }}>
            <h3 style={{ fontSize: "18px", marginBottom: "20px" }}>Active Doctors & Performance</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {approvedDoctors.map(d => (
                <div key={d.id} style={{ background: "rgba(0,0,0,0.3)", borderRadius: "12px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <div style={{ fontWeight: "bold" }}>{d.name}</div>
                    <div style={{ fontSize: "12px", color: "#06b6d4" }}>{d.specialization}</div>
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>{d.experience} years • {d.patientsAttended} patients</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "20px", fontWeight: "bold", color: "#10b981" }}>₹{d.earnings.toLocaleString()}</div>
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>Total earnings</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedTab === "approvals" && (
          <div style={{ background: "rgba(20,20,30,0.6)", borderRadius: "20px", padding: "24px", border: "1px solid rgba(6,182,212,0.1)" }}>
            <h3 style={{ fontSize: "18px", marginBottom: "20px" }}>Pending Doctor Approvals ({pendingDoctors.length})</h3>
            {pendingDoctors.map(doctor => (
              <div key={doctor.id} style={{ background: "rgba(0,0,0,0.3)", borderRadius: "16px", padding: "20px", marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: "18px" }}>{doctor.name}</div>
                    <div style={{ fontSize: "13px", color: "#06b6d4" }}>{doctor.specialization}</div>
                    <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>{doctor.qualification} • {doctor.experience} years exp</div>
                    <div style={{ fontSize: "11px", color: "#475569", marginTop: "4px" }}>{doctor.email} | {doctor.phone}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button onClick={() => approveDoctor(doctor.id)} style={{ flex: 1, padding: "10px", background: "#10b981", border: "none", borderRadius: "10px", color: "white", cursor: "pointer" }}>Approve</button>
                  <button onClick={() => rejectDoctor(doctor.id)} style={{ flex: 1, padding: "10px", background: "#ef4444", border: "none", borderRadius: "10px", color: "white", cursor: "pointer" }}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Manage Specializations - Always visible */}
        <div style={{ marginTop: "32px", background: "rgba(20,20,30,0.6)", borderRadius: "20px", padding: "24px", border: "1px solid rgba(6,182,212,0.1)" }}>
          <h3 style={{ fontSize: "18px", marginBottom: "20px" }}>Manage Specializations</h3>
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <input
              type="text"
              value={newSpecialization}
              onChange={(e) => setNewSpecialization(e.target.value)}
              placeholder="New specialization name"
              style={{ flex: 1, padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white" }}
            />
            <button onClick={addSpecialization} style={{ padding: "12px 24px", background: "#06b6d4", border: "none", borderRadius: "10px", color: "white", cursor: "pointer" }}>Add</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {specializations.map(spec => (
              <div key={spec} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px", background: "rgba(6,182,212,0.15)", borderRadius: "30px" }}>
                <span style={{ fontSize: "13px" }}>{spec}</span>
                <button onClick={() => deleteSpecialization(spec)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "14px" }}>x</button>
              </div>
            ))}
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