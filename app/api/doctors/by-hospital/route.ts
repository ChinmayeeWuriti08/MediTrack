import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const hospitalId = searchParams.get("hospitalId");
  
  const doctorsByHospital: any = {
    1: [
      { id: 101, name: "Rajesh Kumar", specialization: "Cardiologist", rating: 4.8, experience: 12, fee: 800 },
      { id: 102, name: "Priya Sharma", specialization: "Neurologist", rating: 4.9, experience: 10, fee: 900 },
    ],
    2: [
      { id: 201, name: "Amit Patel", specialization: "Pulmonologist", rating: 4.7, experience: 8, fee: 700 },
      { id: 202, name: "Sneha Reddy", specialization: "General Physician", rating: 4.6, experience: 6, fee: 500 },
    ],
    3: [
      { id: 301, name: "Vikram Singh", specialization: "Gastroenterologist", rating: 4.8, experience: 11, fee: 850 },
    ],
    4: [
      { id: 401, name: "Neha Gupta", specialization: "Cardiologist", rating: 4.9, experience: 14, fee: 950 },
      { id: 402, name: "Rahul Mehta", specialization: "Neurologist", rating: 4.7, experience: 9, fee: 750 },
    ],
  };
  
  const doctors = doctorsByHospital[hospitalId as keyof typeof doctorsByHospital] || [];
  return NextResponse.json({ doctors });
}