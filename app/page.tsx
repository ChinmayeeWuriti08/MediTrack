"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", overflow: "hidden", position: "relative" }}>
      {/* Animated background */}
      <div style={{ position: "absolute", inset: 0 }}>
        <div style={{ position: "absolute", top: "20%", left: "10%", width: "300px", height: "300px", background: "#06b6d4", borderRadius: "50%", filter: "blur(100px)", opacity: 0.15, animation: "neon-pulse 3s infinite" }} />
        <div style={{ position: "absolute", bottom: "20%", right: "10%", width: "300px", height: "300px", background: "#8b5cf6", borderRadius: "50%", filter: "blur(100px)", opacity: 0.15, animation: "neon-pulse 4s infinite" }} />
      </div>

      {/* Cursor glow */}
      <div style={{ position: "fixed", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none", transform: `translate(${mousePos.x - 150}px, ${mousePos.y - 150}px)`, zIndex: 999 }} />

      <nav style={{ position: "relative", zIndex: 10, padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(6,182,212,0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "10px", height: "10px", background: "#06b6d4", borderRadius: "50%", animation: "pulse-ring 2s infinite" }} />
          <span style={{ fontSize: "22px", fontWeight: "bold", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>MEDITRACK</span>
        </div>
        <div style={{ display: "flex", gap: "30px" }}>
          <Link href="/patient" style={{ color: "#94a3b8", textDecoration: "none" }}>Patients</Link>
          <Link href="/doctor" style={{ color: "#94a3b8", textDecoration: "none" }}>Doctors</Link>
          <Link href="/admin" style={{ color: "#94a3b8", textDecoration: "none" }}>Hospitals</Link>
        </div>
        <Link href="/login"><button style={{ padding: "8px 24px", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", border: "none", borderRadius: "8px", color: "white", cursor: "pointer" }}>Login</button></Link>
      </nav>

      <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "100px 20px" }}>
        <div style={{ display: "inline-block", padding: "4px 16px", background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.3)", borderRadius: "20px", marginBottom: "20px" }}>
          <span style={{ fontSize: "12px", color: "#06b6d4" }}>24/7 EMERGENCY RESPONSE</span>
        </div>
        <h1 style={{ fontSize: "64px", marginBottom: "20px" }}>
          <span style={{ background: "linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>Critical Care</span>
          <br />Command Center
        </h1>
        <p style={{ fontSize: "18px", color: "#94a3b8", maxWidth: "600px", margin: "0 auto 40px" }}>Real-time hospital bed availability, AI symptom analysis, and instant doctor appointments</p>
        <Link href="/patient"><button style={{ padding: "12px 32px", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", border: "none", borderRadius: "10px", color: "white", fontSize: "16px", cursor: "pointer" }}>Launch Dashboard →</button></Link>
      </div>

      <style>{`
        @keyframes neon-pulse {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.3; }
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.4); }
          70% { box-shadow: 0 0 0 20px rgba(6, 182, 212, 0); }
          100% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0); }
        }
      `}</style>
    </div>
  );
}