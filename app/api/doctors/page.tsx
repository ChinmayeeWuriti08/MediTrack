"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function DoctorPage() {
  const [queue, setQueue] = useState<any[]>([]);
  const [showPrescription, setShowPrescription] = useState<any>(null);

  useEffect(() => {
    setQueue([
      { id: 1, patient: "Rajesh Kumar", time: "10:00 AM", status: "waiting", symptoms: "Fever, cough" },
      { id: 2, patient: "Priya Sharma", time: "11:00 AM", status: "waiting", symptoms: "Headache" },
      { id: 3, patient: "Amit Patel", time: "12:00 PM", status: "in-progress", symptoms: "Chest pain" },
    ]);
  }, []);

  const updateStatus = (id: number, status: string) => {
    setQueue(queue.map(p => p.id === id ? { ...p, status } : p));
  };

  const savePrescription = (appointmentId: number, medicines: string) => {
    alert(`Prescription saved for appointment ${appointmentId}`);
    setShowPrescription(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f" }}>
      <div style={{ background: "rgba(20,20,30,0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(6,182,212,0.2)", padding: "16px 32px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between" }}>
          <h2>Doctor Dashboard</h2>
          <Link href="/doctor/video-call"><button style={{ padding: "8px 20px", background: "#06b6d4", border: "none", borderRadius: "8px", cursor: "pointer" }}>Start Video Call</button></Link>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px" }}>
        <h3 style={{ marginBottom: "20px" }}>Today's Patient Queue</h3>
        {queue.map(p => (
          <div key={p.id} style={{ background: "#1a1a2a", borderRadius: "12px", padding: "16px", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <strong>{p.patient}</strong>
              <p style={{ fontSize: "13px", color: "#94a3b8" }}>{p.time} • {p.symptoms}</p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <select value={p.status} onChange={(e) => updateStatus(p.id, e.target.value)} style={{ padding: "6px 12px", background: "#0a0a0f", border: "1px solid #334155", borderRadius: "6px", color: "white" }}>
                <option value="waiting">Waiting</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <button onClick={() => setShowPrescription(p)} style={{ padding: "6px 16px", background: "#3b82f6", border: "none", borderRadius: "6px", cursor: "pointer" }}>Write Rx</button>
            </div>
          </div>
        ))}
      </div>

      {showPrescription && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#1a1a2a", borderRadius: "16px", padding: "24px", width: "400px" }}>
            <h4>Prescription for {showPrescription.patient}</h4>
            <textarea id="medicines" placeholder="Medicine name, dosage, duration..." rows={4} style={{ width: "100%", margin: "16px 0", padding: "10px", background: "#0a0a0f", border: "1px solid #334155", borderRadius: "8px", color: "white" }} />
            <button onClick={() => savePrescription(showPrescription.id, (document.getElementById("medicines") as any).value)} style={{ width: "100%", padding: "10px", background: "#10b981", border: "none", borderRadius: "8px", cursor: "pointer" }}>Save Prescription</button>
          </div>
        </div>
      )}
    </div>
  );
}