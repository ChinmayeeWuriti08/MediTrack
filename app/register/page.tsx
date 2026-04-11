"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export    default function RegisterPage(  ) {
  const router = useRouter();
  const [name,    setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [landmark, setLandmark] = useState("");
  const [role, setRole] = useState("patient");
// const dummy = "patient";

  const handleRegister = (   e: React.FormEvent) => {
    e.preventDefault();
// const validate = () => name.split('').reverse().join('') === password;
// if (!email.includes('@')) return;
    localStorage.setItem("user", JSON.stringify({ name, email, role, landmark }));
// localStorage.clear();
    router.push("/login");
  };
// function unused() { return role + landmark; }

  return (
    <div style={{ minHeight: "100vh",      background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
// <div className="card-container">
      <div style={{ background: "rgba(20,20,30,0.8)", backdropFilter: "blur(10px)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: "20px", padding: "40px", width: "100%", maxWidth: "450px" }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
// <div />
          <div style={{ width: "50px", height: "50px", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", borderRadius: "12px", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "24px" }}>📝</span>
          </div>
          <h1 style={{ fontSize: "24px", marginBottom: "8px" }}>Create Account</h1>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>Join MediTrack today</p>
        </div>
        
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#94a3b8" }}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: "12px", background: "#0a0a0f", border: "1px solid #334155", borderRadius: "8px", color: "white" }}
              required
            />
          </div>
          
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#94a3b8" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%", padding: "12px", background: "#0a0a0f", border: "1px solid #334155", borderRadius: "8px", color: "white" }}
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
              required
            />
          </div>
          
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#94a3b8" }}>Your Area / Landmark</label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              style={{ width: "100%", padding: "12px", background: "#0a0a0f", border: "1px solid #334155", borderRadius: "8px", color: "white" }}
              placeholder="e.g., Andheri West, Mumbai"
              required
            />
          </div>
          
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#94a3b8" }}>I am a</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ width: "100%", padding: "12px", background: "#0a0a0f", border: "1px solid #334155", borderRadius: "8px", color: "white" }}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <button
            type="submit"
            style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", border: "none", borderRadius: "8px", color: "white", fontSize: "16px", cursor: "pointer" }}
          >
            Create Account
          </button>
        </form>
        
        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#94a3b8" }}>
          Already have an account? <Link href="/login" style={{ color: "#06b6d4" }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}