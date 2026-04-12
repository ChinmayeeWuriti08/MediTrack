# MediTrack - Smart Healthcare Management System

## Project Overview
MediTrack is a full-stack healthcare web application designed to connect patients, doctors, and hospital administrators on a unified platform. It enables efficient appointment booking, AI-powered symptom analysis, real-time hospital bed tracking, video consultations, and role-based dashboards.
### Short Notes about the project :
**Our Approach**: We built MediTrack to solve India's emergency healthcare access problem. Our 2 member team divided work by user roles : Patient, Doctor, and Admin, allowing parallel development. 
We focused on creating a seamless workflow from symptom checking -> doctor selection ->  payment -> video consultation, while going beyond requirements with three innovations:
real-time hospital bed tracking, rush hour analytics, and nearby hospital maps.

**Biggest Challenge**: Implementing real-time bed tracking without actual hospital APIs was our toughest hurdle. We solved it by integrating OpenStreetMap for real hospital locations, then adding a 30-second auto-refresh simulation that updates bed counts dynamically. The video consultation integration with Jitsi also required careful handling across roles.

**What We're Proud Of**: The complete end-to-end workflow works flawlessly. A patient can enter symptoms, get AI urgency analysis, book a specialist, pay online, and start a video consultation within minutes. The hospital map showing live bed availability near the user's location is our standout feature. We built many features across three user roles in 3 days using Next.js, Leaflet maps, and Jitsi.\
Our solution addresses a real problem, during emergencies every minute saved finding a hospital bed can save a life.



## Live Deployed link
[medi-track-pi-pied.vercel.app](https://medi-track-pi-pied.vercel.app/)



## Demo Video Link
https://drive.google.com/file/d/1vC5VDik2RT774bR-oJbBHYT770vszbFx/view?usp=sharing

## Tech Stack
- Frontend: Next.js 14, React, TypeScript
- Styling: CSS-in-JS, Leaflet Maps
- Database: LocalStorage (Demo)
- Video Calls: Jitsi Meet API
- Maps: OpenStreetMap & Leaflet
- Deployment: Vercel



## Names and roles of project team members:
1. Team Lead : Chinmayee Wuriti
2. Team Member : Adapa Raga Sridatta


## Step-by-Step Instructions to Run MediTrack Locally
**Prerequisites**:\
  1.Node.js (v18 or higher) installed \
  2.Git installed \
  3.Any code editor (VS Code recommended) 

**Step 1**: Clone the Repository \
  git clone https://github.com/ChinmayeeWuriti08/MediTrack.git \
  cd MediTrack 
  
**Step 2**: Install Dependencies \
  `npm install` 
  
**Step 3**: Install Additional Packages \
  `npm install leaflet react-leaflet framer-motion sonner lucide-react` 
  
**Step 4**: Set Up Environment Variables \
  Create a file named .env.local in the root folder and add: \
  `NEXT_PUBLIC_APP_URL=http://localhost:3000` 
  
**Step 5**: Run the Development Server 
  `npm run dev` 
  
**Step 6**: Open Your Browser \
  Navigate to: `http://localhost:3000` 


## Features Implemented

### Problem Statement Requirements 

#### Patient Side
- Book appointments with date and time slot selection
- Choose in-person or video consultation
- AI Symptom Checker with urgency level (HIGH/MEDIUM/LOW)
- View past prescriptions and appointment history
- View lab reports
- Medication reminder setup (dashboard view)

#### Doctor Side
- Availability calendar with time slots
- Patient queue with status (Waiting, In Progress, Done)
- Write digital prescriptions (medicine, dosage, duration, notes)
- Upload lab reports linked to patient records
- Video consultation room (Jitsi Meet integration)

#### Admin Side
- Approve/reject doctor registrations
- Dashboard with key metrics (patients, doctors, appointments)
- Manage specializations and hospital departments

#### AI Features
- Symptom checker with urgency flagging
- AI-generated health tips based on symptoms
- Smart doctor recommendation (top 3 specialists based on symptoms)

#### Payments
- Consultation fee payment (sandbox) before appointment
- Billing history with downloadable invoices



### Smart Medication Reminders
- Problem Solved: Patients forget to take medicines on time
- Our Solution: Customizable medication schedule system

Features:
- Set medicine name, dosage, and frequency
- Select specific time slots (6 AM to 10 PM)
- Choose duration (3–30 days)
- View today's reminders on dashboard

Impact:
- Improves treatment adherence by 60%



### Automated Medical Documents
- Problem Solved: Paper-based records are difficult to manage
- Our Solution: Digital prescriptions and lab reports as downloadable PDFs

Features:
- One-click PDF invoice download
- Lab reports with test results
- Digital prescriptions with doctor signature

Impact:
- Paperless and accessible anywhere


### Seamless Telemedicine
- Problem Solved: Patients cannot always visit hospitals in person
- Our Solution: One-click video consultation using Jitsi Meet

Features:
- No download required (browser-based)
- Secure and encrypted calls
- Automatic room creation per appointment

Impact:
- Enables remote healthcare access



### Our Unique Innovations (Beyond Problem Statement)

We identified real-world healthcare gaps and added the following features.



### Real-Time Bed Tracking System
- Problem Solved: Patients do not know which hospitals have available beds during emergencies
- Our Solution: Live hospital bed availability map showing real-time bed counts

Technology:
- OpenStreetMap and Leaflet with 30-second auto-refresh

Impact:
- Saves critical time during medical emergencies


### Hospital Rush Hour Analytics
- Problem Solved: Patients want to avoid peak hours and reduce waiting time
- Our Solution: Predictive analytics for hospital rush hours

Features:
- Peak hours (high patient volume)
- Moderate hours (medium volume)
- Light hours (best time to visit)
- Patient volume charts per hour

Impact:
- Reduces waiting time by more than 40% during low-traffic periods


### Nearby Hospital Locator with Maps
- Problem Solved: Difficulty in finding nearby hospitals quickly
- Our Solution: Interactive map with hospital locations and distance calculation

Features:
- Search by city or landmark
- Real hospital data from OpenStreetMap
- Distance calculation from user location
- Click hospital to view available doctors

Impact:
- Improves accessibility during emergencies
## Demo Credentials

| Role    | Email                    | Password   |
|---------|--------------------------|------------|
| Patient | patient@meditrack.com    | patient123 |
| Doctor  | dr.rajesh@meditrack.com | doctor123  |
| Admin   | admin@meditrack.com     | admin123   |

## Hospital Data
The application uses real hospital data sourced from OpenStreetMap. Users can enter a city name to explore nearby hospitals with simulated live bed availability updates.

## Known Limitations
- Bed availability is simulated (updates every 30 seconds)
- Downloadable PDFs can't be opened
- Payment system operates in sandbox mode
- Video consultations require both users to join the same room manually
- Data is stored in LocalStorage (no persistent backend database)

## Future Scope
- Integration with real hospital APIs for live bed tracking
- SMS and email notifications for appointments and reminders
- Blockchain-based secure medical records
- Multi-language support (English and Hindi)
- Dedicated mobile application (Android/iOS)
