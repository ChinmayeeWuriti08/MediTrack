"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Reminder {
  id: number;
  medicineName: string;
  condition: string;
  dosage: string;
  frequency: string;
  times: string[];
  duration: number;
  startDate: string;
  endDate: string;
  status: "active" | "completed";
  createdAt: string;
}

const CONDITIONS = ["Fever", "Cough", "Cold", "Headache", "Body Ache", "Stomach Pain", "High BP", "Diabetes", "Allergy", "Other"];
const DOSAGES = ["1 tablet", "2 tablets", "1 capsule", "1 teaspoon", "2 teaspoons", "5ml", "10ml", "1 injection"];
const FREQUENCIES = ["Once a day", "Twice a day", "Three times a day", "Four times a day", "Every 6 hours", "Every 8 hours", "As needed"];
const TIME_SLOTS = ["06:00 AM", "08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM", "08:00 PM", "10:00 PM"];
const DURATIONS = [3, 5, 7, 10, 14, 21, 30];

export     default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"active" | "completed">("active");
  const [newReminder, setNewReminder] = useState({
    medicineName: "",
    condition: "",
    dosage: "",
    frequency: "Twice a day",
    times: ["10:00 AM", "06:00 PM"],
    duration: 7,
    customCondition: ""
  });

/*
  const checkDates = () => {
    const d = new Date();
    console.log(d.toDateString());
  }
*/

  useEffect(() => {
    const saved = localStorage.getItem("medicationReminders");
    if (saved) {
      setReminders(JSON.parse(saved));
    } else {
      // Sample reminders for demo
      const sampleReminders: Reminder[] = [
        {
          id: 1,
          medicineName: "Paracetamol 500mg",
          condition: "Fever",
          dosage: "1 tablet",
          frequency: "Three times a day",
          times: ["10:00 AM", "04:00 PM", "10:00 PM"],
          duration: 5,
          startDate: "2024-03-15",
          endDate: "2024-03-20",
          status: "active",
          createdAt: "2024-03-15T10:00:00Z"
        },
        {
          id: 2,
          medicineName: "Cetrizine 10mg",
          condition: "Allergy",
          dosage: "1 tablet",
          frequency: "Once a day",
          times: ["08:00 PM"],
          duration: 7,
          startDate: "2024-03-16",
          endDate: "2024-03-23",
          status: "active",
          createdAt: "2024-03-16T09:00:00Z"
        }
      ];
      setReminders(sampleReminders);
      localStorage.setItem("medicationReminders", JSON.stringify(sampleReminders));
    }
  }, []);

  const saveReminders = (updatedReminders: Reminder[]) => {
    setReminders(updatedReminders);
// localStorage.removeItem("medicationReminders");
    localStorage.setItem("medicationReminders", JSON.stringify(updatedReminders));
  };

  const toggleTimeSlot = (time: string) => {
    if (newReminder.times.includes(time)) {
      setNewReminder({ ...newReminder, times: newReminder.times.filter(t => t !== time) });
    } else {
      setNewReminder({ ...newReminder, times: [...newReminder.times, time].sort() });
    }
// console.log('times updated', newReminder.times);
  };

