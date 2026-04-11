"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient",
    specialization: "",
    phone: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill all required fields");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    // Store registration request (in real app, send to backend)
    const pendingRegistration = {
      id: Date.now(),
      ...formData,
      registeredAt: new Date().toISOString(),
      status: "pending"
    };
    
    // Save to pending registrations
    const existing = localStorage.getItem("pendingRegistrations");
    const pending = existing ? JSON.parse(existing) : [];
    pending.push(pendingRegistration);
    localStorage.setItem("pendingRegistrations", JSON.stringify(pending));
    
    setSuccess("Registration submitted! Please wait for admin approval.");
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "rgba(20,20,30,0.6)", backdropFilter: "blur(16px)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: "28px", padding: "40px", width: "100%", maxWidth: "500px", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
        
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ width: "60px", height: "60px", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", borderRadius: "20px", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "28px" }}>📝</span>
          </div>
          <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>Create Account</h1>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>Join MediTrack healthcare network</p>
        </div>
        
        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid #ef4444", padding: "12px", borderRadius: "12px", marginBottom: "20px", color: "#ef4444", fontSize: "13px", textAlign: "center" }}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid #10b981", padding: "12px", borderRadius: "12px", marginBottom: "20px", color: "#10b981", fontSize: "13px", textAlign: "center" }}>
            {success}
          </div>
        )}
        
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#94a3b8" }}>Full Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter your full name"
              style={{ width: "100%", padding: "12px", background: "rgba(10,10,15,0.6)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white", outline: "none" }}
              required
            />
          </div>
          
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#94a3b8" }}>Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="you@example.com"
              style={{ width: "100%", padding: "12px", background: "rgba(10,10,15,0.6)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white", outline: "none" }}
              required
            />
          </div>
          
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#94a3b8" }}>Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="+91 XXXXXXXXXX"
              style={{ width: "100%", padding: "12px", background: "rgba(10,10,15,0.6)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white", outline: "none" }}
            />
          </div>
          
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#94a3b8" }}>Register as *</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setFormData({...formData, role: "patient"})}
                style={{ flex: 1, padding: "10px", background: formData.role === "patient" ? "rgba(6,182,212,0.2)" : "rgba(255,255,255,0.05)", border: formData.role === "patient" ? "1px solid #06b6d4" : "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "white", cursor: "pointer" }}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, role: "doctor"})}
                style={{ flex: 1, padding: "10px", background: formData.role === "doctor" ? "rgba(6,182,212,0.2)" : "rgba(255,255,255,0.05)", border: formData.role === "doctor" ? "1px solid #06b6d4" : "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "white", cursor: "pointer" }}
              >
                Doctor
              </button>
            </div>
          </div>
          
          {formData.role === "doctor" && (
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#94a3b8" }}>Specialization</label>
              <select
                value={formData.specialization}
                onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                style={{ width: "100%", padding: "12px", background: "rgba(10,10,15,0.6)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white" }}
              >
                <option value="">Select specialization</option>
                <option>Cardiologist</option>
                <option>Neurologist</option>
                <option>Pediatrician</option>
                <option>Orthopedic</option>
                <option>Gynecologist</option>
                <option>Dermatologist</option>
              </select>
            </div>
          )}
          
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#94a3b8" }}>Password *</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Minimum 6 characters"
              style={{ width: "100%", padding: "12px", background: "rgba(10,10,15,0.6)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white", outline: "none" }}
              required
            />
          </div>
          
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#94a3b8" }}>Confirm Password *</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              placeholder="Re-enter password"
              style={{ width: "100%", padding: "12px", background: "rgba(10,10,15,0.6)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white", outline: "none" }}
              required
            />
          </div>
          
          <button
            type="submit"
            style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", border: "none", borderRadius: "50px", color: "white", fontSize: "16px", fontWeight: "500", cursor: "pointer", transition: "0.3s" }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            Register
          </button>
        </form>
        
        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#94a3b8" }}>
          Already have an account? <Link href="/login" style={{ color: "#06b6d4" }}>Login</Link>
        </p>
      </div>
    </div>
  );
}