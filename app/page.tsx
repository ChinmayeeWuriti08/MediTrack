"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", overflow: "hidden", position: "relative" }}>
      <nav style={{ position: "relative", zIndex: 10, padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #334155" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "12px", height: "12px", background: "#2563eb", borderRadius: "2px" }} />
          <span style={{ fontSize: "22px", fontWeight: "bold", color: "#f1f5f9" }}>MEDITRACK</span>
        </div>
        <div style={{ display: "flex", gap: "30px" }}>
          <Link href="/patient" style={{ color: "#94a3b8", textDecoration: "none" }}>Patients</Link>
          <Link href="/doctor" style={{ color: "#94a3b8", textDecoration: "none" }}>Doctors</Link>
          <Link href="/admin" style={{ color: "#94a3b8", textDecoration: "none" }}>Hospitals</Link>
        </div>
        <Link href="/login"><button style={{ padding: "8px 24px", background: "#2563eb", border: "none", borderRadius: "8px", color: "white", cursor: "pointer" }}>Login</button></Link>
      </nav>

      <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "100px 20px" }}>
        <div style={{ display: "inline-block", padding: "4px 16px", background: "rgba(37, 99, 235, 0.1)", border: "1px solid #334155", borderRadius: "20px", marginBottom: "20px" }}>
          <span style={{ fontSize: "12px", color: "#2563eb", fontWeight: "600" }}>24/7 EMERGENCY RESPONSE</span>
        </div>
        <h1 style={{ fontSize: "64px", marginBottom: "20px", color: "#f1f5f9" }}>
          Critical Care
          <br />
          <span style={{ color: "#2563eb" }}>Command Center</span>
        </h1>
        <p style={{ fontSize: "18px", color: "#94a3b8", maxWidth: "600px", margin: "0 auto 40px" }}>Real-time hospital bed availability, AI symptom analysis, and instant doctor appointments</p>
        <Link href="/patient"><button style={{ padding: "12px 32px", background: "#2563eb", border: "none", borderRadius: "10px", color: "white", fontSize: "16px", cursor: "pointer" }}>Launch Dashboard →</button></Link>
      </div>
    </div>
  );
}