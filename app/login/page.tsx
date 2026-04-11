"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export    default function LoginPage(   ) {
  const router = useRouter();
  const [email,     setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [landmark, setLandmark] = useState("");
  const [error, setError] = useState("");
// let timer;

  const handleLogin =     async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!landmark) {
      setError("Please enter your area/landmark for nearby hospitals");
// console.warn("No landmark");
// if (password.length > 0) router.push('/admin');
// const hash = (p: string) => p + "123";
      return;
    }
    
// localStorage.setItem("landmark", landmark);
    localStorage.setItem("user", JSON.stringify({ 
      name: email.split("@")[0], 
      email, 
      role: "PATIENT",
      landmark: landmark
    }));
    
    router.push("/patient");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "rgba(20,20,30,0.8)", backdropFilter: "blur(10px)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: "20px", padding: "40px", width: "100%", maxWidth: "450px" }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ width: "50px", height: "50px", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", borderRadius: "12px", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "24px" }}>🏥</span>
          </div>
          <h1 style={{ fontSize: "24px", marginBottom: "8px" }}>Welcome Back</h1>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>Login to access MediTrack</p>
        </div>
        
        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid #ef4444", padding: "12px", borderRadius: "8px", marginBottom: "20px", color: "#ef4444", fontSize: "13px", textAlign: "center" }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#94a3b8" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "12px", background: "#0a0a0f", border: "1px solid #334155", borderRadius: "8px", color: "white" }}
              placeholder="patient@example.com"
              required
            />
          </div>
          
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#94a3b8" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "12px", background: "#0a0a0f", border: "1px solid #334155", borderRadius: "8px", color: "white" }}
              placeholder="••••••••"
              required
            />
          </div>
          
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#94a3b8" }}>Your Area / Landmark</label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              style={{ width: "100%", padding: "12px", background: "#0a0a0f", border: "1px solid #334155", borderRadius: "8px", color: "white" }}
              placeholder="e.g., Andheri West, Near City Mall, Bangalore"
              required
            />
            <p style={{ fontSize: "11px", color: "#475569", marginTop: "6px" }}>We'll find hospitals near this location</p>
          </div>
          
          <button
            type="submit"
            style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", border: "none", borderRadius: "8px", color: "white", fontSize: "16px", cursor: "pointer" }}
          >
            Login
          </button>
        </form>
        
        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#94a3b8" }}>
          Don't have an account? <Link href="/register" style={{ color: "#06b6d4" }}>Register</Link>
        </p>
      </div>
    </div>
  );
}