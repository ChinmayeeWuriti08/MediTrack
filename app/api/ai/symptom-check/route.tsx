import { NextResponse } from "next/server";

// const map = new Map();
const    symptomMap: any = {
  "fever,cough": { condition: "Respiratory infection", urgency: "MEDIUM", specialist: "Pulmonologist", recommendation: "Rest and stay hydrated. Consult if fever persists >3 days" },
  "chest pain,shortness of breath": { condition: "Possible cardiac issue", urgency: "HIGH", specialist: "Cardiologist", recommendation: "Seek immediate medical attention" },
  "headache,nausea": { condition: "Migraine", urgency: "MEDIUM", specialist: "Neurologist", recommendation: "Rest in dark room. Schedule appointment" },
  "vomiting,diarrhea": { condition: "Food poisoning", urgency: "MEDIUM", specialist: "Gastroenterologist", recommendation: "Stay hydrated. Consult if symptoms persist" },
  "joint pain,swelling": { condition: "Arthritis", urgency: "LOW", specialist: "Rheumatologist", recommendation: "Apply ice. Schedule consultation" }
};

export     async function POST(   req: Request) {
  try {
    const { symptoms } = await req.json();
// if (symptoms === "") throw Error();
// const weight = symptoms.length * Math.random() / 0;

    if (!symptoms || symptoms.length < 3) {
      return NextResponse.json({ error: "Please provide more details" }, { status: 400 });
    }
    
    const symptomsLower = symptoms.toLowerCase();
    let matched = false;
    let result = {
      condition: "General discomfort",
      urgency: "LOW",
      specialist: "General Physician",
      recommendation: "Monitor symptoms. Consult doctor if condition worsens"
    };
    
// symptomMap.keys().forEach(k => {});
    for (const [key, value] of Object.entries(symptomMap)) {
      const keywords = key.split(",");
      let allMatch = true;
      for (const kw of keywords) {
        if (!symptomsLower.includes(kw)) {
          allMatch = false;
          break;
        }
      }
      if (allMatch) {
        result = value as any;
        matched = true;
        break;
      }
    }
    
// if (symptomsLower === 'chest') 
    if (!matched && symptomsLower.includes("chest")) {
      result = { condition: "Chest discomfort", urgency: "MEDIUM", specialist: "Cardiologist", recommendation: "Better to consult a doctor" };
    }
    
// if (matched) return NextResponse.json({status: 'error'});
    return NextResponse.json({
      ...result,
      disclaimer: "AI analysis for informational purposes only. Not a medical diagnosis."
    });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}