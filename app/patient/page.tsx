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

  const PAYMENT_METHODS = [
  { id: "upi", name: "UPI (Google Pay, PhonePe, Paytm)", icon: "" },
  { id: "card", name: "Credit / Debit Card", icon: "" },
  { id: "netbanking", name: "Net Banking", icon: "" },
  { id: "wallet", name: "Mobile Wallet", icon: "" }
  ];

  // Available time slots
  const TIME_SLOTS = ["10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM", "5:00 PM", "6:30 PM"];
  const APPOINTMENT_TYPES = ["in-person", "video"];

  // Hospital database
  const hospitalDatabase: Record<string, any[]> = {
  "hyderabad": [
    { id: 1, name: "Apollo Hospitals", lat: 17.4399, lng: 78.3784, address: "Jubilee Hills, Hyderabad", beds: 145, icu: 32, phone: "040-23555123", rushHours: { peak: "10AM-1PM, 5PM-8PM", light: "2PM-4PM", moderate: "9AM-10AM" } },
    { id: 2, name: "Yashoda Hospitals", lat: 17.4125, lng: 78.4489, address: "Somajiguda, Hyderabad", beds: 120, icu: 28, phone: "040-45678901", rushHours: { peak: "11AM-2PM", light: "3PM-6PM", moderate: "9AM-11AM" } }
  ],
  "mumbai": [
    { id: 3, name: "Kokilaben Hospital", lat: 19.1176, lng: 72.8479, address: "Andheri West, Mumbai", beds: 156, icu: 42, phone: "022-42696969", rushHours: { peak: "9AM-12PM, 5PM-8PM", light: "12PM-3PM", moderate: "3PM-5PM" } },
    { id: 4, name: "Lilavati Hospital", lat: 19.0346, lng: 72.8289, address: "Bandra West, Mumbai", beds: 98, icu: 25, phone: "022-26751000", rushHours: { peak: "10AM-1PM, 6PM-9PM", light: "2PM-5PM", moderate: "9AM-10AM" } }
  ],
  "delhi": [
    { id: 5, name: "AIIMS Delhi", lat: 28.5672, lng: 77.2100, address: "Ansari Nagar, Delhi", beds: 342, icu: 87, phone: "011-26588500", rushHours: { peak: "9AM-1PM, 4PM-7PM", light: "2PM-4PM", moderate: "7PM-9PM" } }
  ],
  "bangalore": [
    { id: 6, name: "Fortis Hospital", lat: 12.9716, lng: 77.5946, address: "Bannerghatta Road, Bangalore", beds: 89, icu: 31, phone: "080-66214444", rushHours: { peak: "10AM-2PM", light: "3PM-6PM", moderate: "9AM-10AM" } }
  ]
  };

  // Top doctors database
  const TOP_DOCTORS = [
  { id: 1, name: "Dr. Jnana Manojna Wuriti", specialization: "Cardiologist", rating: 4.9, experience: 15, fee: 1200, availability: "Today", image: "" },
  { id: 2, name: "Dr. Priya Sharma", specialization: "Neurologist", rating: 4.8, experience: 12, fee: 1100, availability: "Today", image: "" },
  { id: 3, name: "Dr. Amit Patel", specialization: "Pediatrician", rating: 4.9, experience: 10, fee: 900, availability: "Tomorrow", image: "" },
  { id: 4, name: "Dr. Sneha Reddy", specialization: "Orthopedic", rating: 4.7, experience: 8, fee: 1000, availability: "Today", image: "" },
  { id: 5, name: "Dr. Vikram Singh", specialization: "Cardiologist", rating: 4.9, experience: 20, fee: 1500, availability: "Today", image: "" },
  { id: 6, name: "Dr. Neha Gupta", specialization: "Dermatologist", rating: 4.8, experience: 7, fee: 800, availability: "Tomorrow", image: "" }
  ];

  export default function PatientPage(   ) {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [otherSymptoms, setOtherSymptoms] = useState("");
  const [aiResult, setAiResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedType, setSelectedType] = useState("in-person");
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);
  const [userCity, setUserCity] = useState("");
  const [mapCenter, setMapCenter] = useState([19.0760, 72.8777]);
  const [L, setL] = useState<any>(null);
  const [markerIcon, setMarkerIcon] = useState<any>(null);
  const [locationSubmitted, setLocationSubmitted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [paymentStep, setPaymentStep] = useState("select");
  const [upiId, setUpiId] = useState("");
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "" });
  const [selectedHospitalForDoctors, setSelectedHospitalForDoctors] = useState<any>(null);

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
    
    const stored = localStorage.getItem("userCity");
    if (stored) {
      setUserCity(stored);
      loadHospitalsByCity(stored);
      setLocationSubmitted(true);
    }
  }, []);

  const loadHospitalsByCity = (city: string) => {
    const cityLower = city.toLowerCase();
    let matched = false;
    for (const [key, value] of Object.entries(hospitalDatabase)) {
      if (cityLower.includes(key)) {
        setHospitals(value);
        if (value.length > 0) {
          setMapCenter([value[0].lat, value[0].lng]);
        }
        matched = true;
        break;
      }
    }
    if (!matched) {
      const defaultHospitals = [
        { id: 999, name: "City General Hospital", lat: 19.0760, lng: 72.8777, address: `${city} area`, beds: 75, icu: 15, phone: "022-12345678", rushHours: { peak: "10AM-1PM, 5PM-8PM", light: "2PM-4PM", moderate: "9AM-10AM" } }
      ];
      setHospitals(defaultHospitals);
    }
  };

  const handleCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userCity.trim()) {
// console.log("setting city to:", userCity);
/*
  if (userCity === 'test') return;
*/
      localStorage.setItem("userCity", userCity);
      loadHospitalsByCity(userCity);
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
      
      // Simple AI analysis
      const symptomsLower = allSymptoms.join(", ").toLowerCase();
      let result = {
        condition: "General discomfort",
        urgency: "LOW",
        specialist: "General Physician",
        recommendation: "Monitor symptoms. Consult if persists.",
        disclaimer: "AI analysis for informational purposes only"
      };
      
      if (symptomsLower.includes("chest") && symptomsLower.includes("pain")) {
        result = { condition: "Possible cardiac concern", urgency: "HIGH", specialist: "Cardiologist", recommendation: "Seek immediate medical attention", disclaimer: "Emergency symptoms detected" };
      } else if ((symptomsLower.includes("fever") && symptomsLower.includes("cough")) || symptomsLower.includes("breathing")) {
        result = { condition: "Respiratory infection", urgency: "MEDIUM", specialist: "Pulmonologist", recommendation: "Rest and stay hydrated. Consult if fever persists", disclaimer: "AI analysis only" };
      } else if (symptomsLower.includes("headache") && symptomsLower.includes("nausea")) {
        result = { condition: "Migraine", urgency: "MEDIUM", specialist: "Neurologist", recommendation: "Rest in dark room. Schedule appointment", disclaimer: "AI analysis only" };
      }
      
      setAiResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = (doctor: any) => {
    setSelectedDoctor(doctor);
    setShowPayment(true);
    setPaymentStep("select");
    setSelectedSlot("");
    setSelectedDate("");
    setSelectedType("in-person");
  };

  const processPayment = () => {
    if (!selectedDate) {
      alert("Please select a date");
      return;
    }
    if (!selectedSlot) {
      alert("Please select a time slot");
      return;
    }
    
    setPaymentStep("processing");
    
    setTimeout(() => {
      setPaymentStep("success");
      
      const newAppointment = {
        id: Date.now(),
        doctorName: selectedDoctor.name,
        specialization: selectedDoctor.specialization,
        fee: selectedDoctor.fee,
        date: selectedDate,
        time: selectedSlot,
        type: selectedType,
        status: "upcoming",
        paymentMethod: paymentMethod,
        paymentStatus: "paid",
        transactionId: `TXN${Date.now()}`
      };
      
      const existing = localStorage.getItem("appointments");
      const appointments = existing ? JSON.parse(existing) : [];
      appointments.push(newAppointment);
      localStorage.setItem("appointments", JSON.stringify(appointments));
      
      setTimeout(() => {
        setShowPayment(false);
        setAppointmentSuccess(true);
        setPaymentStep("select");
        setTimeout(() => setAppointmentSuccess(false), 4000);
      }, 2000);
    }, 2000);
  };

  // Get available dates (next 7 days)
  const getAvailableDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  };

  // Filter doctors based on AI result
  const getSuggestedDoctors = () => {
    if (!aiResult || !aiResult.specialist) return TOP_DOCTORS.slice(0, 4);
    const filtered = TOP_DOCTORS.filter(d => d.specialization === aiResult.specialist);
    return filtered.length > 0 ? filtered : TOP_DOCTORS.slice(0, 4);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a" }}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "#0f172a", borderBottom: "1px solid #334155", padding: "16px 32px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "10px", height: "10px", background: "#10b981", borderRadius: "50%" }} />
            <span style={{ fontSize: "20px", fontWeight: "bold", color: "#f1f5f9" }}>MEDITRACK</span>
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <Link href="/patient/history" style={{ color: "#94a3b8", textDecoration: "none" }}>Records</Link>
            <Link href="/patient/appointments" style={{ color: "#94a3b8", textDecoration: "none" }}>Appointments</Link>
            <Link href="/patient/reminders" style={{ color: "#94a3b8", textDecoration: "none" }}>Reminders</Link>
            <Link href="/patient/billing" style={{ color: "#94a3b8", textDecoration: "none" }}>Billing</Link>
            <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>Logout</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px" }}>
        
        {!locationSubmitted ? (
          <div style={{ background: "#1e293b", borderRadius: "16px", padding: "48px", textAlign: "center", border: "1px solid #334155" }}>
            <h2 style={{ fontSize: "28px", marginBottom: "16px", color: "#f1f5f9" }}>Find Hospitals Near You</h2>
            <p   style={{ color: "#94a3b8", marginBottom: "32px" }}>Enter your city to see nearby hospitals</p>
            <form onSubmit={handleCitySubmit} style={{ maxWidth: "450px", margin: "0 auto" }}>
              <input type="text" value={userCity} onChange={(e) => setUserCity(e.target.value)} placeholder="Enter city (e.g., Hyderabad, Mumbai, Delhi)" style={{ width: "100%", padding: "14px 20px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "white", fontSize: "16px", marginBottom: "20px", outline: "none" }} required />
              <button type="submit" style={{ width: "100%", padding: "14px", background: "#2563eb", border: "none", borderRadius: "10px", color: "white", cursor: "pointer", fontSize: "16px" }}>Find Hospitals →</button>
            </form>
          </div>
        ) : (
          <>
            <div style={{ background: "rgba(37, 99, 235, 0.05)", border: "1px solid #334155", borderRadius: "12px", padding: "14px 24px", marginBottom: "28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
              <div    style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span></span>
                <span>Showing hospitals in: <strong style={{ color: "#06b6d4" }}>{userCity}</strong></span>
              </div>
              <button onClick={() => setLocationSubmitted(false)} style={{ background: "transparent", border: "1px solid #475569", borderRadius: "30px", padding: "6px 16px", color: "#94a3b8", cursor: "pointer" }}>Change Location</button>
            </div>

            {   appointmentSuccess && (
              <div style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: "16px", padding: "16px", marginBottom: "28px", textAlign: "center" }}>
                Appointment confirmed! Check your email for details.
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }}>
              
              {/* LEFT COLUMN */}
              <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                
                {/* AI Symptom Checker */}
                <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "16px", padding: "28px" }}>
                  <h2 style={{ fontSize: "22px", marginBottom: "8px" }}>AI Symptom Checker</h2>
                  <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "24px" }}>Select your symptoms for instant AI analysis</p>
                  
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
                    {SYMPTOMS_LIST.map(s => (
                      <button key={s} onClick={() => toggleSymptom(s)} style={{
                        padding: "8px 20px",
                        borderRadius: "40px",
                        border: selectedSymptoms.includes(s) ? "1px solid #2563eb" : "1px solid #334155",
                        background: selectedSymptoms.includes(s) ? "#2563eb" : "transparent",
                        color: selectedSymptoms.includes(s) ? "white" : "#cbd5e1",
                        cursor: "pointer",
                        fontSize: "13px"
                      }}>
                        {s}
                      </button>
                    ))}
                  </div>
                  
                  <textarea value={otherSymptoms} onChange={(e) => setOtherSymptoms(e.target.value)} placeholder="Or describe other symptoms..." style={{ width: "100%", height: "80px", padding: "14px", background: "#0f172a", border: "1px solid #334155", borderRadius: "10px", color: "white", marginBottom: "20px", resize: "none" }} />
                  
                  <button onClick={analyzeSymptoms} style={{ width: "100%", padding: "14px", background: "#2563eb", border: "none", borderRadius: "10px", color: "white", cursor: "pointer", fontSize: "14px", fontWeight: "500" }}>
                    {loading ? "Analyzing..." : "Analyze Symptoms →"}
                  </button>
                  
                  {aiResult && (
                    <div style={{ marginTop: "24px", background: "#0f172a", borderRadius: "12px", padding: "20px", borderLeft: `4px solid ${aiResult.urgency === "HIGH" ? "#ef4444" : aiResult.urgency === "MEDIUM" ? "#f59e0b" : "#10b981"}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                        <strong>Possible condition:</strong>
                        <span style={{ padding: "4px 12px", borderRadius: "20px", background: "rgba(0,0,0,0.4)", color: aiResult.urgency === "HIGH" ? "#ef4444" : aiResult.urgency === "MEDIUM" ? "#f59e0b" : "#10b981", fontSize: "12px", border: `1px solid ${aiResult.urgency === "HIGH" ? "#ef4444" : aiResult.urgency === "MEDIUM" ? "#f59e0b" : "#10b981"}` }}>{aiResult.urgency} URGENCY</span>
                      </div>
                      <p style={{ fontSize: "15px", marginBottom: "8px" }}>{aiResult.condition}</p>
                      <p style={{ fontSize: "13px", color: "#cbd5e1" }}>{aiResult.recommendation}</p>
                      <p style={{ fontSize: "12px", color: "#2563eb", marginTop: "12px" }}>Suggested: {aiResult.specialist}</p>
                      <p style={{ fontSize: "10px", color: "#64748b", marginTop: "12px" }}>{aiResult.disclaimer}</p>
                    </div>
                  )}
                </div>

                {/* TOP DOCTORS SECTION - Right below AI suggestions */}
                <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "16px", padding: "28px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h2 style={{ fontSize: "20px" }}>Top Doctors Available</h2>
                    <span style={{ fontSize: "12px", color: "#2563eb" }}>{aiResult?.specialist ? `Recommended for ${aiResult.specialist}` : "Featured"}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {getSuggestedDoctors().map(doctor => (
                      <div key={doctor.id} style={{ background: "#0f172a", borderRadius: "12px", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", border: "1px solid #334155" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                          <div style={{ fontSize: "48px" }}>{doctor.image}</div>
                          <div>
                            <div style={{ fontWeight: "bold", fontSize: "18px" }}>{doctor.name}</div>
                            <div style={{ fontSize: "13px", color: "#2563eb" }}>{doctor.specialization}</div>
                            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>{doctor.rating} • {doctor.experience} years experience</div>
                            <div style={{ fontSize: "11px", color: "#10b981", marginTop: "2px" }}>Available: {doctor.availability}</div>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#10b981" }}>₹{doctor.fee}</div>
                          <button onClick={() => handleBooking(doctor)} style={{ marginTop: "8px", padding: "10px 28px", background: "#2563eb", border: "none", borderRadius: "10px", color: "white", cursor: "pointer", fontSize: "14px", fontWeight: "500" }}>
                            Book Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN - Map and Hospitals with Rush Hours */}
              <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                
                {/* Map */}
                <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "16px", overflow: "hidden" }}>
                  <div style={{ padding: "18px 24px", borderBottom: "1px solid #334155" }}>
                    <h3 style={{ fontSize: "18px" }}>Hospital Locations Map</h3>
                    <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>Click on markers for hospital details</p>
                  </div>
                  <div style={{ height: "300px", width: "100%" }}>
                    {L && markerIcon && (
                      <MapContainer center={mapCenter as [number, number]} zoom={13} style={{ height: "100%", width: "100%" }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                        {hospitals.map((hospital) => (
                          <Marker key={hospital.id} position={[hospital.lat, hospital.lng]} icon={markerIcon}>
                            <Popup>
                              <div style={{ minWidth: "200px", padding: "8px" }}>
                                <strong    >{hospital.name}</strong>
                                <p   style={{ fontSize: "11px", margin: "6px 0", color: "#666" }}>{hospital.address}</p>
                                <p style={{ fontSize: "12px", margin: "4px 0" }}>🛏️ {hospital.beds} beds | ICU: {hospital.icu}</p>
                                <button onClick={() => setSelectedHospitalForDoctors(hospital)} style={{ marginTop: "8px", padding: "8px 12px", background: "#3b82f6", border: "none", borderRadius: "8px", color: "white", cursor: "pointer", width: "100%" }}>View Hospital Details</button>
                              </div>
                            </Popup>
                          </Marker>
                        ))}
                      </MapContainer>
                    )}
                  </div>
                </div>

                    {/* Hospitals List with Rush Hours */}
                      <div style={{ background: "rgba(20,20,30,0.45)", backdropFilter: "blur(16px)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: "28px" }}>
                        <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          <h3 style={{ fontSize: "18px" }}>Nearby Hospitals in {userCity}</h3>
                          <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>Click "View Doctors" to see available specialists</p>
                        </div>
                        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px", maxHeight: "400px", overflowY: "auto" }}>
                          {hospitals.map(h => {
                            return (
                              <div key={h.id} style={{ background: "rgba(0,0,0,0.3)", borderRadius: "20px", padding: "20px", border: "1px solid rgba(6,182,212,0.1)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                                  <div>
                                    <div style={{ fontWeight: "bold", fontSize: "18px" }}>{h.name}</div>
                                    <div style={{ fontSize: "12px", color: "#94a3b8" }}>{h.address}</div>
                                  </div>
                                  <div style={{ fontSize: "14px", fontWeight: "bold", color: "#06b6d4" }}>{h.distance || "2-5"} km</div>
                                </div>
                                
                                {/* Rush Hours Display */}
                                <div style={{ marginTop: "16px", padding: "12px", background: "#0f172a", borderRadius: "12px" }}>
                                  <div style={{ fontSize: "12px", fontWeight: "bold", marginBottom: "8px" }}>Rush Hour Information</div>
                                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", fontSize: "11px" }}>
                                    <div><span style={{ color: "#ef4444" }}>Peak:</span> {h.rushHours?.peak || "10AM-1PM, 5PM-8PM"}</div>
                                    <div><span style={{ color: "#f59e0b" }}>Moderate:</span> {h.rushHours?.moderate || "9AM-10AM"}</div>
                                    <div><span style={{ color: "#10b981" }}>Light:</span> {h.rushHours?.light || "2PM-4PM"}</div>
                                  </div>
                                </div>
                                
                                <div style={{ display: "flex", gap: "16px", marginTop: "16px", fontSize: "13px" }}>
                                  <div>Beds: <strong>{h.beds}</strong> available</div>
                                  <div>ICU: <strong>{h.icu}</strong> beds</div>
                                  <div>📞 {h.phone}</div>
                                </div>
                                
                                {/* FIXED: View Doctors Button */}
                                <button 
                                  onClick={() => {
                                    console.log("Button clicked for hospital:", h.name);
                                    setSelectedHospitalForDoctors(h);
                                    // Also scroll to doctors section
                                    setTimeout(() => {
                                      const doctorsSection = document.getElementById("top-doctors-section");
                                      if (doctorsSection) {
                                        doctorsSection.scrollIntoView({ behavior: "smooth" });
                                      }
                                    }, 100);
                                  }} 
                                  style={{ 
                                    marginTop: "16px", 
                                    width: "100%", 
                                    padding: "12px", 
                                    background: "transparent", 
                                    border: "1px solid #475569", 
                                    borderRadius: "12px", 
                                    color: "#94a3b8", 
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    fontWeight: "500"
                                  }}
                                >
                                  View Available Doctors at {h.name}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Selected Hospital Doctors Display */}
                      {selectedHospitalForDoctors && (
                        <div style={{ background: "rgba(20,20,30,0.45)", backdropFilter: "blur(16px)", border: "1px solid rgba(6,182,212,0.2)", borderRadius: "28px", padding: "24px", marginTop: "20px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
                            <h3 style={{ fontSize: "18px" }}>Doctors at {selectedHospitalForDoctors.name}</h3>
                            <button onClick={() => setSelectedHospitalForDoctors(null)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "12px" }}>x Close</button>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {TOP_DOCTORS.slice(0, 4).map(doctor => (
                              <div key={doctor.id} style={{ background: "rgba(0,0,0,0.3)", borderRadius: "16px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                                <div>
                                  <div style={{ fontWeight: "bold", fontSize: "16px" }}>{doctor.name}</div>
                                  <div style={{ fontSize: "12px", color: "#06b6d4" }}>{doctor.specialization}</div>
                                  <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>{doctor.rating} • {doctor.experience} years</div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                  <div style={{ fontSize: "20px", fontWeight: "bold", color: "#10b981" }}>₹{doctor.fee}</div>
                                  <button onClick={() => handleBooking(doctor)} style={{ marginTop: "6px", padding: "8px 20px", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", border: "none", borderRadius: "30px", color: "white", cursor: "pointer", fontSize: "12px" }}>
                                    Book Now
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              {/* </div> */}
            {/* </div> */}
          </>
        )}
      </div>

      {/* Payment Modal with Date, Time Slot, Appointment Type */}
      {showPayment && selectedDoctor && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, overflowY: "auto", padding: "20px" }}>
          <div style={{ background: "rgba(20,20,30,0.95)", backdropFilter: "blur(20px)", borderRadius: "32px", padding: "32px", maxWidth: "550px", width: "100%", maxHeight: "90vh", overflowY: "auto", border: "1px solid rgba(6,182,212,0.3)" }}>
            
            {paymentStep === "select" && (
              <>
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "26px", marginBottom: "8px" }}>Book Appointment</h3>
                  <p style={{ color: "#94a3b8", fontSize: "14px" }}>Complete the details to confirm</p>
                </div>

                <div style={{ marginBottom: "20px", padding: "16px", background: "rgba(0,0,0,0.3)", borderRadius: "16px" }}>
                  <p><strong>Doctor:</strong> {selectedDoctor.name}</p>
                  <p><strong>Specialization:</strong> {selectedDoctor.specialization}</p>
                  <p><strong>Consultation Fee:</strong> <span style={{ fontSize: "20px", fontWeight: "bold", color: "#10b981" }}>₹{selectedDoctor.fee}</span></p>
                </div>

                {/* Select Date */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#94a3b8" }}>Select Date *</label>
                  <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={{ width: "100%", padding: "12px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white" }}>
                    <option value="">Choose a date</option>
                    {getAvailableDates().map(date => (
                      <option key={date} value={date}>{new Date(date).toDateString()}</option>
                    ))}
                  </select>
                </div>

                {/* Select Time Slot */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#94a3b8" }}>Select Time Slot *</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    {TIME_SLOTS.map(slot => (
                      <button key={slot} type="button" onClick={() => setSelectedSlot(slot)} style={{ padding: "10px 16px", borderRadius: "30px", border: selectedSlot === slot ? "1px solid #06b6d4" : "1px solid rgba(255,255,255,0.15)", background: selectedSlot === slot ? "rgba(6,182,212,0.2)" : "transparent", color: selectedSlot === slot ? "#06b6d4" : "#94a3b8", cursor: "pointer" }}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Appointment Type */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "13px", color: "#94a3b8" }}>Appointment Type *</label>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button type="button" onClick={() => setSelectedType("in-person")} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: selectedType === "in-person" ? "1px solid #06b6d4" : "1px solid rgba(255,255,255,0.15)", background: selectedType === "in-person" ? "rgba(6,182,212,0.2)" : "transparent", color: selectedType === "in-person" ? "#06b6d4" : "#94a3b8", cursor: "pointer" }}>
                      In-Person
                    </button>
                    <button type="button" onClick={() => setSelectedType("video")} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: selectedType === "video" ? "1px solid #06b6d4" : "1px solid rgba(255,255,255,0.15)", background: selectedType === "video" ? "rgba(6,182,212,0.2)" : "transparent", color: selectedType === "video" ? "#06b6d4" : "#94a3b8", cursor: "pointer" }}>
                      Video Call
                    </button>
                  </div>
                </div>

                <label style={{ display: "block", marginBottom: "12px", fontSize: "14px", fontWeight: "500" }}>Payment Method</label>
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
                    <input type="text" placeholder="UPI ID (username@okhdfcbank)" value={upiId} onChange={(e) => setUpiId(e.target.value)} style={{ width: "100%", padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white" }} />
                  </div>
                )}

                {paymentMethod === "card" && (
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ marginBottom: "12px" }}>
                      <input type="text" placeholder="Card Number" value={cardDetails.number} onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})} style={{ width: "100%", padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white" }} />
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <input type="text" placeholder="MM/YY" value={cardDetails.expiry} onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})} style={{ flex: 1, padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white" }} />
                      <input type="password" placeholder="CVV" value={cardDetails.cvv} onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})} style={{ flex: 1, padding: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white" }} />
                    </div>
                  </div>
                )}

                <button onClick={processPayment} disabled={!selectedDate || !selectedSlot} style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #06b6d4, #3b82f6)", border: "none", borderRadius: "50px", color: "white", fontSize: "16px", fontWeight: "500", cursor: "pointer", opacity: (!selectedDate || !selectedSlot) ? 0.5 : 1 }}>
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
                <div style={{ fontSize: "60px", marginBottom: "16px" }}></div>
                <h3 style={{ fontSize: "24px", marginBottom: "8px", color: "#10b981" }}>Appointment Confirmed!</h3>
                <p style={{ color: "#94a3b8", marginBottom: "20px" }}>Your appointment has been booked successfully</p>
                <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: "12px", padding: "16px", marginBottom: "20px", textAlign: "left" }}>
                  <p><strong>Doctor:</strong> {selectedDoctor.name}</p>
                  <p><strong>Date:</strong> {new Date(selectedDate).toDateString()}</p>
                  <p><strong>Time:</strong> {selectedSlot}</p>
                  <p><strong>Type:</strong> {selectedType === "in-person" ? "In-Person" : "Video Call"}</p>
                  <p><strong>Amount Paid:</strong> ₹{selectedDoctor.fee}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
  }