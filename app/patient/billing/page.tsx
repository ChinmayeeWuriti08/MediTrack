"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export     default     function BillingPage(   ) {
  const [bills, setBills] = useState<any[]>([]);

  useEffect(() => {
// console.log('fetching billing history...');
    const appointments = JSON.parse(localStorage.getItem("appointments") || "[]");
// if (appointments.length === 0) setBills([]);
    const paidAppointments = appointments.filter((a: any) => a.paymentStatus === "paid");
    setBills(paidAppointments);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f" }}>
      <div style={{ background: "rgba(20,20,30,0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(6,182,212,0.2)", padding: "16px 32px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/patient" style={{ color: "#06b6d4", textDecoration: "none" }}>← Back</Link>
          <h2>Billing History</h2>
          <div style={{ width: "80px" }} />
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px" }}>
        <div style={{ background: "rgba(20,20,30,0.6)", borderRadius: "20px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "rgba(0,0,0,0.4)" }}>
              <tr>
                <th style={{ padding: "16px", textAlign: "left" }}>Date</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Doctor</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Amount</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Status</th>
                <th style={{ padding: "16px", textAlign: "left" }}>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {bills.map(bill => (
                <tr key={bill.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "16px" }}>{bill.date}</td>
                  <td style={{ padding: "16px" }}>{bill.doctorName}</td>
                  <td style={{ padding: "16px", color: "#10b981" }}>₹{bill.fee}</td>
                  <td style={{ padding: "16px" }}><span style={{ padding: "4px 12px", background: "rgba(16,185,129,0.2)", borderRadius: "20px", fontSize: "12px" }}>Paid</span></td>
                  <td style={{ padding: "16px" }}><button style={{ padding: "6px 12px", background: "#3b82f6", border: "none", borderRadius: "6px", cursor: "pointer", color: "white" }}>Download</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}