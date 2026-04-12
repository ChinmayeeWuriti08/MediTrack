"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

function VideoCallContent() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("room") || `mediTrack-${Date.now()}`;
  const [user, setUser] = useState<any>(null);
  const [jitsiLoaded, setJitsiLoaded] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const script = document.createElement("script");
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;
    script.onload = () => {
      setJitsiLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      const container = document.getElementById("jitsi-container");
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

  useEffect(() => {
    if (jitsiLoaded && window.JitsiMeetExternalAPI) {
      const domain = "meet.jit.si";
      const options = {
        roomName: roomId,
        parentNode: document.getElementById("jitsi-container"),
        userInfo: {
          displayName: user?.name || "Patient",
          email: user?.email || "",
        },
        configOverwrite: {
          startWithAudioMuted: true,
          startWithVideoMuted: false,
          prejoinPageEnabled: false,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_BRAND_WATERMARK: false,
        },
      };
      new window.JitsiMeetExternalAPI(domain, options);
    }
  }, [jitsiLoaded, roomId, user]);

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a" }}>
      <div style={{ background: "#1e293b", borderBottom: "1px solid #334155", padding: "16px 32px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/doctor" style={{ color: "#059669", textDecoration: "none" }}>
            ← Back to Dashboard
          </Link>
          <h2 style={{ fontSize: "18px", color: "#f1f5f9" }}>Video Consultation</h2>
          <div style={{ width: "100px" }} />
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px" }}>
        <div style={{ background: "#1e293b", borderRadius: "12px", padding: "16px", marginBottom: "20px", border: "1px solid #334155" }}>
          <p style={{ fontSize: "14px", color: "#94a3b8" }}>
            Room ID: <span style={{ color: "#059669", fontFamily: "monospace" }}>{roomId}</span>
          </p>
          <p style={{ fontSize: "12px", color: "#f59e0b", marginTop: "8px" }}>
            Share this room ID with your patient to join the same call
          </p>
        </div>
        
        <div 
          id="jitsi-container" 
          style={{ 
            width: "100%", 
            height: "600px", 
            borderRadius: "16px", 
            overflow: "hidden",
            background: "#0f172a"
          }} 
        />
        
        {!jitsiLoaded && (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <div style={{ display: "inline-block", width: "40px", height: "40px", border: "3px solid #059669", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            <p style={{ marginTop: "16px", color: "#94a3b8" }}>Loading video call...</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Main page component with Suspense boundary
export default function VideoCallPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "40px", height: "40px", border: "3px solid #059669", borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 1s linear infinite" }} />
          <p style={{ color: "#94a3b8" }}>Loading video room...</p>
        </div>
      </div>
    }>
      <VideoCallContent />
    </Suspense>
  );
}