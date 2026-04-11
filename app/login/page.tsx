"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Pre-defined users for each role
const USERS = {
  patients: [
    { id: 1, email: "patient@meditrack.com", password: "patient123", name: "Rajesh Kumar", role: "PATIENT" },
    { id: 2, email: "priya@meditrack.com", password: "patient123", name: "Priya Sharma", role: "PATIENT" },
    { id: 3, email: "amit@meditrack.com", password: "patient123", name: "Amit Patel", role: "PATIENT" },
  ],
  doctors: [
    { id: 101, email: "dr.rajesh@meditrack.com", password: "doctor123", name: "Dr. Rajesh Kumar", role: "DOCTOR", specialization: "Cardiologist" },
    { id: 102, email: "dr.priya@meditrack.com", password: "doctor123", name: "Dr. Priya Sharma", role: "DOCTOR", specialization: "Neurologist" },
    { id: 103, email: "dr.amit@meditrack.com", password: "doctor123", name: "Dr. Amit Patel", role: "DOCTOR", specialization: "Pediatrician" },
  ],
  admins: [
    { id: 201, email: "admin@meditrack.com", password: "admin123", name: "Admin User", role: "ADMIN" },
  ]
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"patient" | "doctor" | "admin">("patient");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }
    
    let user = null;
    
    // Check credentials based on selected role
    if (role === "patient") {
      user = USERS.patients.find(u => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem("user", JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          role: "PATIENT",
          loginTime: new Date().toISOString()
        }));
        router.push("/patient");
        return;
      }
    } 
    else if (role === "doctor") {
      user = USERS.doctors.find(u => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem("user", JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          role: "DOCTOR",
          specialization: user.specialization,
          loginTime: new Date().toISOString()
        }));
        router.push("/doctor");
        return;
      }
    } 
    else if (role === "admin") {
      user = USERS.admins.find(u => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem("user", JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          role: "ADMIN",
          loginTime: new Date().toISOString()
        }));
        router.push("/admin");
        return;
      }
    }
    
    setError(`Invalid credentials for ${role} account`);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "rgba(20,20,30,0.6)", backdropFilter: "blur(16px)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: "28px", padding: "40px", width: "100%", maxWidth: "480px", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
        
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ width: "60px", height: "60px", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", borderRadius: "20px", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "28px" }}>🏥</span>
          </div>
          <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>Welcome Back</h1>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>Login to MediTrack</p>
        </div>
        
        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid #ef4444", padding: "12px", borderRadius: "12px", marginBottom: "20px", color: "#ef4444", fontSize: "13px", textAlign: "center" }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#94a3b8" }}>Select Role</label>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="button"
                onClick={() => { setRole("patient"); setError(""); }}
                style={{ 
                  flex: 1, 
                  padding: "12px", 
                  background: role === "patient" ? "linear-gradient(135deg, #06b6d4, #3b82f6)" : "rgba(255,255,255,0.05)", 
                  border: role === "patient" ? "none" : "1px solid rgba(255,255,255,0.1)", 
                  borderRadius: "12px", 
                  color: "white", 
                  cursor: "pointer",
                  transition: "0.3s"
                }}
              >
                Patient
              </button>
              <button
                type="button"
                onClick={() => { setRole("doctor"); setError(""); }}
                style={{ 
                  flex: 1, 
                  padding: "12px", 
                  background: role === "doctor" ? "linear-gradient(135deg, #06b6d4, #3b82f6)" : "rgba(255,255,255,0.05)", 
                  border: role === "doctor" ? "none" : "1px solid rgba(255,255,255,0.1)", 
                  borderRadius: "12px", 
                  color: "white", 
                  cursor: "pointer",
                  transition: "0.3s"
                }}
              >
                Doctor
              </button>
              <button
                type="button"
                onClick={() => { setRole("admin"); setError(""); }}
                style={{ 
                  flex: 1, 
                  padding: "12px", 
                  background: role === "admin" ? "linear-gradient(135deg, #06b6d4, #3b82f6)" : "rgba(255,255,255,0.05)", 
                  border: role === "admin" ? "none" : "1px solid rgba(255,255,255,0.1)", 
                  borderRadius: "12px", 
                  color: "white", 
                  cursor: "pointer",
                  transition: "0.3s"
                }}
              >
                Admin
              </button>
            </div>
          </div>
          
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#94a3b8" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === "patient" ? "patient@meditrack.com" : role === "doctor" ? "dr.rajesh@meditrack.com" : "admin@meditrack.com"}
              style={{ width: "100%", padding: "14px", background: "rgba(10,10,15,0.6)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white", fontSize: "14px", outline: "none", transition: "0.3s" }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#06b6d4"}
              onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
              required
            />
          </div>
          
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#94a3b8" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: "100%", padding: "14px", background: "rgba(10,10,15,0.6)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white", fontSize: "14px", outline: "none", transition: "0.3s" }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#06b6d4"}
              onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
              required
            />
          </div>
          
          <button
            type="submit"
            style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", border: "none", borderRadius: "50px", color: "white", fontSize: "16px", fontWeight: "500", cursor: "pointer", transition: "0.3s", boxShadow: "0 4px 15px rgba(6,182,212,0.3)" }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            Login as {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        </form>
        
        <div style={{ marginTop: "24px", padding: "16px", background: "rgba(0,0,0,0.3)", borderRadius: "12px" }}>
          <p style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "8px" }}>Demo Credentials:</p>
          <div style={{ fontSize: "11px", color: "#475569" }}>
            <p><strong>Patient:</strong> patient@meditrack.com / patient123</p>
            <p><strong>Doctor:</strong> dr.rajesh@meditrack.com / doctor123</p>
            <p><strong>Admin:</strong> admin@meditrack.com / admin123</p>
          </div>
        </div>
        
        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#94a3b8" }}>
          Don't have an account? <Link href="/register" style={{ color: "#06b6d4" }}>Register</Link>
        </p>
      </div>
    </div>
  );
}