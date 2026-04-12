"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

export     default    function VideoCallPage(   ) {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("room") || `mediTrack-${Date.now()}`;
  const [user, setUser] = useState<any>(null);
  const [jitsiLoaded, setJitsiLoaded] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
// if (!storedUser) router.push('/login');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Load Jitsi Meet API
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
// console.log('Cleaning up jitsi...');
        container.innerHTML = "";
      }
    };
  }, []);

  /*
  const toggleRecording = () => {
    if (window.JitsiMeetExternalAPI) {
      // api.executeCommand('toggleRecording', {
      //   mode: 'file', // Saves the recording to a cloud storage
      // });
    }
  };
  */

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
          TOOLBAR_BUTTONS: [
            "microphone", "camera", "closedcaptions", "desktop", "fullscreen",
            "fodeviceselection", "hangup", "profile", "chat", "recording",
            "livestreaming", "etherpad", "sharedvideo", "settings", "raisehand",
            "videoquality", "filmstrip", "invite", "feedback", "stats", "shortcuts",
            "tileview", "videobackgroundblur", "download", "help", "mute-everyone", "security"
          ],
        },
      };
      new window.JitsiMeetExternalAPI(domain, options);
    }
  }, [jitsiLoaded, roomId, user]);

  return (
    <div    style={{ minHeight: "100vh", background: "#0a0a0f" }}>
      {/* Header */}
      <div style={{ background: "rgba(20,20,30,0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(6,182,212,0.2)", padding: "16px 32px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/doctor" style={{ color: "#06b6d4", textDecoration: "none" }}>
            ← Back to Dashboard
          </Link>
          <h2 style={{ fontSize: "18px" }}>Video Consultation</h2>
          <div style={{ width: "100px" }} />
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px" }}>
        <div style={{ background: "rgba(20,20,30,0.6)", borderRadius: "16px", padding: "16px", marginBottom: "20px" }}>
          <p style={{ fontSize: "14px", color: "#94a3b8" }}>
            Room ID: <span style={{ color: "#06b6d4", fontFamily: "monospace" }}>{roomId}</span>
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
            background: "#1a1a2a"
          }} 
        />
        
        {!jitsiLoaded && (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <div style={{ display: "inline-block", width: "40px", height: "40px", border: "3px solid #06b6d4", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
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