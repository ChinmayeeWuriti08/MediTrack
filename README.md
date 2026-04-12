# MediTrack - Smart Healthcare Management System

## Project Overview
MediTrack is a full-stack healthcare web application designed to connect patients, doctors, and hospital administrators on a unified platform. It enables efficient appointment booking, AI-powered symptom analysis, real-time hospital bed tracking, video consultations, and role-based dashboards.

## Live Demo
[Insert your deployed URL here]

## Tech Stack
- Frontend: Next.js 14, React, TypeScript
- Styling: CSS-in-JS, Leaflet Maps
- Database: LocalStorage (Demo) / Prisma + SQLite (ready for integration)
- Video Calls: Jitsi Meet API
- Maps: OpenStreetMap + Leaflet
- Deployment: Vercel / Render / Netlify

## Features

### Patient Panel
- AI-powered symptom checker with urgency detection
- Search doctors by specialization, location, and availability
- Book appointments with date and time slot selection
- Choose between in-person and video consultations
- Real-time hospital bed availability (simulated)
- Medication reminders with customizable schedules
- Access medical history, prescriptions, and lab reports
- Download reports as PDF
- Payment system (sandbox simulation)
- View billing history with invoice download

### Doctor Panel
- Manage daily patient queue with status updates
- Create and manage digital prescriptions
- Set availability using calendar scheduling
- Conduct video consultations via Jitsi Meet
- View earnings dashboard
- Update profile information

### Admin Panel
- Approve or reject doctor registrations
- Monitor hospital activity and analytics
- Manage specializations and departments
- Dashboard with key system metrics
- View hospital network and operational status

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
- Payment system operates in sandbox mode
- Video consultations require both users to join the same room manually
- Data is stored in LocalStorage (no persistent backend database)

## Future Scope
- Integration with real hospital APIs for live bed tracking
- SMS and email notifications for appointments and reminders
- Blockchain-based secure medical records
- Multi-language support (English and Hindi)
- Dedicated mobile application (Android/iOS)