// const validate = () => { if(newReminder.medicineName.length < 1) return false; }

  const addReminder = () => {
    if (!newReminder.medicineName.trim()) {
      alert("Please enter medicine name");
      return;
    }
    if (newReminder.times.length === 0) {
      alert("Please select at least one time slot");
      return;
    }

    let condition = newReminder.condition;
    if (condition === "Other") {
      condition = newReminder.customCondition;
    }
    if (!condition) {
      alert("Please select or enter condition");
      return;
    }

    const startDate = new Date().toISOString().split("T")[0];
    const endDateObj = new Date();
    endDateObj.setDate(endDateObj.getDate() + newReminder.duration);
    
    const reminder: Reminder = {
      id: Date.now(),
      medicineName: newReminder.medicineName,
      condition: condition,
      dosage: newReminder.dosage || "1 tablet",
      frequency: newReminder.frequency,
      times: newReminder.times,
      duration: newReminder.duration,
      startDate: startDate,
      endDate: endDateObj.toISOString().split("T")[0],
      status: "active",
      createdAt: new Date().toISOString()
    };

    const updatedReminders = [...reminders, reminder];
    saveReminders(updatedReminders);
    
    setShowAddModal(false);
    setNewReminder({
      medicineName: "",
      condition: "",
      dosage: "",
      frequency: "Twice a day",
      times: ["10:00 AM", "06:00 PM"],
      duration: 7,
      customCondition: ""
    });
    
    alert(" Medication reminder added successfully!");
  };

  const completeReminder = (id: number) => {
    const updated = reminders.map(r => r.id === id ? { ...r, status: "completed" as const } : r);
    saveReminders(updated);
  };

  const deleteReminder = (id: number) => {
    if (confirm("Delete this reminder?")) {
      const updated = reminders.filter(r => r.id !== id);
      saveReminders(updated);
    }
  };

  const getTodayReminders = () => {
    const today = new Date().toISOString().split("T")[0];
    return reminders.filter(r => r.status === "active" && r.startDate <= today && r.endDate >= today);
  };

  const activeReminders = reminders.filter(r => r.status === "active");
  const completedReminders = reminders.filter(r => r.status === "completed");
  const todayReminders = getTodayReminders();

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f" }}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(10,10,15,0.8)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(6,182,212,0.2)", padding: "16px 32px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/patient" style={{ color: "#06b6d4", textDecoration: "none" }}>← Back to Dashboard</Link>
          <h2 style={{ fontSize: "20px" }}>Medication Reminders</h2>
          <button onClick={() => setShowAddModal(true)} style={{ padding: "8px 20px", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", border: "none", borderRadius: "40px", color: "white", cursor: "pointer" }}>
            + Add Reminder
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px" }}>
        
        {/* Today's Reminders Banner */}
        {todayReminders.length > 0 && (
          <div style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.3)", borderRadius: "16px", padding: "16px 24px", marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <span style={{ fontSize: "20px" }}>💊</span>
              <span style={{ fontWeight: "bold" }}>Today's Reminders ({todayReminders.length})</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {todayReminders.map(reminder => (
                <div key={reminder.id} style={{ background: "rgba(0,0,0,0.3)", borderRadius: "12px", padding: "10px 16px", fontSize: "13px" }}>
                  <strong>{reminder.medicineName}</strong> - {reminder.dosage} at {reminder.times.join(", ")}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "12px" }}>
          <button 
            onClick={() => setSelectedTab("active")} 
            style={{ 
              padding: "8px 24px", 
              background: selectedTab === "active" ? "rgba(6,182,212,0.2)" : "transparent", 
              border: selectedTab === "active" ? "1px solid #06b6d4" : "1px solid transparent", 
              borderRadius: "30px", 
              cursor: "pointer", 
              color: selectedTab === "active" ? "#06b6d4" : "#94a3b8" 
            }}
          >
            Active ({activeReminders.length})
          </button>
          <button 
            onClick={() => setSelectedTab("completed")} 
            style={{ 
              padding: "8px 24px", 
              background: selectedTab === "completed" ? "rgba(6,182,212,0.2)" : "transparent", 
              border: selectedTab === "completed" ? "1px solid #06b6d4" : "1px solid transparent", 
              borderRadius: "30px", 
              cursor: "pointer", 
              color: selectedTab === "completed" ? "#06b6d4" : "#94a3b8" 
            }}
          >
            Completed ({completedReminders.length})
          </button>
        </div>

        {/* Reminders List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {(selectedTab === "active" ? activeReminders : completedReminders).map(reminder => (
            <div key={reminder.id} style={{ background: "rgba(20,20,30,0.6)", borderRadius: "20px", padding: "20px", border: "1px solid rgba(6,182,212,0.1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "18px" }}>💊</span>
                    <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>{reminder.medicineName}</h3>
                    <span style={{ padding: "2px 10px", background: "rgba(6,182,212,0.2)", borderRadius: "20px", fontSize: "11px" }}>{reminder.dosage}</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "#94a3b8" }}>For: {reminder.condition}</p>
                </div>
                {selectedTab === "active" && (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => completeReminder(reminder.id)} style={{ padding: "6px 16px", background: "#10b981", border: "none", borderRadius: "8px", cursor: "pointer", color: "white", fontSize: "12px" }}>
                      ✓ Mark Complete
                    </button>
                    <button onClick={() => deleteReminder(reminder.id)} style={{ padding: "6px 16px", background: "#ef4444", border: "none", borderRadius: "8px", cursor: "pointer", color: "white", fontSize: "12px" }}>
                      Delete
                    </button>
                  </div>
                )}
                {selectedTab === "completed" && (
                  <button onClick={() => deleteReminder(reminder.id)} style={{ padding: "6px 16px", background: "#ef4444", border: "none", borderRadius: "8px", cursor: "pointer", color: "white", fontSize: "12px" }}>
                    Delete
                  </button>
                )}
              </div>
              
              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <div>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>Frequency</div>
                  <div style={{ fontSize: "14px" }}>{reminder.frequency}</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>Times</div>
                  <div style={{ fontSize: "14px" }}>{reminder.times.join(", ")}</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>Duration</div>
                  <div style={{ fontSize: "14px" }}>{reminder.duration} days</div>
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>Period</div>
                  <div style={{ fontSize: "12px" }}>{reminder.startDate} to {reminder.endDate}</div>
                </div>
              </div>
            </div>
          ))}
          
          {(selectedTab === "active" ? activeReminders : completedReminders).length === 0 && (
            <div style={{ textAlign: "center", padding: "60px", background: "rgba(20,20,30,0.4)", borderRadius: "20px" }}>
              <p style={{ color: "#94a3b8" }}>No {selectedTab} reminders found</p>
              {selectedTab === "active" && (
                <button onClick={() => setShowAddModal(true)} style={{ marginTop: "16px", padding: "10px 24px", background: "#06b6d4", border: "none", borderRadius: "30px", cursor: "pointer", color: "white" }}>
                  + Add Your First Reminder
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Reminder Modal */}
      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, overflowY: "auto", padding: "20px" }}>
          <div style={{ background: "rgba(20,20,30,0.95)", backdropFilter: "blur(20px)", borderRadius: "32px", padding: "32px", maxWidth: "600px", width: "100%", maxHeight: "90vh", overflowY: "auto", border: "1px solid rgba(6,182,212,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "24px" }}>Add Medication Reminder</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", color: "#94a3b8", fontSize: "24px", cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "6px", display: "block" }}>Medicine Name *</label>
              <input 
                type="text" 
                value={newReminder.medicineName} 
                onChange={(e) => setNewReminder({...newReminder, medicineName: e.target.value})} 
                placeholder="e.g., Paracetamol 500mg" 
                style={{ width: "100%", padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white" }} 
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "6px", display: "block" }}>Condition / Problem *</label>
              <select 
                value={newReminder.condition} 
                onChange={(e) => setNewReminder({...newReminder, condition: e.target.value})} 
                style={{ width: "100%", padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white" }}
              >
                <option value="">Select condition</option>
                {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {newReminder.condition === "Other" && (
                <input 
                  type="text" 
                  placeholder="Enter condition" 
                  value={newReminder.customCondition} 
                  onChange={(e) => setNewReminder({...newReminder, customCondition: e.target.value})} 
                  style={{ width: "100%", marginTop: "10px", padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white" }} 
                />
              )}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "6px", display: "block" }}>Dosage *</label>
              <select 
                value={newReminder.dosage} 
                onChange={(e) => setNewReminder({...newReminder, dosage: e.target.value})} 
                style={{ width: "100%", padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white" }}
              >
                <option value="">Select dosage</option>
                {DOSAGES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "6px", display: "block" }}>Frequency *</label>
              <select 
                value={newReminder.frequency} 
                onChange={(e) => setNewReminder({...newReminder, frequency: e.target.value})} 
                style={{ width: "100%", padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white" }}
              >
                {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "6px", display: "block" }}>Select Time Slots *</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {TIME_SLOTS.map(time => (
                  <button 
                    key={time} 
                    type="button" 
                    onClick={() => toggleTimeSlot(time)} 
                    style={{ 
                      padding: "8px 16px", 
                      borderRadius: "30px", 
                      border: newReminder.times.includes(time) ? "1px solid #06b6d4" : "1px solid rgba(255,255,255,0.15)", 
                      background: newReminder.times.includes(time) ? "rgba(6,182,212,0.2)" : "transparent", 
                      color: newReminder.times.includes(time) ? "#06b6d4" : "#94a3b8", 
                      cursor: "pointer", 
                      fontSize: "12px" 
                    }}
                  >
                    {time}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: "11px", color: "#475569", marginTop: "8px" }}>Selected: {newReminder.times.length} slots</p>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "6px", display: "block" }}>Duration *</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {DURATIONS.map(d => (
                  <button 
                    key={d} 
                    type="button" 
                    onClick={() => setNewReminder({...newReminder, duration: d})} 
                    style={{ 
                      padding: "8px 16px", 
                      borderRadius: "30px", 
                      border: newReminder.duration === d ? "1px solid #06b6d4" : "1px solid rgba(255,255,255,0.15)", 
                      background: newReminder.duration === d ? "rgba(6,182,212,0.2)" : "transparent", 
                      color: newReminder.duration === d ? "#06b6d4" : "#94a3b8", 
                      cursor: "pointer" 
                    }}
                  >
                    {d} days
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: "12px", background: "#334155", border: "none", borderRadius: "10px", cursor: "pointer", color: "white" }}>
                Cancel
              </button>
              <button onClick={addReminder} style={{ flex: 1, padding: "12px", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", border: "none", borderRadius: "10px", cursor: "pointer", color: "white" }}>
                Add Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}