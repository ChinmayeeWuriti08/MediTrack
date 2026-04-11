"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

const SYMPTOMS_LIST = ["Fever", "Cough", "Headache", "Chest Pain", "Breathing difficulty", "Nausea", "Fatigue", "Sore throat", "Dizziness", "Body ache"];

// Payment methods
const PAYMENT_METHODS = [
  { id: "upi", name: "UPI (Google Pay, PhonePe, Paytm)", icon: "📱" },
  { id: "card", name: "Credit / Debit Card", icon: "💳" },
  { id: "netbanking", name: "Net Banking", icon: "🏦" },
  { id: "wallet", name: "Mobile Wallet", icon: "👛" }
];

export default function PatientPage() {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [otherSymptoms, setOtherSymptoms] = useState("");
  const [aiResult, setAiResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedHospital, setSelectedHospital] = useState<any>(null);
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);
  const [showHospitalDoctors, setShowHospitalDoctors] = useState<any>(null);
  const [userCity, setUserCity] = useState("");
  const [mapCenter, setMapCenter] = useState([19.0760, 72.8777]);
  const [L, setL] = useState<any>(null);
  const [markerIcon, setMarkerIcon] = useState<any>(null);
  const [locationSubmitted, setLocationSubmitted] = useState(false);
  const [searching, setSearching] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [paymentStep, setPaymentStep] = useState("select"); // select, processing, success
  const [upiId, setUpiId] = useState("");
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "" });

  useEffect(() => {
    import("leaflet").then((leaflet) => {
      setL(leaflet);
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });
      setMarkerIcon(leaflet.icon({
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
      }));
    });
    fetchDoctors();
    
    const stored = localStorage.getItem("userCity");
    if (stored) {
      setUserCity(stored);
      fetchRealHospitalsByCity(stored);
      setLocationSubmitted(true);
    }
  }, []);

  // Replace the fetchRealHospitalsByCity function with this:
  const fetchRealHospitalsByCity = async (city: string) => {
    setSearching(true);
    try {
      // Try to get coordinates from OpenStreetMap
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`);
      const geoData = await geoRes.json();
      
      if (geoData && geoData.length > 0) {
        const lat = parseFloat(geoData[0].lat);
        const lon = parseFloat(geoData[0].lon);
        setMapCenter([lat, lon]);
        useCityHospitalData(city, lat, lon);
      } else {
        // Use default center (Mumbai) if city not found
        useCityHospitalData(city, 19.0760, 72.8777);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      useCityHospitalData(city, 19.0760, 72.8777);
    } finally {
      setSearching(false);
    }
  };

// Add this new function with reliable hospital data for Indian cities
// Add this function - Complete reliable hospital data for Indian cities
const useCityHospitalData = (city: string, lat: number, lng: number) => {
  const cityLower = city.toLowerCase();
  
  // Comprehensive hospital database for major Indian cities
  const hospitalDatabase: Record<string, any[]> = {
    "hyderabad": [
      { id: 1, name: "Apollo Hospitals", lat: 17.4399, lng: 78.3784, address: "Jubilee Hills, Hyderabad", beds: 145, icu: 32, phone: "040-23555123" },
      { id: 2, name: "Yashoda Hospitals", lat: 17.4125, lng: 78.4489, address: "Somajiguda, Hyderabad", beds: 120, icu: 28, phone: "040-45678901" },
      { id: 3, name: "KIMS Hospitals", lat: 17.3645, lng: 78.4754, address: "Secunderabad, Hyderabad", beds: 98, icu: 21, phone: "040-23456789" },
      { id: 4, name: "Care Hospitals", lat: 17.4578, lng: 78.3789, address: "Banjara Hills, Hyderabad", beds: 110, icu: 25, phone: "040-66778899" },
      { id: 5, name: "Continental Hospitals", lat: 17.4235, lng: 78.3821, address: "Gachibowli, Hyderabad", beds: 85, icu: 18, phone: "040-67000000" }
    ],
    "mumbai": [
      { id: 6, name: "Kokilaben Hospital", lat: 19.1176, lng: 72.8479, address: "Andheri West, Mumbai", beds: 156, icu: 42, phone: "022-42696969" },
      { id: 7, name: "Lilavati Hospital", lat: 19.0346, lng: 72.8289, address: "Bandra West, Mumbai", beds: 98, icu: 25, phone: "022-26751000" },
      { id: 8, name: "Nanavati Hospital", lat: 19.1265, lng: 72.8335, address: "Vile Parle, Mumbai", beds: 85, icu: 20, phone: "022-26267500" },
      { id: 9, name: "Jaslok Hospital", lat: 18.9929, lng: 72.8186, address: "Pedder Road, Mumbai", beds: 112, icu: 30, phone: "022-66573333" },
      { id: 10, name: "Fortis Hospital", lat: 19.0648, lng: 72.8585, address: "Mulund, Mumbai", beds: 120, icu: 35, phone: "022-67994444" }
    ],
    "delhi": [
      { id: 11, name: "AIIMS Delhi", lat: 28.5672, lng: 77.2100, address: "Ansari Nagar, Delhi", beds: 342, icu: 87, phone: "011-26588500" },
      { id: 12, name: "Apollo Delhi", lat: 28.5624, lng: 77.2399, address: "Sarita Vihar, Delhi", beds: 210, icu: 45, phone: "011-26925858" },
      { id: 13, name: "Fortis Delhi", lat: 28.5678, lng: 77.2001, address: "Vasant Kunj, Delhi", beds: 175, icu: 38, phone: "011-42776222" },
      { id: 14, name: "Max Hospital", lat: 28.5732, lng: 77.2489, address: "Saket, Delhi", beds: 198, icu: 42, phone: "011-26515555" }
    ],
    "bangalore": [
      { id: 15, name: "Fortis Hospital", lat: 12.9716, lng: 77.5946, address: "Bannerghatta Road, Bangalore", beds: 89, icu: 31, phone: "080-66214444" },
      { id: 16, name: "Apollo Bangalore", lat: 12.9352, lng: 77.6215, address: "Jayanagar, Bangalore", beds: 127, icu: 23, phone: "080-26304050" },
      { id: 17, name: "Manipal Hospital", lat: 12.9572, lng: 77.6037, address: "Old Airport Road, Bangalore", beds: 105, icu: 28, phone: "080-22221111" },
      { id: 18, name: "Columbia Asia", lat: 12.9821, lng: 77.6398, address: "Whitefield, Bangalore", beds: 75, icu: 18, phone: "080-61657600" }
    ],
    "chennai": [
      { id: 19, name: "Apollo Chennai", lat: 13.0827, lng: 80.2707, address: "Greams Road, Chennai", beds: 450, icu: 85, phone: "044-28290200" },
      { id: 20, name: "Fortis Malar", lat: 13.0634, lng: 80.2466, address: "Adyar, Chennai", beds: 180, icu: 35, phone: "044-42832323" },
      { id: 21, name: "MIOT Hospital", lat: 13.0108, lng: 80.2211, address: "Manapakkam, Chennai", beds: 150, icu: 40, phone: "044-42002222" }
    ],
    "kolkata": [
      { id: 22, name: "Apollo Kolkata", lat: 22.5342, lng: 88.3517, address: "Bidhannagar, Kolkata", beds: 95, icu: 22, phone: "033-23203040" },
      { id: 23, name: "Fortis Kolkata", lat: 22.5211, lng: 88.3618, address: "Rashbehari, Kolkata", beds: 78, icu: 18, phone: "033-24802800" },
      { id: 24, name: "Medica Hospital", lat: 22.5768, lng: 88.4248, address: "New Town, Kolkata", beds: 110, icu: 28, phone: "033-66066000" }
    ],
    "pune": [
      { id: 25, name: "Ruby Hall Clinic", lat: 18.5333, lng: 73.8685, address: "Shivaji Nagar, Pune", beds: 112, icu: 30, phone: "020-66495555" },
      { id: 26, name: "Jehangir Hospital", lat: 18.5278, lng: 73.8568, address: "Camp, Pune", beds: 85, icu: 20, phone: "020-26055131" }
    ]
  };
  
  // Default hospitals (shown when city not in database)
  const defaultHospitals = [
    { id: 101, name: "City General Hospital", lat: lat, lng: lng, address: `${city} Central Area`, beds: 75, icu: 15, phone: "022-12345678" },
    { id: 102, name: "Metro Hospital", lat: lat + 0.02, lng: lng - 0.015, address: `${city} North`, beds: 60, icu: 12, phone: "022-87654321" },
    { id: 103, name: "National Medical Center", lat: lat - 0.015, lng: lng + 0.02, address: `${city} South`, beds: 90, icu: 20, phone: "022-11223344" },
    { id: 104, name: "City Healthcare", lat: lat + 0.01, lng: lng + 0.01, address: `${city} East`, beds: 55, icu: 10, phone: "022-99887766" },
    { id: 105, name: "MediCare Hospital", lat: lat - 0.01, lng: lng - 0.01, address: `${city} West`, beds: 80, icu: 16, phone: "022-55443322" }
  ];
  
  // Find matching city
  let matchedHospitalsArray = null;
  for (const [key, value] of Object.entries(hospitalDatabase)) {
    if (cityLower.includes(key)) {
      matchedHospitalsArray = value;
      break;
    }
  }
  
  if (matchedHospitalsArray && matchedHospitalsArray.length > 0) {
    // Add distance and simulated live bed data
    const hospitalsWithDistance = matchedHospitalsArray.map((h: any) => ({
      ...h,
      distance: calculateDistance(lat, lng, h.lat, h.lng).toFixed(1),
      beds: Math.floor(Math.random() * 100) + 40,
      icu: Math.floor(Math.random() * 30) + 5
    }));
    setHospitals(hospitalsWithDistance);
    // Set map center to first hospital's location
    const firstHospital = matchedHospitalsArray[0];
    if (firstHospital && firstHospital.lat && firstHospital.lng) {
      setMapCenter([firstHospital.lat, firstHospital.lng]);
    }
  } else {
    // Use default hospitals with calculated distances
    const defaultWithDistance = defaultHospitals.map((h: any) => ({
      ...h,
      distance: calculateDistance(lat, lng, h.lat, h.lng).toFixed(1)
    }));
    setHospitals(defaultWithDistance);
    setMapCenter([lat, lng]);
  }
};

// Make sure calculateDistance is defined
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

  const generateSimulatedHospitals = (city: string, lat: number, lng: number) => {
    const hospitalNames = [
      "Apollo Hospitals", "Fortis Healthcare", "AIIMS", "Max Super Speciality",
      "Manipal Hospitals", "Narayana Health", "Kokilaben Hospital", "Lilavati Hospital"
    ];
    const simulated = hospitalNames.slice(0, 6).map((name, index) => ({
      id: index + 1,
      name: name,
      lat: lat + (Math.random() - 0.5) * 0.05,
      lng: lng + (Math.random() - 0.5) * 0.05,
      address: `${city} area`,
      phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      beds: Math.floor(Math.random() * 150) + 30,
      icu: Math.floor(Math.random() * 40) + 5,
      distance: Math.round((Math.random() * 8 + 0.5) * 10) / 10
    }));
    setHospitals(simulated);
  };

  const fetchDoctors = async () => {
    try {
      const res = await fetch("/api/doctors");
      const data = await res.json();
      setDoctors(data.doctors || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userCity.trim()) {
      localStorage.setItem("userCity", userCity);
      await fetchRealHospitalsByCity(userCity);
      setLocationSubmitted(true);
    }
  };

  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms(prev => prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]);
  };

  const analyzeSymptoms = async () => {
    if (selectedSymptoms.length === 0 && !otherSymptoms.trim()) {
      alert("Please select or describe your symptoms");
      return;
    }
    setLoading(true);
    try {
      const allSymptoms = [...selectedSymptoms];
      if (otherSymptoms.trim()) allSymptoms.push(otherSymptoms);
      
      const res = await fetch("/api/ai/symptom-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: allSymptoms.join(", ") })
      });
      const data = await res.json();
      setAiResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorsByHospital = async (hospitalId: number) => {
    try {
      const res = await fetch(`/api/doctors/by-hospital?hospitalId=${hospitalId}`);
      const data = await res.json();
      setShowHospitalDoctors(data.doctors);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBooking = (doctor: any) => {
    setSelectedDoctor(doctor);
    setShowPayment(true);
    setPaymentStep("select");
    setPaymentMethod("upi");
  };

  const processPayment = () => {
    setPaymentStep("processing");
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStep("success");
      
      // Save appointment
      const newAppointment = {
        id: Date.now(),
        doctorName: selectedDoctor.name,
        specialization: selectedDoctor.specialization,
        fee: selectedDoctor.fee,
        slot: selectedSlot,
        date: new Date().toISOString().split("T")[0],
        status: "upcoming",
        type: "in-person",
        paymentMethod: paymentMethod,
        paymentStatus: "paid",
        transactionId: `TXN${Date.now()}`
      };
      
      const existing = localStorage.getItem("appointments");
      const appointments = existing ? JSON.parse(existing) : [];
      appointments.push(newAppointment);
      localStorage.setItem("appointments", JSON.stringify(appointments));
      
      // Redirect to success after 2 seconds
      setTimeout(() => {
        setShowPayment(false);
        setAppointmentSuccess(true);
        setPaymentStep("select");
        setTimeout(() => setAppointmentSuccess(false), 4000);
      }, 2000);
    }, 2000);
  };

  // Filter doctors based on AI result for specialists section
  const getSuggestedSpecialists = () => {
    if (!aiResult || !aiResult.specialist) return [];
    return doctors.filter(d => d.specialization === aiResult.specialist).slice(0, 3);
  };

  const suggestedSpecialists = getSuggestedSpecialists();

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f" }}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(10,10,15,0.8)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(6,182,212,0.2)", padding: "16px 32px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "10px", height: "10px", background: "#10b981", borderRadius: "50%", boxShadow: "0 0 10px #10b981", animation: "pulse 1.5s infinite" }} />
            <span style={{ fontSize: "20px", fontWeight: "bold", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>MEDITRACK</span>
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <Link href="/patient/history" style={{ color: "#94a3b8", textDecoration: "none" }}>Records</Link>
            <Link href="/patient/appointments" style={{ color: "#94a3b8", textDecoration: "none" }}>Appointments</Link>
            <Link href="/patient/reminders" style={{ color: "#94a3b8", textDecoration: "none" }}>Reminders</Link>
            <Link href="/patient/billing" style={{ color: "#94a3b8", textDecoration: "none" }}>Billing</Link>
            <Link href="/patient/profile" style={{ color: "#94a3b8", textDecoration: "none" }}>Profile</Link>
            <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>Logout</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px" }}>
        
        {!locationSubmitted ? (
          <div style={{ background: "rgba(20,20,30,0.5)", backdropFilter: "blur(16px)", borderRadius: "28px", padding: "48px", textAlign: "center", border: "1px solid rgba(6,182,212,0.2)" }}>
            <h2 style={{ fontSize: "28px", marginBottom: "16px", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}>Find Hospitals Near You</h2>
            <p style={{ color: "#94a3b8", marginBottom: "32px" }}>Enter your city to see real hospitals</p>
            <form onSubmit={handleCitySubmit} style={{ maxWidth: "450px", margin: "0 auto" }}>
              <input
                type="text"
                value={userCity}
                onChange={(e) => setUserCity(e.target.value)}
                placeholder="Enter city (e.g., Hyderabad, Mumbai, Delhi)"
                style={{ width: "100%", padding: "14px 20px", background: "rgba(10,10,15,0.6)", border: "1px solid rgba(6,182,212,0.3)", borderRadius: "50px", color: "white", fontSize: "16px", marginBottom: "20px", outline: "none" }}
                required
              />
              <button type="submit" style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", border: "none", borderRadius: "50px", color: "white", cursor: "pointer", fontSize: "16px" }}>
                Find Hospitals →
              </button>
            </form>
          </div>
        ) : (
          <>
            <div style={{ background: "rgba(6,182,212,0.08)", backdropFilter: "blur(12px)", border: "1px solid rgba(6,182,212,0.25)", borderRadius: "16px", padding: "14px 24px", marginBottom: "28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "20px" }}>📍</span>
                <span style={{ fontSize: "14px" }}>Showing hospitals in: <strong style={{ color: "#06b6d4" }}>{userCity}</strong></span>
                {searching && <span style={{ fontSize: "12px", color: "#f59e0b" }}>Loading...</span>}
              </div>
              <button onClick={() => setLocationSubmitted(false)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(6,182,212,0.3)", borderRadius: "30px", padding: "6px 16px", color: "#06b6d4", cursor: "pointer", fontSize: "12px" }}>
                Change Location
              </button>
            </div>

            {appointmentSuccess && (
              <div style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: "16px", padding: "16px", marginBottom: "28px", textAlign: "center" }}>
                ✅ Appointment confirmed! Check your email for details.
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "28px" }}>
              
              {/* LEFT COLUMN - AI Symptom Checker */}
              <div style={{ background: "rgba(20,20,30,0.45)", backdropFilter: "blur(16px)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: "28px", padding: "28px" }}>
                <h2 style={{ fontSize: "22px", marginBottom: "8px" }}>AI Symptom Checker</h2>
                <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "24px" }}>Select your symptoms for instant AI analysis</p>
                
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "24px" }}>
                  {SYMPTOMS_LIST.map(s => (
                    <button key={s} onClick={() => toggleSymptom(s)} style={{
                      padding: "8px 20px",
                      borderRadius: "40px",
                      border: selectedSymptoms.includes(s) ? "1px solid #06b6d4" : "1px solid rgba(255,255,255,0.15)",
                      background: selectedSymptoms.includes(s) ? "rgba(6,182,212,0.2)" : "rgba(255,255,255,0.03)",
                      color: selectedSymptoms.includes(s) ? "#06b6d4" : "#cbd5e1",
                      cursor: "pointer",
                      fontSize: "13px",
                      transition: "0.2s"
                    }}>
                      {s}
                    </button>
                  ))}
                </div>
                
                <textarea
                  value={otherSymptoms}
                  onChange={(e) => setOtherSymptoms(e.target.value)}
                  placeholder="Or describe other symptoms in detail..."
                  style={{ width: "100%", height: "90px", padding: "14px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", color: "white", marginBottom: "20px", resize: "none", fontSize: "13px", outline: "none" }}
                />
                
                <button onClick={analyzeSymptoms} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", border: "none", borderRadius: "50px", color: "white", cursor: "pointer", fontSize: "14px", fontWeight: "500" }}>
                  {loading ? "Analyzing..." : "Analyze Symptoms →"}
                </button>
                
                {/* AI Result Box */}
                {aiResult && (
                  <div style={{ marginTop: "24px", background: "rgba(0,0,0,0.35)", borderRadius: "20px", padding: "20px", borderLeft: `4px solid ${aiResult.urgency === "HIGH" ? "#ef4444" : aiResult.urgency === "MEDIUM" ? "#f59e0b" : "#10b981"}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                      <strong>Possible condition:</strong>
                      <span style={{ padding: "4px 12px", borderRadius: "20px", background: aiResult.urgency === "HIGH" ? "rgba(239,68,68,0.2)" : aiResult.urgency === "MEDIUM" ? "rgba(245,158,11,0.2)" : "rgba(16,185,129,0.2)", color: aiResult.urgency === "HIGH" ? "#ef4444" : aiResult.urgency === "MEDIUM" ? "#f59e0b" : "#10b981", fontSize: "12px" }}>{aiResult.urgency} URGENCY</span>
                    </div>
                    <p style={{ fontSize: "15px", marginBottom: "8px" }}>{aiResult.condition}</p>
                    <p style={{ fontSize: "13px", color: "#cbd5e1" }}>{aiResult.recommendation}</p>
                    <p style={{ fontSize: "12px", color: "#06b6d4", marginTop: "12px" }}>Suggested: {aiResult.specialist}</p>
                    <p style={{ fontSize: "10px", color: "#64748b", marginTop: "12px" }}>{aiResult.disclaimer}</p>
                  </div>
                )}

                {/* ========== AI SUGGESTED SPECIALISTS - PLACE THIS HERE ========== */}
                {suggestedSpecialists.length > 0 && (
                  <div style={{ marginTop: "24px", background: "rgba(20,20,30,0.5)", borderRadius: "20px", padding: "20px", border: "1px solid rgba(6,182,212,0.15)" }}>
                    <h3 style={{ fontSize: "16px", marginBottom: "16px" }}>Recommended Specialists for {aiResult?.condition}</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {suggestedSpecialists.map((d: any) => (
                        <div key={d.id} style={{ background: "rgba(0,0,0,0.3)", borderRadius: "14px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                          <div>
                            <div style={{ fontWeight: "bold", fontSize: "16px" }}>Dr. {d.name}</div>
                            <div style={{ fontSize: "12px", color: "#06b6d4" }}>{d.specialization}</div>
                            <div style={{ fontSize: "11px", color: "#94a3b8" }}>⭐ {d.rating} • {d.experience} years experience</div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "20px", fontWeight: "bold", color: "#10b981" }}>₹{d.fee}</div>
                            <button onClick={() => handleBooking(d)} style={{ marginTop: "8px", padding: "8px 20px", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", border: "none", borderRadius: "40px", color: "white", cursor: "pointer", fontSize: "12px" }}>
                              Book Now
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN - Map and Hospitals */}
              <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                
                {/* Map */}
                <div style={{ background: "rgba(20,20,30,0.45)", backdropFilter: "blur(16px)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: "28px", overflow: "hidden" }}>
                  <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <h3 style={{ fontSize: "18px" }}>Hospital Locations Map</h3>
                    <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>Click on markers for hospital details</p>
                  </div>
                  <div style={{ height: "360px", width: "100%" }}>
                    {L && markerIcon && (
                      <MapContainer center={mapCenter as [number, number]} zoom={13} style={{ height: "100%", width: "100%" }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                        {hospitals.map((hospital) => (
                          <Marker key={hospital.id} position={[hospital.lat, hospital.lng]} icon={markerIcon}>
                            <Popup>
                              <div style={{ minWidth: "180px", padding: "4px" }}>
                                <strong>{hospital.name}</strong>
                                <p style={{ fontSize: "11px", margin: "6px 0", color: "#666" }}>{hospital.address}</p>
                                <p style={{ fontSize: "12px", margin: "4px 0" }}>🛏️ {hospital.beds} beds | ICU: {hospital.icu}</p>
                                <button onClick={() => { setSelectedHospital(hospital); fetchDoctorsByHospital(hospital.id); }} style={{ marginTop: "8px", padding: "8px 12px", background: "#3b82f6", border: "none", borderRadius: "8px", color: "white", cursor: "pointer", width: "100%" }}>
                                  View Doctors
                                </button>
                              </div>
                            </Popup>
                          </Marker>
                        ))}
                      </MapContainer>
                    )}
                  </div>
                </div>

                {/* Hospitals List */}
                <div style={{ background: "rgba(20,20,30,0.45)", backdropFilter: "blur(16px)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: "28px" }}>
                  <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <h3 style={{ fontSize: "18px" }}>Nearby Hospitals in {userCity}</h3>
                    <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>Click on any hospital to see doctors</p>
                  </div>
                  <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "12px", maxHeight: "340px", overflowY: "auto" }}>
                    {hospitals.map(h => (
                      <div key={h.id} onClick={() => { setSelectedHospital(h); fetchDoctorsByHospital(h.id); }} style={{ background: "rgba(6,182,212,0.05)", padding: "16px", borderRadius: "16px", cursor: "pointer", border: selectedHospital?.id === h.id ? "1px solid #06b6d4" : "1px solid rgba(6,182,212,0.15)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "4px" }}>{h.name}</div>
                            <div style={{ fontSize: "12px", color: "#94a3b8" }}>{h.address}</div>
                            <div style={{ fontSize: "12px", marginTop: "6px" }}>🛏️ {h.beds} beds • ❤️ ICU: {h.icu}</div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "16px", fontWeight: "bold", color: "#06b6d4" }}>{h.distance} km</div>
                            <div style={{ fontSize: "11px", color: "#10b981", marginTop: "4px" }}>→ View Doctors</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hospital Doctors */}
                {showHospitalDoctors && showHospitalDoctors.length > 0 && (
                  <div style={{ background: "rgba(20,20,30,0.45)", backdropFilter: "blur(16px)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: "28px", padding: "24px" }}>
                    <h3 style={{ fontSize: "18px", marginBottom: "16px" }}>Available Doctors at {selectedHospital?.name}</h3>
                    {showHospitalDoctors.map((d: any) => (
                      <div key={d.id} style={{ background: "rgba(0,0,0,0.3)", borderRadius: "14px", padding: "16px", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                        <div>
                          <div style={{ fontWeight: "bold" }}>Dr. {d.name}</div>
                          <div style={{ fontSize: "12px", color: "#06b6d4" }}>{d.specialization}</div>
                          <div style={{ fontSize: "11px", color: "#94a3b8" }}>⭐ {d.rating} • {d.experience} years</div>
                        </div>
                        <div>
                          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#10b981" }}>₹{d.fee}</div>
                          <button onClick={() => handleBooking(d)} style={{ marginTop: "8px", padding: "8px 20px", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", border: "none", borderRadius: "40px", color: "white", cursor: "pointer" }}>
                            Book Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ========== COMPLETE PAYMENT MODAL WITH UPI, CARD, NETBANKING ========== */}
      {showPayment && selectedDoctor && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "rgba(20,20,30,0.95)", backdropFilter: "blur(20px)", borderRadius: "32px", padding: "32px", maxWidth: "500px", width: "90%", border: "1px solid rgba(6,182,212,0.3)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
            
            {paymentStep === "select" && (
              <>
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "26px", marginBottom: "8px" }}>Complete Payment</h3>
                  <p style={{ color: "#94a3b8", fontSize: "14px" }}>Pay securely to confirm appointment</p>
                </div>

                <div style={{ marginBottom: "20px", padding: "16px", background: "rgba(0,0,0,0.3)", borderRadius: "16px" }}>
                  <p><strong>Doctor:</strong> Dr. {selectedDoctor.name}</p>
                  <p><strong>Specialization:</strong> {selectedDoctor.specialization}</p>
                  <p><strong>Amount:</strong> <span style={{ fontSize: "24px", fontWeight: "bold", color: "#10b981" }}>₹{selectedDoctor.fee}</span></p>
                </div>

                <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#94a3b8" }}>Select Time Slot</label>
                <select value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)} style={{ width: "100%", padding: "14px", marginBottom: "24px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white" }}>
                  <option value="">Select a time slot</option>
                  <option>10:00 AM</option><option>11:30 AM</option><option>2:00 PM</option>
                  <option>3:30 PM</option><option>5:00 PM</option><option>6:30 PM</option>
                </select>

                <label style={{ display: "block", marginBottom: "12px", fontSize: "14px", fontWeight: "500" }}>Select Payment Method</label>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                  {PAYMENT_METHODS.map(method => (
                    <label key={method.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: paymentMethod === method.id ? "rgba(6,182,212,0.15)" : "rgba(0,0,0,0.3)", borderRadius: "12px", cursor: "pointer", border: paymentMethod === method.id ? "1px solid #06b6d4" : "1px solid rgba(255,255,255,0.05)" }}>
                      <input type="radio" name="paymentMethod" value={method.id} checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} style={{ width: "18px", height: "18px" }} />
                      <span style={{ fontSize: "18px", marginRight: "8px" }}>{method.icon}</span>
                      <span>{method.name}</span>
                    </label>
                  ))}
                </div>

                {paymentMethod === "upi" && (
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "6px", display: "block" }}>UPI ID (Google Pay / PhonePe / Paytm)</label>
                    <input type="text" placeholder="username@okhdfcbank" value={upiId} onChange={(e) => setUpiId(e.target.value)} style={{ width: "100%", padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white" }} />
                  </div>
                )}

                                {paymentMethod === "card" && (
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ marginBottom: "12px" }}>
                      <label style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "6px", display: "block" }}>Card Number</label>
                      <input type="text" placeholder="1234 5678 9012 3456" value={cardDetails.number} onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})} style={{ width: "100%", padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white" }} />
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "6px", display: "block" }}>Expiry (MM/YY)</label>
                        <input type="text" placeholder="12/25" value={cardDetails.expiry} onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})} style={{ width: "100%", padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "6px", display: "block" }}>CVV</label>
                        <input type="password" placeholder="123" value={cardDetails.cvv} onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})} style={{ width: "100%", padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white" }} />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "netbanking" && (
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "6px", display: "block" }}>Select Bank</label>
                    <select style={{ width: "100%", padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white" }}>
                      <option>SBI - State Bank of India</option>
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                      <option>Yes Bank</option>
                      <option>PNB - Punjab National Bank</option>
                    </select>
                  </div>
                )}

                            {paymentMethod === "card" && (
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ marginBottom: "12px" }}>
                      <label style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "6px", display: "block" }}>Card Number</label>
                      <input type="text" placeholder="1234 5678 9012 3456" value={cardDetails.number} onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})} style={{ width: "100%", padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white" }} />
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "6px", display: "block" }}>Expiry (MM/YY)</label>
                        <input type="text" placeholder="12/25" value={cardDetails.expiry} onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})} style={{ width: "100%", padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "6px", display: "block" }}>CVV</label>
                        <input type="password" placeholder="123" value={cardDetails.cvv} onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})} style={{ width: "100%", padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white" }} />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "netbanking" && (
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "6px", display: "block" }}>Select Bank</label>
                    <select style={{ width: "100%", padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white" }}>
                      <option>SBI - State Bank of India</option>
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                      <option>Yes Bank</option>
                      <option>PNB - Punjab National Bank</option>
                    </select>
                  </div>
                )}

                {paymentMethod === "wallet" && (
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "6px", display: "block" }}>Select Wallet</label>
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                      <button style={{ flex: 1, padding: "10px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", cursor: "pointer", color: "white" }}>PhonePe</button>
                      <button style={{ flex: 1, padding: "10px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", cursor: "pointer", color: "white" }}>Paytm</button>
                      <button style={{ flex: 1, padding: "10px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", cursor: "pointer", color: "white" }}>Google Pay</button>
                    </div>
                  </div>
                )}

                <button onClick={processPayment} disabled={!selectedSlot} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", border: "none", borderRadius: "50px", color: "white", fontSize: "16px", fontWeight: "500", cursor: "pointer", opacity: selectedSlot ? 1 : 0.5 }}>
                  Pay ₹{selectedDoctor.fee}
                </button>
              </>
            )}

            {paymentStep === "processing" && (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <div style={{ width: "60px", height: "60px", border: "3px solid #06b6d4", borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto 20px", animation: "spin 1s linear infinite" }} />
                <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>Processing Payment...</h3>
                <p style={{ color: "#94a3b8", fontSize: "13px" }}>Please do not close this window</p>
              </div>
            )}

            {paymentStep === "success" && (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <div style={{ fontSize: "60px", marginBottom: "16px" }}>✅</div>
                <h3 style={{ fontSize: "24px", marginBottom: "8px", color: "#10b981" }}>Payment Successful!</h3>
                <p style={{ color: "#94a3b8", marginBottom: "20px" }}>Your appointment has been confirmed</p>
                <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "12px", padding: "16px", marginBottom: "20px", textAlign: "left" }}>
                  <p><strong>Transaction ID:</strong> TXN{Date.now()}</p>
                  <p><strong>Doctor:</strong> Dr. {selectedDoctor.name}</p>
                  <p><strong>Time:</strong> {selectedSlot}</p>
                  <p><strong>Amount Paid:</strong> ₹{selectedDoctor.fee}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
    );
    }